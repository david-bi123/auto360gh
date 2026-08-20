import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";
import { EmptyState } from "@/components/ui/card";

export const metadata: Metadata = { title: "Wishlist — Auto360 Gh" };

export default function WishlistPage() {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-extrabold uppercase tracking-tight text-carbon-900">My Wishlist</h2>
      <EmptyState
        icon={<Heart className="h-6 w-6" />}
        title="Your wishlist is empty"
        description="Use the heart icon on any product to save it here for later. (Wishlist storage is ready in the platform architecture.)"
        action={
          <Link href="/shop" className="inline-flex h-11 items-center rounded-xl bg-race-500 px-6 text-sm font-semibold text-white hover:bg-race-600">
            Browse Products
          </Link>
        }
      />
    </div>
  );
}