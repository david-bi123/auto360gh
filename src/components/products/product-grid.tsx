import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "./product-card";
import { Skeleton } from "@/components/ui/card";

export function ProductGrid({ products, priorityFirst = 0 }: { products: Product[]; priorityFirst?: number }) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-carbon-300 bg-carbon-50/60 px-6 py-16 text-center text-sm text-carbon-500">
        No products available yet. Check back soon.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p, i) => (
        <ProductCard key={p._id} product={p} priority={priorityFirst > 0 && i < priorityFirst} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-carbon-200 bg-white shadow-card">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "View all",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div className="max-w-xl">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-race-500">{eyebrow}</span>
        <h2 className="mt-2 font-display text-2xl font-extrabold uppercase tracking-tight text-carbon-900 sm:text-3xl">
          {title}
        </h2>
        {description && <p className="mt-2 text-carbon-500">{description}</p>}
      </div>
      {href && (
        <Link href={href} className="group inline-flex items-center gap-1.5 text-sm font-semibold text-race-600 hover:text-race-700">
          {linkLabel} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}