import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { queryProducts } from "@/lib/services/products";
import { getDb } from "@/lib/db";
import { formatGH } from "@/lib/utils";
import { Badge } from "@/components/ui/card";
import { ProductImage } from "@/components/ui/product-image";
import { ProductActions } from "@/components/admin/product-actions";
import { stockStatus } from "@/lib/services/products";

export const metadata: Metadata = { title: "Products — Auto360 Admin" };

export const dynamic = "force-dynamic";

const toneMap = {
  in_stock: "mint" as const,
  low_stock: "amber" as const,
  out_of_stock: "red" as const,
};
const statusLabel = { in_stock: "In stock", low_stock: "Low stock", out_of_stock: "Out of stock" };

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q = "", category = "" } = await searchParams;
  const [{ items, total }, db] = await Promise.all([queryProducts({ search: q, category, perPage: 48 }), getDb()]);
  const categories = await db.categories.find({} as never, { sort: { name: 1 } });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-carbon-900">Products</h1>
          <p className="text-sm text-carbon-500">{total} products in catalogue</p>
        </div>
        <div className="flex items-center gap-3">
          <form method="get" className="flex items-center gap-2">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by name or SKU…"
              className="h-10 w-56 rounded-xl border border-carbon-200 bg-white px-3 text-sm outline-none focus:border-race-400"
            />
            <select
              name="category"
              defaultValue={category}
              className="h-10 rounded-xl border border-carbon-200 bg-white px-3 text-sm outline-none focus:border-race-400"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>
            <button type="submit" className="h-10 rounded-xl bg-carbon-900 px-4 text-sm font-semibold text-white hover:bg-carbon-800">Search</button>
          </form>
          <Link href="/admin/products/new" className="inline-flex h-10 items-center gap-2 rounded-xl bg-race-500 px-4 text-sm font-semibold text-white shadow-glow hover:bg-race-600">
            <Plus className="h-4 w-4" /> New product
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-carbon-200 bg-white shadow-card">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <Package className="h-10 w-10 text-carbon-300" />
            <p className="text-sm text-carbon-500">No products match your search.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-carbon-100 bg-carbon-50/60 text-left text-xs uppercase tracking-wider text-carbon-500">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Cost</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-carbon-100">
              {items.map((p) => {
                const st = stockStatus(p);
                return (
                  <tr key={p._id} className="transition-colors hover:bg-carbon-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                          <ProductImage src={p.images[0]} alt={p.name} productName={p.name} brand={p.brand} fill />
                        </div>
                        <div className="min-w-0">
                          <Link href={`/shop/${p.slug}`} className="line-clamp-1 font-semibold text-carbon-900 hover:text-race-600">
                            {p.name}
                          </Link>
                          <p className="text-xs text-carbon-400">
                            {p.brand} {p.featured && "· Featured"} {p.onSale && "· On sale"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-carbon-500">{p.sku}</td>
                    <td className="px-4 py-3 text-carbon-600">{p.category}</td>
                    <td className="px-4 py-3 text-right font-semibold text-carbon-900">{formatGH(p.price)}</td>
                    <td className="px-4 py-3 text-right text-carbon-500">{formatGH(p.costPrice)}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge tone={toneMap[st]}>{statusLabel[st]}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ProductActions product={p} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}