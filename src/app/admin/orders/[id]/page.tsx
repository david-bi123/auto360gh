import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MessageCircle, MapPin, Truck } from "lucide-react";
import { getOrder } from "@/lib/services/orders";
import { getSettings, whatsappLink } from "@/lib/services/settings";
import { formatGH, formatDateTime } from "@/lib/utils";
import { Card, CardContent, Badge } from "@/components/ui/card";
import { ProductImage } from "@/components/ui/product-image";
import { OrderStatusControl } from "@/components/admin/order-status-control";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { ORDER_STATUS_META } from "@/config/constants";

export const metadata: Metadata = { title: "Order Details — Auto360 Admin" };
export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [order, settings] = await Promise.all([getOrder(id), getSettings()]);
  if (!order) notFound();

  const meta = ORDER_STATUS_META[order.status];
  const wa = whatsappLink(settings, `Hello Auto360 Gh, I have a question about order ${order.orderNumber}.`);

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm font-semibold text-carbon-600 hover:text-race-600">
        <ChevronLeft className="h-4 w-4" /> All orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-extrabold text-carbon-900">{order.orderNumber}</h1>
          <Badge tone={(meta.color as never) ?? "slate"}>{meta.label}</Badge>
        </div>
        <p className="text-2xl font-extrabold text-carbon-900">{formatGH(order.total)}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-carbon-500">Order items</h3>
              <ul className="space-y-3">
                {order.items.map((item) => (
                  <li key={item.sku} className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                      <ProductImage src={item.image} alt={item.productName} productName={item.productName} brand="" fill />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link href={`/shop/${item.productId}`} className="truncate text-sm font-medium text-carbon-900 hover:text-race-600">
                        {item.productName}
                      </Link>
                      <p className="text-xs text-carbon-400">SKU {item.sku}</p>
                    </div>
                    <span className="text-sm text-carbon-500">× {item.quantity}</span>
                    <span className="text-sm font-semibold text-carbon-900">{formatGH(item.lineTotal)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-5 space-y-2 border-t border-carbon-100 pt-4 text-sm">
                <div className="flex justify-between"><dt className="text-carbon-500">Subtotal</dt><dd className="font-semibold">{formatGH(order.subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-carbon-500">Delivery</dt><dd className="font-semibold">{formatGH(order.deliveryFee)}</dd></div>
                {order.discount > 0 && (
                  <div className="flex justify-between"><dt className="text-carbon-500">Discount</dt><dd className="font-semibold text-emerald-600">-{formatGH(order.discount)}</dd></div>
                )}
                <div className="flex justify-between border-t border-carbon-100 pt-2 text-base"><dt className="font-semibold text-carbon-900">Total</dt><dd className="font-extrabold">{formatGH(order.total)}</dd></div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-carbon-500">Order status</h3>
              <OrderStatusControl order={order} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-carbon-500">Customer</h3>
              <p className="mt-3 font-semibold text-carbon-900">{order.customerName}</p>
              <p className="text-sm text-carbon-500">{order.phone}</p>
              {order.email && <p className="text-sm text-carbon-500">{order.email}</p>}
              <div className="mt-4 space-y-2 border-t border-carbon-100 pt-4 text-sm">
                <p className="flex items-center gap-2 text-carbon-600">
                  <Truck className="h-4 w-4 text-carbon-400" />
                  {order.orderMethod === "delivery" ? `Delivery to ${order.city ?? "Accra"}` : "Pickup from store"}
                </p>
                {order.deliveryAddress && (
                  <p className="flex items-start gap-2 text-carbon-600">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-carbon-400" />
                    {order.deliveryAddress}
                  </p>
                )}
                <p className="text-carbon-600">Payment: <span className="font-medium">{order.paymentMethod}</span> · <span className="font-medium">{order.paymentStatus}</span></p>
                {order.notes && <p className="rounded-xl bg-carbon-50 p-3 text-xs text-carbon-600">"{order.notes}"</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-carbon-500">Timeline</h3>
              <OrderTimeline order={order} />
            </CardContent>
          </Card>

          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-semibold text-white transition-colors hover:bg-[#1fb959]"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp customer
          </a>
        </div>
      </div>
    </div>
  );
}