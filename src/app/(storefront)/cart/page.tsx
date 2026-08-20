import type { Metadata } from "next";
import { CartView } from "./cart-view";

export const metadata: Metadata = {
  title: "Your Cart — Auto360 Gh",
  description: "Review your cart and checkout with Auto360 Gh. Genuine automotive products delivered in Accra.",
};

export default function CartPage() {
  return (
    <div className="bg-carbon-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-carbon-900">Your Cart</h1>
        <p className="mt-1 text-carbon-500">Review your items before checkout.</p>
        <div className="mt-8">
          <CartView />
        </div>
      </div>
    </div>
  );
}