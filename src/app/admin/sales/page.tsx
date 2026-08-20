import type { Metadata } from "next";
import Link from "next/link";
import { ReceiptText } from "lucide-react";
import { listSales } from "@/lib/services/sales";
import { getSalesStats } from "@/lib/services/sales";
import { formatGH, formatDateTime } from "@/lib/utils";
import { Card, CardContent, Badge } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Sales — Auto360 Admin" };
export const dynamic = "force-dynamic";

export default async function AdminSalesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const [{ items, total }, stats] = await Promise.all([listSales({ search: q, perPage: 50 }), getSalesStats()]);

  const cards = [
    { label: "POS receipts", value: String(stats.total), tone: "bg-race-50 text-race-600" },
    { label: "POS revenue", value: formatGH(stats.revenue), tone: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-carbon-900">Sales</h1>
          <p className="text-sm text-carbon-500">In-store point-of-sale transactions</p>
        </div>
        <Link href="/admin/pos" className="inline-flex h-10 items-center gap-2 rounded-xl bg-race-500 px-4 text-sm font-semibold text-white shadow-glow hover:bg-race-600">
          <ReceiptText className="h-4 w-4" /> New sale
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:max-w-md">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-5">
              <p className={cn("text-2xl font-extrabold text-carbon-900")}>{c.value}</p>
              <p className="text-sm text-carbon-500">{c.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-carbon-200 bg-white shadow-card">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <ReceiptText className="h-10 w-10 text-carbon-300" />
            <p className="text-sm text-carbon-500">No POS sales yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-carbon-100 bg-carbon-50/60 text-left text-xs uppercase tracking-wider text-carbon-500">
                <th className="px-4 py-3">Receipt</th>
                <th className="px-4 py-3">Cashier</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3 text-right">Items</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right">Paid</th>
                <th className="px-4 py-3 text-right">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-carbon-100">
              {items.map((s) => {
                const qty = s.items.reduce((sum, i) => sum + i.quantity, 0);
                return (
                  <tr key={s._id} className="transition-colors hover:bg-carbon-50/50">
                    <td className="px-4 py-3">
                      <span className="font-mono font-semibold text-carbon-900">{s.receiptNumber}</span>
                      <p className="text-xs text-carbon-400">{formatDateTime(s.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3 text-carbon-600">{s.cashierName}</td>
                    <td className="px-4 py-3 text-carbon-600">{s.customerName || "Walk-in"}</td>
                    <td className="px-4 py-3"><Badge tone="slate">{s.paymentMethodLabel}</Badge></td>
                    <td className="px-4 py-3 text-right text-carbon-600">{qty}</td>
                    <td className="px-4 py-3 text-right font-bold text-carbon-900">{formatGH(s.total)}</td>
                    <td className="px-4 py-3 text-right text-carbon-600">{formatGH(s.amountPaid)}</td>
                    <td className="px-4 py-3 text-right text-carbon-500">{formatGH(s.change)}</td>
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