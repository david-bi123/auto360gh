import type { Order, OrderItem, OrderStatus, Customer } from "@/types";
import { DELIVERY_FEE, ORDER_STATUS_FLOW } from "@/config/constants";
import { getDb } from "@/lib/db";
import { adjustStock } from "./products";

export interface OrderInput {
  customerName: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  items: { productId: string; quantity: number }[];
  orderMethod: "delivery" | "pickup";
  deliveryAddress?: string;
  city?: string;
  notes?: string;
  paymentMethod?: string;
  discount?: number;
}

export async function createOrder(input: OrderInput): Promise<Order> {
  const db = await getDb();

  if (!input.customerName.trim()) throw new Error("Please enter your full name.");
  if (!/^[+]?[\d\s()-]{8,16}$/.test(input.phone.trim())) throw new Error("Please enter a valid phone number.");
  if (input.orderMethod === "delivery" && !input.deliveryAddress?.trim()) {
    throw new Error("Please enter your delivery address.");
  }
  if (input.items.length === 0) throw new Error("Your cart is empty.");

  const items: OrderItem[] = [];
  for (const it of input.items) {
    const product = await db.products.findById(it.productId);
    if (!product || !product.active) throw new Error("One of the products in your cart is no longer available.");
    if (product.stock < it.quantity) {
      throw new Error(
        `Not enough stock for "${product.name}". Available: ${product.stock}. Please reduce the quantity.`
      );
    }
    items.push({
      productId: product._id,
      productName: product.name,
      sku: product.sku,
      unitPrice: product.price,
      quantity: it.quantity,
      lineTotal: product.price * it.quantity,
      image: product.images[0] ?? "",
    });
  }

  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const deliveryFee = input.orderMethod === "delivery" ? DELIVERY_FEE : 0;
  const discount = Math.max(0, input.discount ?? 0);
  const total = Math.max(0, subtotal + deliveryFee - discount);

  const orderCount = await db.orders.count();
  const orderNumber = `AUTO-${1001 + orderCount}`;

  const order: Omit<Order, "_id"> = {
    orderNumber,
    customerId: "",
    customerName: input.customerName.trim(),
    phone: input.phone.trim(),
    whatsapp: input.whatsapp?.trim(),
    email: input.email?.trim(),
    items,
    subtotal,
    deliveryFee,
    discount,
    total,
    orderMethod: input.orderMethod,
    deliveryAddress: input.deliveryAddress?.trim(),
    city: input.city?.trim(),
    notes: input.notes?.trim(),
    paymentMethod: input.paymentMethod ?? "Cash",
    paymentStatus: "pending",
    status: "pending",
    timeline: [{ status: "pending", at: new Date() }],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const saved = await db.orders.insertOne(order);

  for (const it of input.items) {
    await adjustStock(it.productId, -it.quantity, "order", {
      reference: orderNumber,
      performedBy: input.customerName.trim(),
    });
  }

  await upsertCustomerFromOrder(saved);

  await db.notifications.insertOne({
    type: "order",
    title: "New order received",
    message: `${saved.customerName} placed order ${saved.orderNumber} (GH₵ ${saved.total.toFixed(2)}).`,
    read: false,
    link: "/admin/orders",
    createdAt: new Date(),
  });

  return saved;
}

async function upsertCustomerFromOrder(order: Order) {
  const db = await getDb();
  const existing = await db.customers.findOne({ phone: order.phone });
  if (existing) {
    await db.customers.updateById(existing._id, {
      name: order.customerName,
      phone: order.phone,
      whatsapp: order.whatsapp || existing.whatsapp,
      email: order.email || existing.email,
      totalOrders: existing.totalOrders + 1,
      totalSpent: existing.totalSpent + order.total,
      updatedAt: new Date(),
    });
    return existing;
  }
  const customer: Omit<Customer, "_id" | "createdAt" | "updatedAt"> = {
    name: order.customerName,
    phone: order.phone,
    whatsapp: order.whatsapp,
    email: order.email,
    address: order.deliveryAddress,
    city: order.city,
    totalOrders: 1,
    totalSpent: order.total,
  };
  return db.customers.insertOne({ ...customer, createdAt: new Date(), updatedAt: new Date() });
}

export async function listOrders(opts: { page?: number; perPage?: number; status?: OrderStatus; search?: string } = {}) {
  const db = await getDb();
  const page = Math.max(1, opts.page ?? 1);
  const perPage = Math.min(50, Math.max(1, opts.perPage ?? 12));
  const query: Record<string, unknown> = {};
  if (opts.status) query.status = opts.status;
  if (opts.search) {
    query.$or = [
      { orderNumber: { $regex: opts.search, $options: "i" } },
      { customerName: { $regex: opts.search, $options: "i" } },
      { phone: { $regex: opts.search, $options: "i" } },
    ];
  }
  const [items, total] = await Promise.all([
    db.orders.find(query as never, { sort: { createdAt: -1 }, skip: (page - 1) * perPage, limit: perPage }),
    db.orders.count(query as never),
  ]);
  return { items, total, page, pages: Math.max(1, Math.ceil(total / perPage)), perPage };
}

export async function getOrder(id: string): Promise<Order | null> {
  const db = await getDb();
  return db.orders.findById(id);
}

export async function getOrderByNumber(number: string): Promise<Order | null> {
  const db = await getDb();
  return db.orders.findOne({ orderNumber: number });
}

export async function getOrdersForCustomer(opts: { email?: string; phone?: string }): Promise<Order[]> {
  const db = await getDb();
  const query: Record<string, unknown> = {};
  if (opts.email || opts.phone) {
    const or: Record<string, unknown>[] = [];
    if (opts.email) or.push({ email: opts.email });
    if (opts.phone) or.push({ phone: opts.phone });
    query.$or = or;
  }
  return db.orders.find(query as never, { sort: { createdAt: -1 } });
}

export async function updateOrderStatus(id: string, status: OrderStatus, note?: string): Promise<Order> {
  const db = await getDb();
  const order = await db.orders.findById(id);
  if (!order) throw new Error("Order not found.");

  const currentIdx = ORDER_STATUS_FLOW.indexOf(order.status);
  const targetIdx = ORDER_STATUS_FLOW.indexOf(status);

  let timeline = order.timeline;
  if (ORDER_STATUS_FLOW.includes(status)) {
    const trimmed = timeline.filter((t) => ORDER_STATUS_FLOW.includes(t.status));
    const step = targetIdx >= 0 ? targetIdx : 0;
    for (let i = trimmed.length; i <= step; i++) {
      trimmed.push({ status: ORDER_STATUS_FLOW[i], at: new Date() });
    }
    if (!ORDER_STATUS_FLOW.includes(order.status)) {
      trimmed.push({ status, at: new Date() });
    }
    timeline = trimmed;
  } else {
    timeline = [...order.timeline.filter((t) => t.status !== status), { status, at: new Date(), note }];
  }
  void currentIdx;

  const updated = (await db.orders.updateById(id, {
    status,
    timeline,
    paymentStatus: status === "completed" ? "paid" : order.paymentStatus,
    updatedAt: new Date(),
  }))!;

  return updated;
}

export async function getOrderStats() {
  const db = await getDb();
  const all = await db.orders.find({} as never);
  const revenue = all.filter((o) => o.status !== "cancelled" && o.status !== "refunded").reduce((s, o) => s + o.total, 0);
  const counts: Record<OrderStatus, number> = {
    pending: 0,
    confirmed: 0,
    processing: 0,
    ready: 0,
    out_for_delivery: 0,
    completed: 0,
    cancelled: 0,
    refunded: 0,
  };
  for (const o of all) counts[o.status] = (counts[o.status] ?? 0) + 1;
  return { total: all.length, revenue, counts };
}