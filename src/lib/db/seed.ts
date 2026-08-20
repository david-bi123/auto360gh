import bcrypt from "bcryptjs";
import type {
  BusinessSettings,
  Customer,
  InventoryMovement,
  Order,
  OrderStatus,
  Product,
  Sale,
  SocialLinks,
  User,
} from "@/types";
import { ORDER_STATUS_FLOW } from "@/config/constants";
import { formatGH } from "@/lib/utils";
import type { Db } from "./index";
import {
  seedBrands,
  seedBusinessSettings,
  seedCategories,
  seedCustomers,
  seedProducts,
  seedServices,
  seedSocialLinks,
  seedUsers,
} from "./seed-data";

const DAY = 24 * 60 * 60 * 1000;

function daysAgo(n: number, hour = 11): Date {
  const d = new Date(Date.now() - n * DAY);
  d.setHours(hour, Math.floor(Math.random() * 50), 0, 0);
  return d;
}

async function upsertBy<T extends { _id: string }>(
  col: { findOne(q: { [k: string]: string }): Promise<T | null>; updateById(id: string, u: Partial<T>): Promise<T | null>; insertOne(doc: Omit<T, "_id">): Promise<T> },
  field: string,
  value: string,
  doc: Partial<Omit<T, "_id">>
): Promise<T> {
  const existing = await col.findOne({ [field]: value });
  const withTimestamps = { ...doc, createdAt: new Date(), updatedAt: new Date() } as Omit<T, "_id">;
  if (existing) {
    await col.updateById(existing._id, { ...doc } as Partial<T>);
    return existing;
  }
  return col.insertOne(withTimestamps);
}

interface OrderRecipe {
  daysAgo: number;
  customerIndex: number;
  status: OrderStatus;
  method: "delivery" | "pickup";
  payment: string;
  items: { slug: string; qty: number }[];
  notes?: string;
}

const ORDER_RECIPES: OrderRecipe[] = [
  { daysAgo: 1, customerIndex: 0, status: "pending", method: "pickup", payment: "Cash", items: [{ slug: "liqui-moly-mos2-leichtlauf-10w-40-engine-oil-1l", qty: 2 }, { slug: "liqui-moly-brake-fluid-dot-4-500ml", qty: 1 }], notes: "Call before pickup." },
  { daysAgo: 1, customerIndex: 3, status: "pending", method: "delivery", payment: "Mobile Money", items: [{ slug: "liqui-moly-cera-tec-engine-treatment-300ml", qty: 1 }, { slug: "liqui-moly-fuel-system-cleaner-300ml", qty: 2 }] },
  { daysAgo: 2, customerIndex: 1, status: "confirmed", method: "pickup", payment: "Cash", items: [{ slug: "liqui-moly-top-tec-4200-5w-40-engine-oil-1l", qty: 3 }] },
  { daysAgo: 3, customerIndex: 6, status: "processing", method: "delivery", payment: "Mobile Money", items: [{ slug: "liqui-moly-synthoil-high-tech-5w-50-engine-oil-1l", qty: 2 }, { slug: "liqui-moly-aircon-cleaner-250ml", qty: 1 }] },
  { daysAgo: 5, customerIndex: 2, status: "ready", method: "pickup", payment: "Cash", items: [{ slug: "liqui-moly-molygen-5w-30-engine-oil-1l", qty: 1 }, { slug: "liqui-moly-wheel-cleaner-500ml", qty: 1 }] },
  { daysAgo: 8, customerIndex: 4, status: "out_for_delivery", method: "delivery", payment: "Cash", items: [{ slug: "liqui-moly-atf-1800-automatic-transmission-fluid-1l", qty: 2 }, { slug: "liqui-moly-brake-fluid-dot-4-500ml", qty: 1 }] },
  { daysAgo: 12, customerIndex: 7, status: "completed", method: "delivery", payment: "Mobile Money", items: [{ slug: "liqui-moly-top-tec-4200-5w-40-engine-oil-1l", qty: 2 }, { slug: "liqui-moly-cera-tec-engine-treatment-300ml", qty: 1 }] },
  { daysAgo: 15, customerIndex: 5, status: "completed", method: "pickup", payment: "Cash", items: [{ slug: "liqui-moly-leichtlauf-high-tech-5w-40-engine-oil-1l", qty: 4 }, { slug: "liqui-moly-brake-fluid-dot-4-500ml", qty: 2 }] },
  { daysAgo: 22, customerIndex: 8, status: "completed", method: "delivery", payment: "Bank Transfer", items: [{ slug: "bosch-iridium-spark-plug-set-4pc", qty: 1 }, { slug: "auto360-genuine-air-filter-toyota-corolla", qty: 1 }] },
  { daysAgo: 28, customerIndex: 9, status: "completed", method: "pickup", payment: "Cash", items: [{ slug: "liqui-moly-coolant-antifreeze-g11-15l", qty: 2 }, { slug: "liqui-moly-universal-car-shampoo-500ml", qty: 1 }] },
  { daysAgo: 35, customerIndex: 0, status: "cancelled", method: "pickup", payment: "Cash", items: [{ slug: "liqui-moly-diesel-purge-300ml", qty: 1 }], notes: "Customer cancelled." },
  { daysAgo: 40, customerIndex: 2, status: "refunded", method: "delivery", payment: "Mobile Money", items: [{ slug: "auto360-ceramic-brake-pads-front-set", qty: 1 }, { slug: "liqui-moly-brake-fluid-dot-51-500ml", qty: 1 }] },
];

