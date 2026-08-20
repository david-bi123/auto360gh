"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Truck, Store, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCartStore, useCartSubtotal } from "@/store/cart";
import { formatGH } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea, Select } from "@/components/ui/field";
import { ProductImage } from "@/components/ui/product-image";
import { useToast } from "@/components/ui/toast";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/config/constants";

export function CheckoutView() {
  const { toast } = useToast();
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const subtotal = useCartSubtotal();

  const [method, setMethod] = useState<"delivery" | "pickup">("pickup");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    whatsapp: "",
    email: "",
    deliveryAddress: "",
    city: "",
    notes: "",
    paymentMethod: "Cash",
  });

  const deliveryFee = method === "delivery" ? (subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE) : 0;
  const total = subtotal + deliveryFee;

  if (items.length === 0 && !submitting) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-carbon-300 bg-white p-10 text-center">
        <p className="text-lg font-semibold text-carbon-800">Your cart is empty</p>
        <p className="mt-1 text-sm text-carbon-500">Add products before checking out.</p>
        <Link href="/shop" className="mt-5 inline-flex h-11 items-center rounded-xl bg-race-500 px-6 text-sm font-semibold text-white hover:bg-race-600">
          Go to Shop
        </Link>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName.trim() || !form.phone.trim()) {
      toast("Please enter your name and phone number", { type: "error" });
      return;
    }
    if (method === "delivery" && !form.deliveryAddress.trim()) {
      toast("Please enter a delivery address", { type: "error" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          orderMethod: method,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast("Order failed", { type: "error", description: data.error ?? "Please try again." });
        setSubmitting(false);
        return;
      }
      clearCart();
      router.push(`/order-success/${data.orderId}`);
    } catch {
      setSubmitting(false);
      toast("Something went wrong", { type: "error", description: "Please check your connection and try again." });
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="rounded-2xl border border-carbon-200 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-extrabold uppercase tracking-tight text-carbon-900">Order method</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMethod("pickup")}
              className={
                method === "pickup"
                  ? "rounded-xl border-2 border-race-500 bg-race-50/50 p-4 text-left"
                  : "rounded-xl border border-carbon-200 p-4 text-left transition-colors hover:border-carbon-300"
              }
            >
              <Store className={method === "pickup" ? "h-5 w-5 text-race-500" : "h-5 w-5 text-carbon-400"} />
              <p className="mt-2 font-semibold text-carbon-900">Pickup from Auto360 Gh</p>
              <p className="text-sm text-carbon-500">103 Hallelujah Broadway, Accra</p>
            </button>
            <button
              type="button"
              onClick={() => setMethod("delivery")}
              className={
                method === "delivery"
                  ? "rounded-xl border-2 border-race-500 bg-race-50/50 p-4 text-left"
                  : "rounded-xl border border-carbon-200 p-4 text-left transition-colors hover:border-carbon-300"
              }
            >
              <Truck className={method === "delivery" ? "h-5 w-5 text-race-500" : "h-5 w-5 text-carbon-400"} />
              <p className="mt-2 font-semibold text-carbon-900">Delivery</p>
              <p className="text-sm text-carbon-500">
                {subtotal >= FREE_DELIVERY_THRESHOLD ? "Free" : formatGH(DELIVERY_FEE)} · Within Accra
              </p>
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-carbon-200 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-extrabold uppercase tracking-tight text-carbon-900">Contact details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" required>
              <Input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="e.g. Kwame Mensah" />
            </Field>
            <Field label="Phone number" required>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="e.g. 024 000 0000" />
            </Field>
            <Field label="WhatsApp number">
              <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="Same as phone if not provided" />
            </Field>
            <Field label="Email">
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            </Field>
          </div>

          {method === "delivery" && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Delivery address" required className="sm:col-span-2">
                <Input value={form.deliveryAddress} onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })} placeholder="House number, street, landmark" />
              </Field>
              <Field label="City">
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="e.g. Accra, Tema" />
              </Field>
            </div>
          )}

          <div className="mt-4">
            <Field label="Additional notes">
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Anything we should know about your order?" />
            </Field>
          </div>
        </div>

        <div className="rounded-2xl border border-carbon-200 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-extrabold uppercase tracking-tight text-carbon-900">Payment</h2>
          <p className="mt-1 text-sm text-carbon-500">Pay on delivery or when you collect — mobile money, cash or bank transfer.</p>
          <div className="mt-4">
            <Field label="Preferred payment method">
              <Select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
                <option value="Cash">Cash</option>
                <option value="Mobile Money">Mobile Money</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Card">Card</option>
              </Select>
            </Field>
          </div>
        </div>
      </div>

      <div className="h-fit space-y-4">
        <div className="rounded-2xl border border-carbon-200 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-extrabold uppercase tracking-tight text-carbon-900">Order Summary</h2>
          <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  <ProductImage src={item.image} alt={item.productName} productName={item.productName} brand={item.brand} fill />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-carbon-900">{item.productName}</p>
                  <p className="text-xs text-carbon-400">Qty {item.quantity}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-carbon-900">{formatGH(item.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2.5 border-t border-carbon-100 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-carbon-500">Subtotal</dt>
              <dd className="font-semibold text-carbon-900">{formatGH(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-carbon-500">Delivery</dt>
              <dd className="font-semibold text-carbon-900">{deliveryFee === 0 ? "Free" : formatGH(deliveryFee)}</dd>
            </div>
            <div className="flex justify-between border-t border-carbon-100 pt-3 text-base">
              <dt className="font-semibold text-carbon-900">Total</dt>
              <dd className="font-extrabold text-carbon-900">{formatGH(total)}</dd>
            </div>
          </dl>
          <Button type="submit" size="lg" className="mt-6 w-full" loading={submitting} leftIcon={submitting ? undefined : <Truck className="h-4 w-4" />}>
            {submitting ? "Placing order…" : "Place Order"}
          </Button>
          <p className="mt-3 text-center text-xs text-carbon-400">
            By placing this order you agree to be contacted about its status.
          </p>
        </div>

        <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm font-semibold text-carbon-600 transition-colors hover:text-race-600">
          <ChevronLeft className="h-4 w-4" /> Back to cart
        </Link>
      </div>
    </form>
  );
}