"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
  saved: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      saved: [],
      addItem: (product, quantity = 1) => {
        const existing = get().items.find((i) => i.productId === product._id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === product._id ? { ...i, quantity: Math.min(99, i.quantity + quantity) } : i
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                productId: product._id,
                productName: product.name,
                sku: product.sku,
                unitPrice: product.price,
                quantity,
                lineTotal: product.price * quantity,
                image: product.images[0] ?? "",
                brand: product.brand,
                slug: product.slug,
                inStock: product.stock > 0,
              },
            ],
          });
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      updateQuantity: (productId, quantity) =>
        set({
          items: get().items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.max(1, Math.min(99, quantity)), lineTotal: i.unitPrice * Math.max(1, Math.min(99, quantity)) }
              : i
          ),
        }),
      saveForLater: (productId) => {
        const item = get().items.find((i) => i.productId === productId);
        if (!item) return;
        set({
          items: get().items.filter((i) => i.productId !== productId),
          saved: [...get().saved, item],
        });
      },
      moveToCart: (productId) => {
        const item = get().saved.find((i) => i.productId === productId);
        if (!item) return;
        set({
          saved: get().saved.filter((i) => i.productId !== productId),
          items: [...get().items, item],
        });
      },
      clearCart: () => set({ items: [], saved: [] }),
    }),
    { name: "a360-cart" }
  )
);

export function useCartCount(): number {
  return useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
}

export function useCartSubtotal(): number {
  return useCartStore((s) => s.items.reduce((sum, i) => sum + i.lineTotal, 0));
}