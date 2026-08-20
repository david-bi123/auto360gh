import type { PaymentMethod, Sale, SaleItem } from "@/types";
import { PAYMENT_METHOD_LABELS } from "@/config/constants";
import { getDb } from "@/lib/db";
import { adjustStock } from "./products";

export interface SaleInput {
  items: { productId: string; quantity: number; price?: number }[];
  discount?: number;
  amountPaid?: number;
  paymentMethod: PaymentMethod;
  cashierName: string;
  customerName?: string;
  notes?: string;
}

export async function createSale(input: SaleInput): Promise<Sale> {
  const db = await getDb();

  if (input.items.length === 0) throw new Error("Add at least one product to the sale.");
  if (!input.cashierName.trim()) throw new Error("Cashier name is required.");

  const items: SaleItem[] = [];
  for (const it of input.items) {
    const product = await db.products.findById(it.productId);
    if (!product || !product.active) throw new Error("One of the selected products is no longer available.");
    if (product.stock < it.quantity) {
      throw new Error(`Not enough stock for "${product.name}". Available: ${product.stock}.`);
    }
    const unitPrice = it.price && it.price > 0 ? it.price : product.price;
    items.push({
      productId: product._id,
      productName: product.name,
      sku: product.sku,
      unitPrice,
      quantity: it.quantity,
      lineTotal: unitPrice * it.quantity,
    });
  }

  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const discount = Math.max(0, Math.min(input.discount ?? 0, subtotal));
  const total = subtotal - discount;
  const amountPaid = input.amountPaid && input.amountPaid > 0 ? input.amountPaid : total;
  const change = Math.max(0, amountPaid - total);

  const saleCount = await db.sales.count();
  const receiptNumber = `RCP-${1001 + saleCount}`;

  const sale: Omit<Sale, "_id"> = {
    receiptNumber,
    items,
    subtotal,
    discount,
    total,
    amountPaid,
    change,
    paymentMethod: input.paymentMethod,
    paymentMethodLabel: PAYMENT_METHOD_LABELS[input.paymentMethod] ?? input.paymentMethod,
    cashierName: input.cashierName.trim(),
    customerName: input.customerName?.trim(),
    notes: input.notes?.trim(),
    createdAt: new Date(),
  };

  const saved = await db.sales.insertOne(sale);

  for (const it of input.items) {
    await adjustStock(it.productId, -it.quantity, "pos_sale", {
      reference: receiptNumber,
      performedBy: input.cashierName.trim(),
    });
  }

  await db.notifications.insertOne({
    type: "sale",
    title: "POS sale completed",
    message: `${saved.cashierName} completed receipt ${saved.receiptNumber} (GH₵ ${saved.total.toFixed(2)}).`,
    read: false,
    link: "/admin/sales",
    createdAt: new Date(),
  });

  return saved;
}

export async function listSales(opts: { page?: number; perPage?: number; search?: string } = {}) {
  const db = await getDb();
  const page = Math.max(1, opts.page ?? 1);
  const perPage = Math.min(50, Math.max(1, opts.perPage ?? 12));
  const query: Record<string, unknown> = {};
  if (opts.search) {
    query.$or = [
      { receiptNumber: { $regex: opts.search, $options: "i" } },
      { customerName: { $regex: opts.search, $options: "i" } },
    ];
  }
  const [items, total] = await Promise.all([
    db.sales.find(query as never, { sort: { createdAt: -1 }, skip: (page - 1) * perPage, limit: perPage }),
    db.sales.count(query as never),
  ]);
  return { items, total, page, pages: Math.max(1, Math.ceil(total / perPage)), perPage };
}

export async function getSale(id: string): Promise<Sale | null> {
  const db = await getDb();
  return db.sales.findById(id);
}

export async function getSaleByReceipt(number: string): Promise<Sale | null> {
  const db = await getDb();
  return db.sales.findOne({ receiptNumber: number });
}

export async function getSalesStats() {
  const db = await getDb();
  const all = await db.sales.find({} as never);
  const revenue = all.reduce((s, x) => s + x.total, 0);
  const byMethod: Record<string, number> = {};
  for (const s of all) {
    byMethod[s.paymentMethodLabel] = (byMethod[s.paymentMethodLabel] ?? 0) + s.total;
  }
  return { total: all.length, revenue, byMethod };
}