import type { InventoryMovement } from "@/types";
import { getDb } from "@/lib/db";
import { getLowStockProducts, stockStatus } from "./products";

export async function listMovements(opts: { page?: number; perPage?: number; productId?: string; type?: string } = {}) {
  const db = await getDb();
  const page = Math.max(1, opts.page ?? 1);
  const perPage = Math.min(50, Math.max(1, opts.perPage ?? 15));
  const query: Record<string, unknown> = {};
  if (opts.productId) query.productId = opts.productId;
  if (opts.type) query.type = opts.type;
  const [items, total] = await Promise.all([
    db.inventoryMovements.find(query as never, { sort: { createdAt: -1 }, skip: (page - 1) * perPage, limit: perPage }),
    db.inventoryMovements.count(query as never),
  ]);
  return { items, total, page, pages: Math.max(1, Math.ceil(total / perPage)), perPage };
}

export async function getInventoryOverview() {
  const db = await getDb();
  const products = await db.products.find({} as never);
  const counts = { in_stock: 0, low_stock: 0, out_of_stock: 0 };
  for (const p of products) counts[stockStatus(p)]++;
  const value = products.reduce((s, p) => s + p.stock * p.costPrice, 0);
  return { totalProducts: products.length, ...counts, stockValue: value };
}

export async function getInventoryMovementsByProduct(productId: string, limit = 15): Promise<InventoryMovement[]> {
  const db = await getDb();
  return db.inventoryMovements.find({ productId } as never, { sort: { createdAt: -1 }, limit });
}

export async function restockLowStockProducts() {
  const db = await getDb();
  const low = await getLowStockProducts();
  let count = 0;
  for (const p of low) {
    const restock = Math.max(20, p.reorderLevel * 3);
    await db.products.updateById(p._id, { stock: p.stock + restock, updatedAt: new Date() });
    await db.inventoryMovements.insertOne({
      productId: p._id,
      productName: p.name,
      sku: p.sku,
      type: "stock_added",
      quantity: restock,
      before: p.stock,
      after: p.stock + restock,
      reason: "Bulk restock",
      createdAt: new Date(),
    });
    count++;
  }
  return count;
}