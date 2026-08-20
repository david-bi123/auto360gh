import type { Metadata } from "next";
import Link from "next/link";
import { Boxes, Activity, PackageSearch } from "lucide-react";
import { getDb } from "@/lib/db";
import { stockStatus } from "@/lib/services/products";
import { formatGH } from "@/lib/utils";
import { Badge, Card, CardContent } from "@/components/ui/card";
import { ProductImage } from "@/components/ui/product-image";
import { ProductActions } from "@/components/admin/product-actions";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Inventory — Auto360 Admin" };
export const dynamic = "force-dynamic";

const toneMap = {
  in_stock: "mint" as const,
  low_stock: "amber" as const,
  out_of_stock: "red" as const,
};
const statusLabel = { in_stock: "In stock", low_stock: "Low stock", out_of_stock: "Out of stock" };

export default async function AdminInventoryPage() {
  const db = await getDb();
  const products = await db.products.find({} as never, { sort: { name: 1 } });
  const inStock = products.filter((p) => stockStatus(p) === "in_stock").length;
  const lowStock = products.filter((p) => stockStatus(p) === "low_stock").length;
  const outOfStock = products.filter((p) => stockStatus(p) === "out_of_stock").length;
  const stockValue = products.reduce((s, p) => s + p.stock * p.costPrice, 0);

  const cards = [
    { label: "Products", value: String(products.length), sub: `${inStock} healthy`, icon: Boxes, tone: "bg-sky-50 text-sky-600" },
    { label: "Low stock", value: String(lowStock), sub: "Needs attention", icon: PackageSearch, tone: "bg-amber-50 text-amber-600" },
    { label: "Out of stock", value: String(outOfStock), sub: "Cannot sell", icon: PackageSearch, tone: "bg-red-50 text-red-600" },
    { label: "Stock value (cost)", value: formatGH(stockValue), sub: "Total inventory value", icon: Activity, tone: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-carbon-900">Inventory</h1>
          <p className="text-sm text-carbon-500">Track stock levels and movement across your catalogue.</p>
        </div>
        <Link href="/admin/inventory/movements" className="inline-flex h-10 items-center gap-2 rounded-xl bg-carbon-900 px-4 text-sm font-semibold text-white hover:bg-carbon-800">
          <Activity className="h-4 w-4" /> Movement history
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-5">
              <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", c.tone)}>
                <c.icon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-2xl font-extrabold text-carbon-900">{c.value}</p>
              <p className="text-sm text-carbon-500">{c.label}</p>
              <p className="text-xs text-carbon-400">{c.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-carbon-200 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-carbon-100 bg-carbon-50/60 text-left text-xs uppercase tracking-wider text-carbon-500">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3 text-right">In stock</th>
              <th className="px-4 py-3 text-right">Reorder at</th>
              <th className="px-4 py-3 text-right">Unit cost</th>
              <th className="px-4 py-3 text-right">Stock value</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Adjust</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-carbon-100">
            {products.map((p) => {
              const st = stockStatus(p);
              return (
                <tr key={p._id} className="transition-colors hover:bg-carbon-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                        <ProductImage src={p.images[0]} alt={p.name} productName={p.name} brand={p.brand} fill />
                      </div>
                      <span className="line-clamp-1 font-medium text-carbon-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-carbon-500">{p.sku}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn("font-bold", st === "out_of_stock" ? "text-red-600" : st === "low_stock" ? "text-amber-600" : "text-emerald-600")}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-carbon-500">{p.reorderLevel}</td>
                  <td className="px-4 py-3 text-right text-carbon-500">{formatGH(p.costPrice)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-carbon-900">{formatGH(p.stock * p.costPrice)}</td>
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
      </div>
    </div>
  );
}