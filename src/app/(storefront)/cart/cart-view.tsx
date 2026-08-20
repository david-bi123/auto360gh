"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Trash2, Bookmark, BookmarkCheck, ChevronLeft } from "lucide-react";
import { useCartStore, useCartSubtotal } from "@/store/cart";
import { formatGH } from "@/lib/utils";
import { QuantitySelector } from "@/components/ui/quantity";
import { ProductImage } from "@/components/ui/product-image";
import { EmptyState } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/config/constants";

export function CartView() {
  const { items, saved, updateQuantity, removeItem, saveForLater, moveToCart } = useCartStore();
  const subtotal = useCartSubtotal();

  const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  if (items.length === 0 && saved.length === 0) {
    return (
      <div className="mx-auto max-w-xl">
        <EmptyState
          icon={<ShoppingBag className="h-6 w-6" />}
          title="Your cart is empty"
          description="Browse our catalogue of genuine automotive products and add something to your cart."
          action={
            <Link href="/shop" className="inline-flex h-11 items-center gap-2 rounded-xl bg-race-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-race-600">
              Start Shopping <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {items.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-carbon-200 bg-white shadow-card">
            <div className="border-b border-carbon-100 bg-carbon-50/60 px-5 py-3 text-sm font-semibold text-carbon-700">
              Cart ({items.length} {items.length === 1 ? "item" : "items"})
            </div>
            <ul className="divide-y divide-carbon-100">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4 p-4 sm:p-5">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                    <ProductImage src={item.image} alt={item.productName} productName={item.productName} brand={item.brand} fill />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        {item.brand && <p className="text-[11px] font-semibold uppercase tracking-wider text-carbon-400">{item.brand}</p>}
                        <Link href={`/shop/${item.slug}`} className="line-clamp-2 text-sm font-semibold text-carbon-900 hover:text-race-600">
                          {item.productName}
                        </Link>
                      </div>
                      <p className="shrink-0 font-bold text-carbon-900">{formatGH(item.lineTotal)}</p>
                    </div>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                      <QuantitySelector size="sm" value={item.quantity} onChange={(q) => updateQuantity(item.productId, q)} max={99} />
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => saveForLater(item.productId)}
                          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-carbon-500 transition-colors hover:bg-carbon-100 hover:text-carbon-800"
                        >
                          <Bookmark className="h-3.5 w-3.5" /> Save for later
                        </button>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {saved.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-carbon-200 bg-white shadow-card">
            <div className="border-b border-carbon-100 bg-carbon-50/60 px-5 py-3 text-sm font-semibold text-carbon-700">
              Saved for later ({saved.length})
            </div>
            <ul className="divide-y divide-carbon-100">
              {saved.map((item) => (
                <li key={item.productId} className="flex items-center gap-4 p-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                    <ProductImage src={item.image} alt={item.productName} productName={item.productName} brand={item.brand} fill />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-carbon-900">{item.productName}</p>
                    <p className="text-sm text-carbon-500">{formatGH(item.unitPrice)}</p>
                  </div>
                  <button
                    onClick={() => moveToCart(item.productId)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-race-600 transition-colors hover:bg-race-50"
                  >
                    <BookmarkCheck className="h-3.5 w-3.5" /> Move to cart
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm font-semibold text-carbon-600 transition-colors hover:text-race-600">
          <ChevronLeft className="h-4 w-4" /> Continue Shopping
        </Link>
      </div>

      <div className="h-fit space-y-4">
        <div className="rounded-2xl border border-carbon-200 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-extrabold uppercase tracking-tight text-carbon-900">Order Summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-carbon-500">Subtotal</dt>
              <dd className="font-semibold text-carbon-900">{formatGH(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-carbon-500">Delivery</dt>
              <dd className="font-semibold text-carbon-900">
                {deliveryFee === 0 ? <span className="text-mint-500">Free</span> : formatGH(deliveryFee)}
              </dd>
            </div>
            {subtotal > 0 && subtotal < FREE_DELIVERY_THRESHOLD && (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                Add {formatGH(FREE_DELIVERY_THRESHOLD - subtotal)} more for free delivery in Accra.
              </p>
            )}
            <div className="flex justify-between border-t border-carbon-100 pt-3 text-base">
              <dt className="font-semibold text-carbon-900">Total</dt>
              <dd className="font-extrabold text-carbon-900">{formatGH(total)}</dd>
            </div>
          </dl>
          <Link href="/checkout" className="mt-6 block">
            <Button size="lg" className="w-full" disabled={items.length === 0} rightIcon={<ArrowRight className="h-4 w-4" />}>
              Proceed to Checkout
            </Button>
          </Link>
          <p className="mt-3 text-center text-xs text-carbon-400">
            Pay on delivery or pickup. Free delivery on orders above {formatGH(FREE_DELIVERY_THRESHOLD)}.
          </p>
        </div>
      </div>
    </div>
  );
}