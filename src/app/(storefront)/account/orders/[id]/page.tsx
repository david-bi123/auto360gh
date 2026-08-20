import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, MessageCircle } from "lucide-react";
import { getOrder } from "@/lib/services/orders";
import { getSession } from "@/lib/auth/session";
import { getSettings, whatsappLink } from "@/lib/services/settings";
import { formatGH, formatDateTime } from "@/lib/utils";
import { Card, CardContent, Badge } from "@/components/ui/card";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { ORDER_STATUS_META } from "@/config/constants";
import { ProductImage } from "@/components/ui/product-image";

export const metadata: Metadata = { title: "Order Details — Auto360 Gh" };

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [order, session, settings] = await Promise.all([getOrder(id), getSession(), getSettings()]);
  if (!order) notFound();

  if (session && order.email !== session.email && order.phone !== session.phone) {
    return (
      <div className="rounded-2xl border border-carbon-200 bg-white p-10 text-center text-sm text-carbon-500">
        This order does not belong to your account.
      </div>
    );
  }

  const meta = ORDER_STATUS_META[order.status];
  const wa = whatsappLink(settings, `Hello Auto360 Gh, I have a question about order ${order.orderNumber}.`);

  return (
    <div className="space-y-6">
      <Link href="/account/orders" className="inline-flex items-center gap-1.5 text-sm font-semibold text-carbon-600 hover:text-race-600">
        <ChevronLeft className="h-4 w-4" /> All orders
      </Link>

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-xl font-extrabold text-carbon-900">{order.orderNumber}</h2>
              <Badge tone={(meta.color as never) ?? "slate"}>{meta.label}</Badge>
            </div>
            <p className="mt-1 text-sm text-carbon-500">Placed {formatDateTime(order.createdAt)}</p>
          </div>
          <p className="text-2xl font-extrabold text-carbon-900">{formatGH(order.total)}</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-carbon-500">Items</h3>
              <ul className="mt-3 space-y-3">
                {order.items.map((item) => (
                  <li key={item.sku} className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                      <ProductImage src={item.image} alt={item.productName} productName={item.productName} brand="" fill />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-carbon-900">{item.productName}</p>
                      <p className="text-xs text-carbon-400">Qty {item.quantity} × {formatGH(item.unitPrice)}</p>
                    </div>
                    <span className="text-sm font-semibold text-carbon-900">{formatGH(item.lineTotal)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-5 space-y-2 border-t border-carbon-100 pt-4 text-sm">
                <div className="flex justify-between"><dt className="text-carbon-500">Subtotal</dt><dd className="font-semibold">{formatGH(order.subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-carbon-500">Delivery</dt><dd className="font-semibold">{formatGH(order.deliveryFee)}</dd></div>
                <div className="flex justify-between"><dt className="text-carbon-500">Method</dt><dd className="font-semibold">{order.orderMethod === "delivery" ? "Delivery" : "Pickup"}</dd></div>
                <div className="flex justify-between"><dt className="text-carbon-500">Payment</dt><dd className="font-semibold">{order.paymentMethod}</dd></div>
                <div className="flex justify-between text-base"><dt className="font-semibold text-carbon-900">Total</dt><dd className="font-extrabold text-carbon-900">{formatGH(order.total)}</dd></div>
              </dl>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-carbon-500">Order Status</h3>
              <div className="mt-4">
                <OrderTimeline order={order} />
              </div>
            </CardContent>
          </Card>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#25D366] text-sm font-semibold text-white transition-colors hover:bg-[#1fb959]"
          >
            <MessageCircle className="h-5 w-5" /> Ask about this order
          </a>
        </div>
      </div>
    </div>
  );
}