const SALE_RECIPES: { daysAgo: number; cashier: string; payment: string; customer?: string; items: { slug: string; qty: number }[]; discount?: number }[] = [
  { daysAgo: 0, cashier: "Ama Mensah", payment: "Cash", items: [{ slug: "liqui-moly-universal-car-shampoo-500ml", qty: 1 }] },
  { daysAgo: 0, cashier: "Nana Kwame", payment: "Mobile Money", customer: "Kojo Amoah", items: [{ slug: "liqui-moly-mos2-leichtlauf-10w-40-engine-oil-1l", qty: 3 }, { slug: "liqui-moly-fuel-system-cleaner-300ml", qty: 1 }] },
  { daysAgo: 1, cashier: "Ama Mensah", payment: "Cash", items: [{ slug: "liqui-moly-brake-fluid-dot-4-500ml", qty: 2 }] },
  { daysAgo: 2, cashier: "Kwabena Owusu", payment: "Card", items: [{ slug: "liqui-moly-cera-tec-engine-treatment-300ml", qty: 1 }, { slug: "liqui-moly-interior-care-leather-vinyl-250ml", qty: 1 }] },
  { daysAgo: 3, cashier: "Nana Kwame", payment: "Cash", customer: "Akosua Boateng", items: [{ slug: "liqui-moly-engine-flush-500ml", qty: 2 }] },
  { daysAgo: 4, cashier: "Ama Mensah", payment: "Mobile Money", items: [{ slug: "liqui-moly-atf-1800-automatic-transmission-fluid-1l", qty: 2 }] },
  { daysAgo: 5, cashier: "Kwabena Owusu", payment: "Cash", items: [{ slug: "liqui-moly-top-tec-4200-5w-40-engine-oil-1l", qty: 2 }, { slug: "liqui-moly-engine-oil-additive-300ml", qty: 1 }] },
  { daysAgo: 7, cashier: "Ama Mensah", payment: "Bank Transfer", customer: "Efua Owusu", items: [{ slug: "liqui-moly-synthoil-high-tech-5w-50-engine-oil-1l", qty: 1 }, { slug: "liqui-moly-brake-fluid-dot-51-500ml", qty: 1 }] },
  { daysAgo: 9, cashier: "Nana Kwame", payment: "Cash", items: [{ slug: "liqui-moly-valve-clean-300ml", qty: 2 }, { slug: "liqui-moly-radiator-cleaner-300ml", qty: 1 }] },
  { daysAgo: 11, cashier: "Ama Mensah", payment: "Mobile Money", customer: "Yaw Asante", items: [{ slug: "liqui-moly-molygen-5w-30-engine-oil-1l", qty: 2 }] },
  { daysAgo: 14, cashier: "Kwabena Owusu", payment: "Cash", items: [{ slug: "liqui-moly-coolant-antifreeze-g12-ready-mix-1l", qty: 3 }] },
  { daysAgo: 16, cashier: "Ama Mensah", payment: "Cash", items: [{ slug: "liqui-moly-diesel-purge-300ml", qty: 1 }, { slug: "liqui-moly-injection-cleaner-petrol-300ml", qty: 1 }] },
  { daysAgo: 20, cashier: "Nana Kwame", payment: "Mobile Money", customer: "Abena Darko", items: [{ slug: "liqui-moly-top-tec-atf-1200-transmission-fluid-1l", qty: 1 }] },
  { daysAgo: 24, cashier: "Ama Mensah", payment: "Cash", items: [{ slug: "liqui-moly-oil-additive-mos2-300ml", qty: 3 }] },
  { daysAgo: 27, cashier: "Kwabena Owusu", payment: "Card", items: [{ slug: "liqui-moly-universal-car-shampoo-500ml", qty: 2 }, { slug: "liqui-moly-wheel-cleaner-500ml", qty: 1 }] },
  { daysAgo: 32, cashier: "Nana Kwame", payment: "Cash", customer: "Kofi Owusu-Ansah", items: [{ slug: "auto360-genuine-air-filter-toyota-corolla", qty: 2 }] },
  { daysAgo: 37, cashier: "Ama Mensah", payment: "Mobile Money", items: [{ slug: "liqui-moly-engine-flush-500ml", qty: 1 }, { slug: "liqui-moly-oil-additive-mos2-300ml", qty: 2 }] },
  { daysAgo: 43, cashier: "Kwabena Owusu", payment: "Cash", customer: "Nana Yaw Osei", items: [{ slug: "liqui-moly-coolant-antifreeze-g11-15l", qty: 2 }] },
];

