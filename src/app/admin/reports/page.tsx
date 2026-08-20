import type { Metadata } from "next";
import { getProfitReport, getSalesOverTime, getTopProducts, getPaymentMethodMix } from "@/lib/services/analytics";
import { formatGH } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueAreaChart, PaymentMixBar, TopProductsList } from "@/components/admin/dashboard-charts";

export const metadata: Metadata = { title: "Reports — Auto360 Admin" };
export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const [profit, sales30, sales90, topProducts, paymentMix] = await Promise.all([
    getProfitReport(),
    getSalesOverTime(30),
    getSalesOverTime(90),
    getTopProducts(10),
    getPaymentMethodMix(),
  ]);

  const profitCards = [
    { label: "Gross revenue", value: formatGH(profit.revenue), tone: "text-carbon-900" },
    { label: "Cost of goods", value: formatGH(profit.costValue), tone: "text-red-500" },
    { label: "Gross profit", value: formatGH(profit.grossProfit), tone: "text-emerald-600" },
    { label: "Margin", value: `${profit.margin}%`, tone: "text-race-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-carbon-900">Reports</h1>
        <p className="text-sm text-carbon-500">Profitability and performance analytics.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {profitCards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-5">
              <p className={`text-2xl font-extrabold ${c.tone}`}>{c.value}</p>
              <p className="text-sm text-carbon-500">{c.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue · last 30 days</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueAreaChart points={sales30} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue · last 90 days</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueAreaChart points={sales90} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment method mix</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentMixBar mix={paymentMix.length ? paymentMix : [{ name: "No sales", value: 1 }]} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top 10 products by units sold</CardTitle>
          </CardHeader>
          <CardContent>
            <TopProductsList products={topProducts} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}