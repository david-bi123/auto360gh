"use client";

import { ShoppingCart, MessageCircle } from "lucide-react";
import type { Product } from "@/types";
import { formatGH } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { ProductImage } from "@/components/ui/product-image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/components/ui/toast";
import { StockBadge } from "./product-card";

export function QuickViewModal({ open, onClose, product }: { open: boolean; onClose: () => void; product: Product }) {
  const { toast } = useToast();
  const addItem = useCartStore((s) => s.addItem);

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className="grid gap-6 p-6 sm:grid-cols-2">
        <div className="aspect-[4/3] overflow-hidden rounded-xl">
          <ProductImage src={product.images[0]} alt={product.name} productName={product.name} brand={product.brand} fill />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-carbon-400">{product.brand}</span>
          <h3 className="mt-1 text-lg font-bold leading-tight text-carbon-900">{product.name}</h3>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-2xl font-bold text-carbon-900">{formatGH(product.price)}</span>
            {product.onSale && product.compareAtPrice && (
              <span className="text-sm text-carbon-400 line-through">{formatGH(product.compareAtPrice)}</span>
            )}
          </div>
          <div className="mt-2"><StockBadge product={product} /></div>
          <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-carbon-600">{product.description}</p>
          <div className="mt-auto flex flex-col gap-2 pt-4">
            <Button
              disabled={product.stock <= 0}
              onClick={() => {
                addItem(product);
                toast("Added to cart", { description: `${product.name} added to your cart.` });
                onClose();
              }}
              leftIcon={<ShoppingCart className="h-4 w-4" />}
            >
              Add to Cart
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = `/shop/${product.slug}`;
                }}
              >
                View Details
              </Button>
              <Button variant="whatsapp" onClick={() => { window.location.href = `/shop/${product.slug}?ask=1`; }}>
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}