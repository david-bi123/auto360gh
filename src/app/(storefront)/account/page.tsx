import type { Metadata } from "next";
import Link from "next/link";
import { Package, Phone } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { getOrdersForCustomer } from "@/lib/services/orders";
import { formatGH, formatRelative } from "@/lib/utils";
import { EmptyState, Card, CardContent } from "@/components/ui/card";
import { ORDER_STATUS_META } from "@/config/constants";
import { Badge } from "@/components/ui/card";

export const metadata: Metadata = { title: "My Account — Auto360 Gh" };

export default async function AccountHome() {
  const session = await getSession();
  const orders = await getOrdersForCustomer({ email: session?.email, phone: session?.phone });
  const completed = orders.filter((o) => o.status === "completed");
  const totalSpent = completed.reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent>
            <p className="text-xs uppercase tracking-wider text-carbon-400">Total orders</p>
            <p className="mt-1 text-2xl font-extrabold text-carbon-900">{orders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs uppercase tracking-wider text-carbon-400">Completed</p>
            <p className="mt-1 text-2xl font-extrabold text-carbon-900">{completed.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs uppercase tracking-wider text-carbon-400">Total spent</p>
            <p className="mt-1 text-2xl font-extrabold text-carbon-900">{formatGH(totalSpent)}</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-extrabold uppercase tracking-tight text-carbon-900">Recent orders</h2>
          {orders.length > 0 && (
            <Link href="/account/orders" className="text-sm font-semibold text-race-600 hover:underline">
              View all
            </Link>
          )}
        </div>
        {orders.length === 0 ? (
          <EmptyState
            icon={<Package className="h-6 w-6" />}
            title="No orders yet"
            description="When you place an order it will appear here so you can track its progress."
            action={
              <Link href="/shop" className="inline-flex h-11 items-center rounded-xl bg-race-500 px-6 text-sm font-semibold text-white hover:bg-race-600">
                Start Shopping
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => {
              const meta = ORDER_STATUS_META[order.status];
              return (
                <Link
                  key={order._id}
                  href={`/account/orders/${order._id}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-carbon-200 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  <div>
                    <p className="font-semibold text-carbon-900">{order.orderNumber}</p>
                    <p className="text-xs text-carbon-400">{formatRelative(order.createdAt)} · {order.items.length} item(s)</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden font-bold text-carbon-900 sm:block">{formatGH(order.total)}</span>
                    <Badge tone={(meta.color as never) ?? "slate"}>{meta.label}</Badge>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <Card className="flex items-center justify-between gap-4 bg-carbon-950 text-white">
        <CardContent>
          <p className="text-sm text-white/60">Questions about an order?</p>
          <p className="text-sm font-semibold text-white">Call us on 059 895 4177</p>
        </CardContent>
        <a href="tel:0598954177" className="mr-5 flex h-11 shrink-0 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-carbon-950">
          <Phone className="h-4 w-4" /> Call
        </a>
      </Card>
    </div>
  );
}