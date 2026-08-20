import Link from "next/link";
import { TrendingUp, ShoppingCart, Package, Users, AlertTriangle, ReceiptText, Store, ArrowUpRight } from "lucide-react";
import {
  getDashboardStats, getSalesOverTime, getTopProducts, getCategoryDistribution,
  getRecentActivity, getPaymentMethodMix,
} from "@/lib/services/analytics";
import { getSettings } from "@/lib/services/settings";
import { formatGH } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui/card";
import { RevenueAreaChart, OrdersBarChart, DonutChart, TopProductsList, PaymentMixBar } from "@/components/admin/dashboard-charts";
import { cn } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [stats, sales, topProducts, categories, activity, paymentMix, settings] = await Promise.all([
    getDashboardStats(),
    getSalesOverTime(30),
    getTopProducts(5),
    getCategoryDistribution(),
    getRecentActivity(8),
    getPaymentMethodMix(),
    getSettings(),
  ]);

  const statsCards = [
    { label: "Total revenue", value: formatGH(stats.revenue), icon: TrendingUp, tone: "bg-race-50 text-race-600" },
    { label: "Online orders", value: String(stats.orders), icon: ShoppingCart, tone: "bg-sky-50 text-sky-600" },
    { label: "Products", value: String(stats.products), icon: Package, tone: "bg-violet-50 text-violet-600" },
    { label: "Customers", value: String(stats.customers), icon: Users, tone: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-carbon-900">Dashboard</h1>
          <p className="text-sm text-carbon-500">
            {settings.name} · {settings.city}
          </p>
        </div>
        <Link
          href="/admin/pos"
          className="inline-flex items-center gap-2 rounded-xl bg-race-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-race-600"
        >
          <ReceiptText className="h-4 w-4" /> New POS sale
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statsCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", s.tone)}>
                  <s.icon className="h-5 w-5" />
                </span>
                <ArrowUpRight className="h-4 w-4 text-carbon-300" />
              </div>
              <p className="mt-4 text-2xl font-extrabold tracking-tight text-carbon-900">{s.value}</p>
              <p className="text-sm text-carbon-500">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Revenue · last 30 days</CardTitle>
            <div className="flex items-center gap-4 text-xs text-carbon-500">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-race-500" /> Store</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-carbon-900" /> POS</span>
              <span className="font-semibold text-carbon-900">{formatGH(stats.onlineRevenue)} + {formatGH(stats.posRevenue)}</span>
            </div>
          </CardHeader>
          <CardContent>
            <RevenueAreaChart points={sales} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by category</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart slices={categories.length ? categories : [{ name: "No sales yet", value: 1 }]} />
          </CardContent>
        </Card>
      </div>

      {stats.lowStock > 0 && (
        <Link href="/admin/inventory" className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 transition-colors hover:bg-amber-100">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-900">
            <span className="font-bold">{stats.lowStock}</span> {stats.lowStock === 1 ? "product is" : "products are"} low on stock or out of stock.
            <span className="ml-1 font-semibold underline">Review inventory</span>
          </p>
        </Link>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Orders · last 30 days</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersBarChart points={sales} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payment methods</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentMixBar mix={paymentMix.length ? paymentMix : [{ name: "No sales", value: 1 }]} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top sellers</CardTitle>
          </CardHeader>
          <CardContent>
            <TopProductsList products={topProducts} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {activity.map((ev) => (
                <li key={ev.id} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      ev.type === "order" && "bg-sky-50 text-sky-600",
                      ev.type === "sale" && "bg-race-50 text-race-600",
                      ev.type === "notification" && "bg-amber-50 text-amber-600"
                    )}
                  >
                    {ev.type === "order" ? <ShoppingCart className="h-4 w-4" /> : ev.type === "sale" ? <ReceiptText className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-carbon-900">{ev.title}</p>
                    <p className="truncate text-xs text-carbon-400">{ev.subtitle}</p>
                  </div>
                  {ev.amount !== undefined && <span className="text-sm font-bold text-carbon-900">{formatGH(ev.amount)}</span>}
                  <Badge tone="slate">{ev.type}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-carbon-100 text-carbon-700"><Store className="h-5 w-5" /></span>
            <div>
              <p className="text-lg font-extrabold text-carbon-900">{formatGH(stats.avgOrderValue)}</p>
              <p className="text-sm text-carbon-500">Average online order</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-carbon-100 text-carbon-700"><TrendingUp className="h-5 w-5" /></span>
            <div>
              <p className="text-lg font-extrabold text-carbon-900">{stats.onlineRevenue > 0 && stats.posRevenue > 0 ? `${Math.round((stats.posRevenue / (stats.onlineRevenue + stats.posRevenue)) * 100)}%` : "—"}</p>
              <p className="text-sm text-carbon-500">Share from in-store POS</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-carbon-100 text-carbon-700"><Package className="h-5 w-5" /></span>
            <div>
              <p className="text-lg font-extrabold text-carbon-900">{stats.products}</p>
              <p className="text-sm text-carbon-500">Products in catalogue</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}