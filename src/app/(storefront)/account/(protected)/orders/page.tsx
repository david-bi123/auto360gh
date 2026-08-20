import type { Metadata } from "next";
import Link from "next/link";
import { Package } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { getOrdersForCustomer } from "@/lib/services/orders";
import { formatGH, formatDateTime } from "@/lib/utils";
import { EmptyState, Card, CardContent, Badge } from "@/components/ui/card";
import { ORDER_STATUS_META } from "@/config/constants";

export const metadata: Metadata = { title: "My Orders — Auto360 Gh" };

export default async function OrdersPage() {
  const session = await getSession();
  const orders = await getOrdersForCustomer({ email: session?.email, phone: session?.phone });

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-extrabold uppercase tracking-tight text-carbon-900">My Orders</h2>
      {orders.length === 0 ? (
        <EmptyState
          icon={<Package className="h-6 w-6" />}
          title="No orders yet"
          description="Your placed orders will appear here with live status updates."
          action={
            <Link href="/shop" className="inline-flex h-11 items-center rounded-xl bg-race-500 px-6 text-sm font-semibold text-white hover:bg-race-600">
              Start Shopping
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const meta = ORDER_STATUS_META[order.status];
            return (
              <Link
                key={order._id}
                href={`/account/orders/${order._id}`}
                className="block rounded-2xl border border-carbon-200 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-semibold text-carbon-900">{order.orderNumber}</p>
                    <p className="text-xs text-carbon-400">{formatDateTime(order.createdAt)}</p>
                  </div>
                  <div className="hidden items-center gap-2 text-sm text-carbon-600 sm:flex">
                    {order.items.slice(0, 2).map((it) => (
                      <span key={it.sku} className="rounded-full bg-carbon-100 px-2.5 py-1 text-xs">{it.productName}</span>
                    ))}
                    {order.items.length > 2 && <span className="text-xs text-carbon-400">+{order.items.length - 2} more</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-carbon-900">{formatGH(order.total)}</span>
                    <Badge tone={(meta.color as never) ?? "slate"}>{meta.label}</Badge>
                  </div>
                </CardContent>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}