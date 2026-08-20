import type { Customer } from "@/types";
import { getDb } from "@/lib/db";

export async function listCustomers(opts: { page?: number; perPage?: number; search?: string } = {}) {
  const db = await getDb();
  const page = Math.max(1, opts.page ?? 1);
  const perPage = Math.min(50, Math.max(1, opts.perPage ?? 12));
  const query: Record<string, unknown> = {};
  if (opts.search) {
    query.$or = [
      { name: { $regex: opts.search, $options: "i" } },
      { phone: { $regex: opts.search, $options: "i" } },
      { email: { $regex: opts.search, $options: "i" } },
    ];
  }
  const [items, total] = await Promise.all([
    db.customers.find(query as never, { sort: { totalSpent: -1 }, skip: (page - 1) * perPage, limit: perPage }),
    db.customers.count(query as never),
  ]);
  return { items, total, page, pages: Math.max(1, Math.ceil(total / perPage)), perPage };
}

export async function getCustomer(id: string): Promise<Customer | null> {
  const db = await getDb();
  return db.customers.findById(id);
}

export async function getCustomerOrders(customerId: string) {
  const db = await getDb();
  const customer = await db.customers.findById(customerId);
  if (!customer) return [];
  return db.orders.find({ phone: customer.phone } as never, { sort: { createdAt: -1 } });
}

export async function getCustomersStats() {
  const db = await getDb();
  const all = await db.customers.find({} as never);
  const totalSpent = all.reduce((s, c) => s + c.totalSpent, 0);
  const avgOrder = all.length ? Math.round(totalSpent / all.length) : 0;
  return { total: all.length, totalSpent, avgOrder };
}