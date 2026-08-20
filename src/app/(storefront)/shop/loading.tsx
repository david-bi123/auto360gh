import { ProductGridSkeleton } from "@/components/products/product-grid";

export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-10 w-64 animate-pulse rounded-lg bg-carbon-200/70" />
      <div className="mt-8">
        <ProductGridSkeleton count={12} />
      </div>
    </div>
  );
}