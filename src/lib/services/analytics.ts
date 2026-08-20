import { getDb } from "@/lib/db";
import { stockStatus } from "./products";

export interface DashboardStats {
  revenue: number;
  orders: number;
  products: number;
  customers: number;
  lowStock: number;
  onlineRevenue: number;
  posRevenue: number;
  avgOrderValue: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const db = await getDb();
  const [orders, sales, products, customers] = await Promise.all([
    db.orders.find({} as never),
    db.sales.find({} as never),
    db.products.find({} as never),
    db.customers.find({} as never),
  ]);

  const onlineRevenue = orders
    .filter((o) => o.status !== "cancelled" && o.status !== "refunded")
    .reduce((s, o) => s + o.total, 0);
  const posRevenue = sales.reduce((s, x) => s + x.total, 0);
  const revenue = onlineRevenue + posRevenue;
  const lowStock = products.filter((p) => stockStatus(p) === "low_stock" || stockStatus(p) === "out_of_stock").length;

  const validOrders = orders.filter((o) => o.status !== "cancelled" && o.status !== "refunded");
  const avgOrderValue = validOrders.length ? Math.round(onlineRevenue / validOrders.length) : 0;

  return {
    revenue,
    orders: orders.length,
    products: products.length,
    customers: customers.length,
    lowStock,
    onlineRevenue,
    posRevenue,
    avgOrderValue,
  };
}

interface SalesPoint {
  label: string;
  revenue: number;
  orders: number;
  pos: number;
}

export async function getSalesOverTime(days = 30): Promise<SalesPoint[]> {
  const db = await getDb();
  const now = new Date();
  const start = new Date(now.getTime() - (days - 1) * 86400000);
  start.setHours(0, 0, 0, 0);

  const [orders, sales] = await Promise.all([
    db.orders.find({ createdAt: { $gte: start } } as never),
    db.sales.find({ createdAt: { $gte: start } } as never),
  ]);

  const points: SalesPoint[] = [];
  const byDay = new Map<string, { revenue: number; orders: number; pos: number }>();

  for (let i = 0; i < days; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    const key = d.toISOString().slice(0, 10);
    byDay.set(key, { revenue: 0, orders: 0, pos: 0 });
  }

  for (const o of orders) {
    if (o.status === "cancelled" || o.status === "refunded") continue;
    const key = new Date(o.createdAt).toISOString().slice(0, 10);
    const entry = byDay.get(key);
    if (entry) {
      entry.revenue += o.total;
      entry.orders += 1;
    }
  }
  for (const s of sales) {
    const key = new Date(s.createdAt).toISOString().slice(0, 10);
    const entry = byDay.get(key);
    if (entry) {
      entry.revenue += s.total;
      entry.pos += 1;
    }
  }

  const sorted = [...byDay.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  for (const [key, val] of sorted) {
    const date = new Date(`${key}T00:00:00`);
    points.push({
      label: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(date),
      revenue: Math.round(val.revenue),
      orders: val.orders,
      pos: val.pos,
    });
  }
  return points;
}

export interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
  image: string;
}

export async function getTopProducts(limit = 5): Promise<TopProduct[]> {
  const db = await getDb();
  const [orders, sales] = await Promise.all([db.orders.find({} as never), db.sales.find({} as never)]);
  const map = new Map<string, { name: string; image: string; quantity: number; revenue: number }>();
  const add = (name: string, image: string, qty: number, revenue: number) => {
    const entry = map.get(name) ?? { name, image, quantity: 0, revenue: 0 };
    entry.quantity += qty;
    entry.revenue += revenue;
    map.set(name, entry);
  };
  for (const o of orders) {
    for (const it of o.items) add(it.productName, it.image ?? "", it.quantity, it.lineTotal);
  }
  for (const s of sales) {
    for (const it of s.items) add(it.productName, "", it.quantity, it.lineTotal);
  }
  return [...map.values()]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
}

