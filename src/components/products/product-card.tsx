"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Heart, ShoppingCart, Check } from "lucide-react";
import type { Product } from "@/types";
import { formatGH, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { ProductImage } from "@/components/ui/product-image";
import { Badge } from "@/components/ui/card";
import { QuickViewModal } from "./quick-view";
import { useToast } from "@/components/ui/toast";

export function StockBadge({ product }: { product: Product }) {
  if (product.stock <= 0) return <Badge tone="slate">Out of Stock</Badge>;
  if (product.stock <= product.reorderLevel) return <Badge tone="amber">{product.stock} left</Badge>;
  return <Badge tone="mint">In Stock</Badge>;
}

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { toast } = useToast();
  const addItem = useCartStore((s) => s.addItem);
  const [quickView, setQuickView] = useState(false);
  const [added, setAdded] = useState(false);

  const onSale = product.onSale && product.compareAtPrice && product.compareAtPrice > product.price;
  const price = formatGH(product.price);
  const compareAt = onSale ? formatGH(product.compareAtPrice!) : null;

  const handleAdd = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (product.stock <= 0) {
      toast("Out of stock", { type: "error", description: `${product.name} is currently unavailable.` });
      return;
    }
    addItem(product);
    setAdded(true);
    toast("Added to cart", { description: `${product.name} added to your cart.` });
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-carbon-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
      >
        <Link href={`/shop/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-carbon-100">
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]">
            <ProductImage
              src={product.images[0]}
              alt={product.name}
              productName={product.name}
              brand={product.brand}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>

          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {product.featured && <Badge tone="dark">Featured</Badge>}
            {onSale && <Badge tone="race">Sale</Badge>}
          </div>

          <div className="absolute inset-x-0 bottom-0 flex translate-y-full gap-2 bg-gradient-to-t from-carbon-950/85 to-transparent p-3 pt-8 transition-transform duration-300 group-hover:translate-y-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                setQuickView(true);
              }}
              className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/95 text-xs font-semibold text-carbon-900 backdrop-blur transition-colors hover:bg-white"
            >
              <Eye className="h-4 w-4" /> Quick View
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                toast("Saved to wishlist", { description: `${product.name} added to your wishlist.` });
              }}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/95 text-carbon-700 backdrop-blur transition-colors hover:text-race-500"
              aria-label="Add to wishlist"
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </Link>

        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-carbon-400">{product.brand}</span>
            <StockBadge product={product} />
          </div>
          <Link href={`/shop/${product.slug}`} className="line-clamp-2 text-sm font-semibold leading-snug text-carbon-900 transition-colors hover:text-race-600">
            {product.name}
          </Link>
          <p className="text-xs text-carbon-400 line-clamp-1">{product.category}</p>
          <div className="mt-auto flex items-end justify-between gap-2 pt-2">
            <div className="flex flex-col">
              {compareAt && <span className="text-xs text-carbon-400 line-through">{compareAt}</span>}
              <span className="text-lg font-bold tracking-tight text-carbon-900">{price}</span>
            </div>
            <button
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl shadow-sm transition-all duration-200 active:scale-95",
                added
                  ? "bg-mint-500 text-white"
                  : product.stock <= 0
                    ? "bg-carbon-100 text-carbon-400"
                    : "bg-carbon-900 text-white hover:bg-race-500"
              )}
              aria-label="Add to cart"
            >
              {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </motion.div>

      <QuickViewModal open={quickView} onClose={() => setQuickView(false)} product={product} />
    </>
  );
}