function buildTimeline(status: OrderStatus, start: Date): Order["timeline"] {
  const timeline: Order["timeline"] = [];
  const flow = ORDER_STATUS_FLOW;
  const idx = flow.indexOf(status);
  const target = idx === -1 ? flow.length - 1 : idx;
  for (let i = 0; i <= target; i++) {
    timeline.push({
      status: flow[i],
      at: new Date(start.getTime() + i * (6 * 60 * 60 * 1000)),
    });
  }
  if (status === "cancelled") {
    timeline.push({ status: "cancelled", at: new Date(start.getTime() + DAY), note: "Cancelled" });
  }
  if (status === "refunded") {
    timeline.push({ status: "refunded", at: new Date(start.getTime() + DAY), note: "Refunded" });
  }
  return timeline;
}

export async function ensureSeeded(db: Db, backend: "mongo" | "memory"): Promise<void> {
  const settingsCol = db.businessSettings;
  const existingSettings = await settingsCol.findOne({ name: seedBusinessSettings.name });
  if (existingSettings) {
    await settingsCol.updateById(existingSettings._id, { ...seedBusinessSettings } as Partial<BusinessSettings>);
  } else {
    await settingsCol.insertOne({ ...seedBusinessSettings, createdAt: new Date(), updatedAt: new Date() });
  }

  const socialCol = db.socialLinks;
  const existingSocial = await socialCol.findOne({});
  if (existingSocial) {
    await socialCol.updateById(existingSocial._id, { ...seedSocialLinks } as Partial<SocialLinks>);
  } else {
    await socialCol.insertOne({ ...seedSocialLinks, updatedAt: new Date() });
  }

  for (const svc of seedServices) {
    await upsertBy(db.services, "slug", svc.slug, svc);
  }
  for (const cat of seedCategories) {
    await upsertBy(db.categories, "slug", cat.slug, cat);
  }
  for (const brand of seedBrands) {
    await upsertBy(db.brands, "slug", brand.slug, brand);
  }

  const users = seedUsers();
  const plainPasswords: Record<string, string> = {
    "admin@auto360gh.com": "Admin@360Gh123",
    "manager@auto360gh.com": "Manager@360Gh123",
    "cashier@auto360gh.com": "Cashier@360Gh123",
    "staff@auto360gh.com": "Staff@360Gh123",
    "customer@auto360gh.com": "Customer@360Gh123",
  };
  for (const u of users) {
    const hashed = await bcrypt.hash(plainPasswords[u.email] ?? "ChangeMe@360", 10);
    await upsertBy<User>(db.users, "email", u.email, { ...u, passwordHash: hashed } as Omit<User, "_id">);
  }

  const productsBySlug = new Map<string, Product>();
  const productDocs = seedProducts();
  for (const p of productDocs) {
    const saved = await upsertBy<Product>(db.products, "sku", p.sku, p as Omit<Product, "_id">);
    productsBySlug.set(saved.slug, saved);
  }

  for (const c of seedCustomers) {
    const existing = await db.customers.findOne({ phone: c.phone });
    if (existing) {
      await db.customers.updateById(existing._id, { ...c } as Partial<Customer>);
    } else {
      await db.customers.insertOne({ ...c, createdAt: new Date(), updatedAt: new Date() });
    }
  }

  const orderCount = await db.orders.count();
  const saleCount = await db.sales.count();
  const movementCount = await db.inventoryMovements.count();

  interface Event {
    date: Date;
    kind: "order" | "pos_sale";
    slug: string;
    qty: number;
  }
  const events: Event[] = [];

  if (orderCount === 0) {
    let seq = 1001;
    for (const r of ORDER_RECIPES) {
      const customer = seedCustomers[r.customerIndex];
      const created = daysAgo(r.daysAgo, 9 + (seq % 8));
      const items = r.items.map((it) => {
        const p = productsBySlug.get(it.slug)!;
        return {
          productId: p._id,
          productName: p.name,
          sku: p.sku,
          unitPrice: p.price,
          quantity: it.qty,
          lineTotal: p.price * it.qty,
          image: p.images[0] ?? "",
        };
      });
      const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
      const deliveryFee = r.method === "delivery" ? 20 : 0;
      const order: Omit<Order, "_id"> = {
        orderNumber: `AUTO-${seq}`,
        customerId: "",
        customerName: customer.name,
        phone: customer.phone,
        whatsapp: customer.whatsapp,
        email: customer.email,
        items,
        subtotal,
        deliveryFee,
        discount: 0,
        total: subtotal + deliveryFee,
        orderMethod: r.method,
        deliveryAddress: r.method === "delivery" ? customer.address : undefined,
        city: customer.city,
        notes: r.notes,
        paymentMethod: r.payment,
        paymentStatus: r.status === "cancelled" || r.status === "refunded" ? "refunded" : "pending",
        status: r.status,
        timeline: buildTimeline(r.status, created),
        createdAt: created,
        updatedAt: created,
      };
      await db.orders.insertOne(order);
      for (const it of r.items) events.push({ date: created, kind: "order", slug: it.slug, qty: it.qty });
      seq++;
    }
  }

  if (saleCount === 0) {
    let seq = 1001;
    for (const s of SALE_RECIPES) {
      const created = daysAgo(s.daysAgo, 10 + (seq % 8));
      const items = s.items.map((it) => {
        const p = productsBySlug.get(it.slug)!;
        return {
          productId: p._id,
          productName: p.name,
          sku: p.sku,
          unitPrice: p.price,
          quantity: it.qty,
          lineTotal: p.price * it.qty,
        };
      });
      const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
      const discount = s.discount ?? (subtotal > 600 ? Math.round(subtotal * 0.05) : 0);
      const total = subtotal - discount;
      const sale: Omit<Sale, "_id"> = {
        receiptNumber: `RCP-${seq}`,
        items,
        subtotal,
        discount,
        total,
        amountPaid: total,
        change: 0,
        paymentMethod: s.payment.toLowerCase().replace(/\s+/g, "_") as Sale["paymentMethod"],
        paymentMethodLabel: s.payment,
        cashierName: s.cashier,
        customerName: s.customer,
        createdAt: created,
      };
      await db.sales.insertOne(sale);
      for (const it of s.items) events.push({ date: created, kind: "pos_sale", slug: it.slug, qty: it.qty });
      seq++;
    }
  }

  if (movementCount === 0 && events.length > 0) {
    const running = new Map<string, number>();
    const consumed = new Map<string, number>();
    for (const e of events) {
      consumed.set(e.slug, (consumed.get(e.slug) ?? 0) + e.qty);
    }
    for (const [slug, qty] of consumed) {
      const p = productsBySlug.get(slug)!;
      running.set(slug, p.stock + qty);
    }
    const sorted = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
    for (const e of sorted) {
      const p = productsBySlug.get(e.slug)!;
      const before = running.get(e.slug)!;
      const after = before - e.qty;
      running.set(e.slug, after);
      await db.inventoryMovements.insertOne({
        productId: p._id,
        productName: p.name,
        sku: p.sku,
        type: e.kind === "order" ? "order" : "pos_sale",
        quantity: -e.qty,
        before,
        after,
        reference: e.kind === "order" ? "Customer Order" : "POS Receipt",
        createdAt: e.date,
      });
    }
  }

  const notifCount = await db.notifications.count();
  if (notifCount === 0) {
    const pendingOrder = await db.orders.findOne({ status: "pending" });
    const base = {
      read: false,
      createdAt: new Date(),
    };
    await db.notifications.insertMany([
      {
        ...base,
        type: "order",
        title: "New order received",
        message: pendingOrder ? `${pendingOrder.customerName} placed order ${pendingOrder.orderNumber} (${formatGH(pendingOrder.total)}).` : "A new order has been placed.",
        link: "/admin/orders",
      },
      {
        ...base,
        type: "stock",
        title: "Out of stock",
        message: "Auto360 Genuine Oil Filter — Toyota is out of stock.",
        link: "/admin/inventory",
      },
      {
        ...base,
        type: "stock",
        title: "Low stock alert",
        message: "Auto360 Ceramic Brake Pads — Front Set is below reorder level.",
        link: "/admin/inventory",
      },
      {
        ...base,
        type: "system",
        title: "Welcome to Auto360 Gh",
        message: "Your business platform is ready. Manage products, inventory, orders and POS from the dashboard.",
      },
    ]);
  }

  void backend;
}

export function isPlaceholderPassword(hash: string): boolean {
  return hash === "PLACEHOLDER";
}