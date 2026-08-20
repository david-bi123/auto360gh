import type { Metadata } from "next";
import { Suspense } from "react";
import { PackageSearch } from "lucide-react";
import { queryProducts, type ProductFilters } from "@/lib/services/products";
import { getCategories, getBrands } from "@/lib/services/catalog";
import { ShopControls } from "@/components/products/shop-controls";
import { ProductGrid, ProductGridSkeleton } from "@/components/products/product-grid";
import { ShopPagination } from "@/components/products/shop-pagination";
import { EmptyState } from "@/components/ui/card";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Shop Automotive Products — Engine Oils, Additives & Spare Parts",
  description:
    "Browse the Auto360 Gh catalogue: genuine LIQUI MOLY engine oils, additives, coolants, brake fluids, car care and spare parts in Accra, Ghana.",
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const [categories, brands, products] = await Promise.all([
    getCategories(),
    getBrands(),
    queryProducts({
      search: params.q,
      category: params.category,
      brand: params.brand,
      minPrice: params.min ? Number(params.min) : undefined,
      maxPrice: params.max ? Number(params.max) : undefined,
      sort: (params.sort ?? "featured") as ProductFilters["sort"],
      inStock: params.inStock === "1",
      page,
      perPage: 12,
    }),
  ]);

  return (
    <div className="bg-carbon-50">
      <div className="bg-carbon-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-race-400">Online Store</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
            Shop Auto360 Gh
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/60">
            Genuine automotive products, premium lubricants and spare parts — available for delivery or pickup in Accra.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ShopControls categories={categories} brands={brands} />

        <div className="mt-8">
          {products.items.length === 0 ? (
            <EmptyState
              icon={<PackageSearch className="h-6 w-6" />}
              title="No products found"
              description="Try adjusting your search or clearing filters to see more products."
            />
          ) : (
            <>
              <p className="mb-5 text-sm text-carbon-500">
                Showing <span className="font-semibold text-carbon-800">{products.items.length}</span> of{" "}
                <span className="font-semibold text-carbon-800">{products.total}</span> products
              </p>
              <Suspense fallback={<ProductGridSkeleton count={12} />}>
                <ProductGrid products={products.items} priorityFirst={4} />
              </Suspense>
              {products.pages > 1 && (
                <div className="mt-10">
                  <ShopPagination page={products.page} pages={products.pages} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}