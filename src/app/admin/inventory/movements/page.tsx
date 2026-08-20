import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { getDb } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/card";
import { INVENTORY_MOVEMENT_TYPES } from "@/config/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Inventory Movements — Auto360 Admin" };
export const dynamic = "force-dynamic";

const typeLabel = Object.fromEntries(INVENTORY_MOVEMENT_TYPES.map((t) => [t.value, t.label]));

export default async function InventoryMovementsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type = "" } = await searchParams;
  const db = await getDb();
  const query: Record<string, unknown> = {};
  if (type) query.type = type;
  const movements = await db.inventoryMovements.find(query as never, { sort: { createdAt: -1 }, limit: 200 });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/inventory" className="inline-flex items-center gap-1.5 text-sm font-semibold text-carbon-600 hover:text-race-600">
            <ChevronLeft className="h-4 w-4" /> Inventory
          </Link>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-carbon-900">Movement history</h1>
          <p className="text-sm text-carbon-500">{movements.length} recorded movements</p>
        </div>
        <form method="get" className="flex items-center gap-2">
          <select name="type" defaultValue={type} className="h-10 rounded-xl border border-carbon-200 bg-white px-3 text-sm outline-none focus:border-race-400">
            <option value="">All types</option>
            {INVENTORY_MOVEMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <button type="submit" className="h-10 rounded-xl bg-carbon-900 px-4 text-sm font-semibold text-white hover:bg-carbon-800">Filter</button>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-carbon-200 bg-white shadow-card">
        {movements.length === 0 ? (
          <p className="py-16 text-center text-sm text-carbon-400">No inventory movements yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-carbon-100 bg-carbon-50/60 text-left text-xs uppercase tracking-wider text-carbon-500">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3 text-center">Before</th>
                <th className="px-4 py-3 text-center">Change</th>
                <th className="px-4 py-3 text-center">After</th>
                <th className="px-4 py-3">Reason / reference</th>
                <th className="px-4 py-3">By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-carbon-100">
              {movements.map((m) => (
                <tr key={m._id} className="transition-colors hover:bg-carbon-50/50">
                  <td className="px-4 py-3 whitespace-nowrap text-carbon-500">{formatDateTime(m.createdAt)}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-carbon-900">{m.productName}</p>
                    <p className="font-mono text-xs text-carbon-400">{m.sku}</p>
                  </td>
                  <td className="px-4 py-3"><Badge tone="slate">{typeLabel[m.type] ?? m.type}</Badge></td>
                  <td className="px-4 py-3 text-center text-carbon-500">{m.before}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("inline-flex items-center gap-0.5 font-bold", m.quantity >= 0 ? "text-emerald-600" : "text-red-600")}>
                      {m.quantity >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                      {m.quantity >= 0 ? "+" : ""}{m.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-carbon-900">{m.after}</td>
                  <td className="px-4 py-3 text-carbon-500">{m.reason || m.reference || "—"}</td>
                  <td className="px-4 py-3 text-carbon-500">{m.performedBy || "System"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}