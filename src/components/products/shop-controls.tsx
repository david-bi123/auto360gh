"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, Search, X } from "lucide-react";
import type { Brand, Category } from "@/types";
import { cn } from "@/lib/utils";

export function ShopControls({
  categories,
  brands,
}: {
  categories: Category[];
  brands: Brand[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const brand = params.get("brand") ?? "";
  const sort = params.get("sort") ?? "featured";
  const min = params.get("min") ?? "";
  const max = params.get("max") ?? "";
  const inStock = params.get("inStock") === "1";

  const update = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, value);
      }
      next.delete("page");
      router.push(`/shop?${next.toString()}`);
    },
    [params, router]
  );

  const hasFilters = q || category || brand || min || max || inStock || sort !== "featured";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-carbon-400" />
          <input
            value={q}
            onChange={(e) => update({ q: e.target.value || null })}
            placeholder="Search products, brands, SKUs…"
            className="h-11 w-full rounded-xl border border-carbon-200 bg-white pl-10 pr-10 text-sm shadow-sm outline-none transition-colors focus:border-race-400 focus:ring-2 focus:ring-race-100"
          />
          {q && (
            <button
              onClick={() => update({ q: null })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-carbon-400 hover:text-carbon-700"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
          <select
            value={brand}
            onChange={(e) => update({ brand: e.target.value || null })}
            className="h-11 rounded-xl border border-carbon-200 bg-white px-3.5 text-sm text-carbon-700 shadow-sm outline-none focus:border-race-400"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b._id} value={b.name}>{b.name}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => update({ sort: e.target.value || null })}
            className="h-11 rounded-xl border border-carbon-200 bg-white px-3.5 text-sm text-carbon-700 shadow-sm outline-none focus:border-race-400"
          >
            <option value="featured">Sort: Featured</option>
            <option value="newest">Sort: Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="bestseller">Best Sellers</option>
            <option value="on_sale">On Sale</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-carbon-200 bg-white p-4 shadow-card lg:flex-row lg:items-center">
        <div className="flex items-center gap-2 text-sm font-semibold text-carbon-700">
          <SlidersHorizontal className="h-4 w-4" /> Categories
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => update({ category: null })}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              category === "" ? "bg-carbon-900 text-white" : "bg-carbon-100 text-carbon-600 hover:bg-carbon-200"
            )}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => update({ category: c.name === category ? null : c.name })}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                category === c.name ? "bg-race-500 text-white" : "bg-carbon-100 text-carbon-600 hover:bg-carbon-200"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-carbon-200 bg-white p-4 shadow-card lg:flex-row">
        <div className="flex items-center gap-2 text-sm font-semibold text-carbon-700">
          <SlidersHorizontal className="h-4 w-4" /> Price (GH₵)
        </div>
        <input
          type="number"
          min={0}
          value={min}
          placeholder="Min"
          onChange={(e) => update({ min: e.target.value || null })}
          className="h-9 w-24 rounded-lg border border-carbon-200 px-3 text-sm outline-none focus:border-race-400"
        />
        <span className="text-carbon-300">–</span>
        <input
          type="number"
          min={0}
          value={max}
          placeholder="Max"
          onChange={(e) => update({ max: e.target.value || null })}
          className="h-9 w-24 rounded-lg border border-carbon-200 px-3 text-sm outline-none focus:border-race-400"
        />
        <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm text-carbon-600">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => update({ inStock: e.target.checked ? "1" : null })}
            className="h-4 w-4 rounded accent-race-500"
          />
          In stock only
        </label>
        {hasFilters && (
          <button
            onClick={() => {
              router.push("/shop");
            }}
            className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-race-600 hover:bg-race-50 lg:ml-0"
          >
            <X className="h-3.5 w-3.5" /> Clear filters
          </button>
        )}
      </div>
    </div>
  );
}