export async function getCategoryDistribution() {
  const db = await getDb();
  const [orders, sales, products] = await Promise.all([
    db.orders.find({} as never),
    db.sales.find({} as never),
    db.products.find({} as never),
  ]);
  const byProduct = new Map<string, { category: string; qty: number; revenue: number }>();
  for (const o of orders) {
    for (const it of o.items) {
      const p = byProduct.get(it.productId ?? "") ?? { category: "Unknown", qty: 0, revenue: 0 };
      p.qty += it.quantity;
      p.revenue += it.lineTotal;
      byProduct.set(it.productId ?? "", p);
    }
  }
  for (const s of sales) {
    for (const it of s.items) {
      const p = byProduct.get(it.productId ?? "") ?? { category: "Unknown", qty: 0, revenue: 0 };
      p.qty += it.quantity;
      p.revenue += it.lineTotal;
      byProduct.set(it.productId ?? "", p);
    }
  }
  for (const [pid, p] of byProduct) {
    const prod = products.find((x) => x._id === pid);
    if (prod) p.category = prod.category;
  }
  const byCategory = new Map<string, number>();
  for (const p of byProduct.values()) {
    byCategory.set(p.category, (byCategory.get(p.category) ?? 0) + p.revenue);
  }
  return [...byCategory.entries()].map(([name, value]) => ({ name, value: Math.round(value) })).sort((a, b) => b.value - a.value);
}

export async function getProfitReport() {
  const db = await getDb();
  const [orders, sales, products] = await Promise.all([
    db.orders.find({} as never),
    db.sales.find({} as never),
    db.products.find({} as never),
  ]);
  const cost = new Map(products.map((p) => [p._id, p.costPrice]));
  let grossProfit = 0;
  let revenue = 0;
  let costValue = 0;
  for (const o of orders) {
    if (o.status === "cancelled" || o.status === "refunded") continue;
    for (const it of o.items) {
      const c = cost.get(it.productId ?? "") ?? it.unitPrice * 0.7;
      grossProfit += (it.unitPrice - c) * it.quantity;
      costValue += c * it.quantity;
      revenue += it.lineTotal;
    }
  }
  for (const s of sales) {
    for (const it of s.items) {
      const c = cost.get(it.productId ?? "") ?? it.unitPrice * 0.7;
      grossProfit += (it.unitPrice - c) * it.quantity;
      costValue += c * it.quantity;
      revenue += it.lineTotal;
    }
  }
  return {
    revenue: Math.round(revenue),
    costValue: Math.round(costValue),
    grossProfit: Math.round(grossProfit),
    margin: revenue > 0 ? Math.round((grossProfit / revenue) * 100) : 0,
  };
}

export async function getRecentActivity(limit = 8) {
  const db = await getDb();
  const [orders, sales, notifications] = await Promise.all([
    db.orders.find({} as never, { sort: { createdAt: -1 }, limit }),
    db.sales.find({} as never, { sort: { createdAt: -1 }, limit: 5 }),
    db.notifications.find({ read: false } as never, { sort: { createdAt: -1 }, limit: 5 }),
  ]);
  const events: { id: string; type: "order" | "sale" | "notification"; title: string; subtitle: string; amount?: number; at: Date }[] = [];
  for (const o of orders) {
    events.push({ id: o._id, type: "order", title: `Order ${o.orderNumber}`, subtitle: o.customerName, amount: o.total, at: o.createdAt });
  }
  for (const s of sales) {
    events.push({ id: s._id, type: "sale", title: `POS ${s.receiptNumber}`, subtitle: s.cashierName, amount: s.total, at: s.createdAt });
  }
  for (const n of notifications) {
    events.push({ id: n._id, type: "notification", title: n.title, subtitle: n.message, at: n.createdAt });
  }
  return events.sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, limit);
}

export async function getPaymentMethodMix() {
  const db = await getDb();
  const sales = await db.sales.find({} as never);
  const mix: Record<string, number> = {};
  for (const s of sales) {
    mix[s.paymentMethodLabel] = (mix[s.paymentMethodLabel] ?? 0) + s.total;
  }
  return Object.entries(mix).map(([name, value]) => ({ name, value: Math.round(value) }));
}