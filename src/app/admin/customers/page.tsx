import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
import { listCustomers } from "@/lib/services/customers";
import { formatGH } from "@/lib/utils";
import { Badge } from "@/components/ui/card";

export const metadata: Metadata = { title: "Customers — Auto360 Admin" };
export const dynamic = "force-dynamic";

export default async function AdminCustomersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const { items, total } = await listCustomers({ search: q, perPage: 50 });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-carbon-900">Customers</h1>
          <p className="text-sm text-carbon-500">{total} customers</p>
        </div>
        <form method="get" className="flex items-center gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search name, phone, email…"
            className="h-10 w-64 rounded-xl border border-carbon-200 bg-white px-3 text-sm outline-none focus:border-race-400"
          />
          <button type="submit" className="h-10 rounded-xl bg-carbon-900 px-4 text-sm font-semibold text-white hover:bg-carbon-800">Search</button>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-carbon-200 bg-white shadow-card">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <Users className="h-10 w-10 text-carbon-300" />
            <p className="text-sm text-carbon-500">No customers found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-carbon-100 bg-carbon-50/60 text-left text-xs uppercase tracking-wider text-carbon-500">
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3 text-center">Orders</th>
                <th className="px-4 py-3 text-right">Total spent</th>
                <th className="px-4 py-3 text-center">Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-carbon-100">
              {items.map((c) => {
                const tier = c.totalSpent >= 3000 ? "Gold" : c.totalSpent >= 1000 ? "Silver" : c.totalSpent > 0 ? "Bronze" : "New";
                const tierTone = tier === "Gold" ? "amber" : tier === "Silver" ? "slate" : tier === "Bronze" ? "amber" : "mint";
                return (
                  <tr key={c._id} className="transition-colors hover:bg-carbon-50/50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-carbon-900">{c.name}</p>
                      {c.city && <p className="text-xs text-carbon-400">{c.city}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-carbon-600">{c.phone}</p>
                      {c.email && <p className="text-xs text-carbon-400">{c.email}</p>}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-carbon-900">{c.totalOrders}</td>
                    <td className="px-4 py-3 text-right font-bold text-carbon-900">{formatGH(c.totalSpent)}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge tone={tierTone as never}>{tier}</Badge>
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