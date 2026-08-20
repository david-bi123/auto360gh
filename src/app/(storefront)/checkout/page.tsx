import type { Metadata } from "next";
import { CheckoutView } from "./checkout-view";

export const metadata: Metadata = {
  title: "Checkout — Auto360 Gh",
  description: "Complete your order with Auto360 Gh. Delivery or pickup from 103 Hallelujah Broadway, Accra.",
};

export default function CheckoutPage() {
  return (
    <div className="bg-carbon-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-carbon-900">Checkout</h1>
        <p className="mt-1 text-carbon-500">Almost there — confirm your details to place the order.</p>
        <div className="mt-8">
          <CheckoutView />
        </div>
      </div>
    </div>
  );
}