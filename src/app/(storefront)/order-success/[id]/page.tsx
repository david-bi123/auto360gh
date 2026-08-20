import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Phone, MessageCircle, Package, MapPin } from "lucide-react";
import { getOrder } from "@/lib/services/orders";
import { getSettings, whatsappLink } from "@/lib/services/settings";
import { formatGH, formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Order Confirmation — Auto360 Gh" };

export default async function OrderSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [order, settings] = await Promise.all([getOrder(id), getSettings()]);
  if (!order) notFound();

  const wa = whatsappLink(settings, `Hello Auto360 Gh, I just placed order ${order.orderNumber}. Can you confirm it?`);

  return (
    <div className="bg-carbon-50 py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-carbon-200 bg-white shadow-card">
          <div className="bg-carbon-950 px-8 py-10 text-center text-white">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mint-500/15">
              <CheckCircle2 className="h-9 w-9 text-mint-500" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">
              Thank you, {order.customerName.split(" ")[0]}!
            </h1>
            <p className="mt-2 text-white/60">Your order has been received.</p>
            <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
              <Package className="h-4 w-4 text-race-400" /> Order {order.orderNumber}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl bg-carbon-50 p-4">
                <p className="text-xs uppercase tracking-wider text-carbon-400">Total</p>
                <p className="mt-1 text-lg font-extrabold text-carbon-900">{formatGH(order.total)}</p>
              </div>
              <div className="rounded-xl bg-carbon-50 p-4">
                <p className="text-xs uppercase tracking-wider text-carbon-400">Placed</p>
                <p className="mt-1 text-sm font-semibold text-carbon-900">{formatDateTime(order.createdAt)}</p>
              </div>
              <div className="rounded-xl bg-carbon-50 p-4">
                <p className="text-xs uppercase tracking-wider text-carbon-400">Method</p>
                <p className="mt-1 text-sm font-semibold text-carbon-900">
                  {order.orderMethod === "delivery" ? "Delivery" : "Pickup"}
                </p>
              </div>
              <div className="rounded-xl bg-carbon-50 p-4">
                <p className="text-xs uppercase tracking-wider text-carbon-400">Payment</p>
                <p className="mt-1 text-sm font-semibold text-carbon-900">{order.paymentMethod}</p>
              </div>
            </div>

            <div className="mt-6 border-t border-carbon-100 pt-5">
              <p className="text-sm font-semibold text-carbon-900">Items</p>
              <ul className="mt-3 space-y-2">
                {order.items.map((item) => (
                  <li key={item.sku} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-carbon-700">
                      {item.quantity} × {item.productName}
                    </span>
                    <span className="font-semibold text-carbon-900">{formatGH(item.lineTotal)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-race-50 p-4 text-sm text-carbon-800">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-race-500" />
                {order.orderMethod === "delivery" ? (
                  <span>
                    Delivery to <span className="font-semibold">{order.deliveryAddress}</span>
                    {order.city ? `, ${order.city}` : ""}. We will call {order.phone} to confirm.
                  </span>
                ) : (
                  <span>
                    Pickup at <span className="font-semibold">{settings.address}</span>. We will call {order.phone} when ready.
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-semibold text-white transition-colors hover:bg-[#1fb959]">
                <MessageCircle className="h-5 w-5" /> Confirm on WhatsApp
              </a>
              <div className="grid grid-cols-2 gap-3">
                <a href={`tel:${settings.phone}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-carbon-200 text-sm font-semibold text-carbon-800 transition-colors hover:bg-carbon-50">
                  <Phone className="h-4 w-4" /> Call {settings.phone}
                </a>
                <Link href="/shop" className="inline-flex h-11 items-center justify-center rounded-xl bg-carbon-900 text-sm font-semibold text-white transition-colors hover:bg-race-500">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}