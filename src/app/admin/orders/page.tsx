import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { listOrders } from "@/lib/services/orders";
import { formatGH, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/card";
import { ORDER_STATUS_META } from "@/config/constants";

export const metadata: Metadata = { title: "Orders — Auto360 Admin" };
export const dynamic = "force-dynamic";

const ORDER_STATUSES = Object.keys(ORDER_STATUS_META);

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const { status = "", q = "" } = await searchParams;
  const { items, total } = await listOrders({ status: (status || undefined) as never, search: q, perPage: 50 });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-carbon-900">Orders</h1>
          <p className="text-sm text-carbon-500">{total} orders</p>
        </div>
        <form method="get" className="flex items-center gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search order, name, phone…"
            className="h-10 w-52 rounded-xl border border-carbon-200 bg-white px-3 text-sm outline-none focus:border-race-400"
          />
          <select name="status" defaultValue={status} className="h-10 rounded-xl border border-carbon-200 bg-white px-3 text-sm outline-none focus:border-race-400">
            <option value="">All statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{ORDER_STATUS_META[s as keyof typeof ORDER_STATUS_META].label}</option>
            ))}
          </select>
          <button type="submit" className="h-10 rounded-xl bg-carbon-900 px-4 text-sm font-semibold text-white hover:bg-carbon-800">Filter</button>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-carbon-200 bg-white shadow-card">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <ShoppingCart className="h-10 w-10 text-carbon-300" />
            <p className="text-sm text-carbon-500">No orders found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-carbon-100 bg-carbon-50/60 text-left text-xs uppercase tracking-wider text-carbon-500">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3 text-right">Items</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-carbon-100">
              {items.map((o) => {
                const meta = ORDER_STATUS_META[o.status];
                const qty = o.items.reduce((s, i) => s + i.quantity, 0);
                return (
                  <tr key={o._id} className="transition-colors hover:bg-carbon-50/50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${o._id}`} className="font-mono font-semibold text-carbon-900 hover:text-race-600">
                        {o.orderNumber}
                      </Link>
                      <p className="text-xs text-carbon-400">{formatDateTime(o.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-carbon-900">{o.customerName}</p>
                      <p className="text-xs text-carbon-400">{o.phone}</p>
                    </td>
                    <td className="px-4 py-3 capitalize text-carbon-600">{o.orderMethod}</td>
                    <td className="px-4 py-3 text-carbon-600">{o.paymentMethod}</td>
                    <td className="px-4 py-3 text-right text-carbon-600">{qty}</td>
                    <td className="px-4 py-3 text-right font-bold text-carbon-900">{formatGH(o.total)}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge tone={(meta.color as never) ?? "slate"}>{meta.label}</Badge>
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