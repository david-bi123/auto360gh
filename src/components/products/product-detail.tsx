"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingCart, Zap, MessageCircle, Truck, Store, ShieldCheck, Check } from "lucide-react";
import type { BusinessSettings, Product } from "@/types";
import { formatGH, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/ui/quantity";
import { ProductImage } from "@/components/ui/product-image";
import { useToast } from "@/components/ui/toast";
import { StockBadge } from "./product-card";

export function ProductDetail({ product, settings }: { product: Product; settings: BusinessSettings }) {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [buying, setBuying] = useState(false);
  const [added, setAdded] = useState(false);

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "").replace(/\/$/, "");
  const productUrl = `${appUrl}/shop/${product.slug}`;
  const waDigits = (settings.whatsapp || settings.phone).replace(/[^\d]/g, "").replace(/^0+/, "");
  const waMessage = `Hello Auto360 Gh, I'm interested in ${product.name} (${formatGH(product.price)}). ${productUrl} — is it available?`;
  const waHref = `https://wa.me/${waDigits}?text=${encodeURIComponent(waMessage)}`;

  useEffect(() => {
    if (searchParams.get("ask") === "1") {
      window.open(waHref, "_blank");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const images = product.images.length > 0 ? product.images : [undefined];
  const onSale = product.onSale && product.compareAtPrice && product.compareAtPrice > product.price;

  const handleAdd = () => {
    if (product.stock <= 0) {
      toast("Out of stock", { type: "error", description: "This product is currently unavailable." });
      return;
    }
    addItem(product, qty);
    setAdded(true);
    toast("Added to cart", { description: `${qty} x ${product.name} added to your cart.` });
    setTimeout(() => setAdded(false), 1600);
  };

  const handleBuyNow = () => {
    addItem(product, qty);
    setBuying(true);
    router.push("/checkout");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <div>
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-carbon-200 bg-white shadow-card">
          <ProductImage
            src={images[activeImage]}
            alt={product.name}
            productName={product.name}
            brand={product.brand}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {onSale && (
            <span className="absolute left-4 top-4 rounded-full bg-race-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
              Save {formatGH(product.compareAtPrice! - product.price)}
            </span>
          )}
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  "h-20 w-20 overflow-hidden rounded-xl border-2 transition-colors",
                  activeImage === i ? "border-race-500" : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                <ProductImage src={img} alt={`${product.name} view ${i + 1}`} productName={product.name} brand={product.brand} fill />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-carbon-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-carbon-600">
            {product.brand}
          </span>
          <span className="text-xs text-carbon-400">SKU: {product.sku}</span>
        </div>

        <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-carbon-900 sm:text-3xl">
          {product.name}
        </h1>

        <div className="mt-3 flex items-center gap-3">
          <span className="text-3xl font-bold tracking-tight text-carbon-900">{formatGH(product.price)}</span>
          {onSale && <span className="text-lg text-carbon-400 line-through">{formatGH(product.compareAtPrice!)}</span>}
          <StockBadge product={product} />
        </div>

        <p className="mt-4 leading-relaxed text-carbon-600">{product.description}</p>

        <div className="mt-6 flex items-center gap-4">
          <QuantitySelector value={qty} onChange={setQty} max={Math.max(1, product.stock)} />
          <span className="text-sm text-carbon-400">Available: {product.stock}</span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button size="lg" onClick={handleAdd} disabled={product.stock <= 0} leftIcon={added ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}>
            {added ? "Added" : "Add to Cart"}
          </Button>
          <Button size="lg" variant="dark" onClick={handleBuyNow} loading={buying} leftIcon={<Zap className="h-5 w-5" />}>
            Buy Now
          </Button>
        </div>

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#25D366]/40 bg-[#25D366]/5 px-6 text-base font-semibold text-[#128C4A] transition-colors hover:bg-[#25D366]/10"
        >
          <MessageCircle className="h-5 w-5" /> Ask on WhatsApp
        </a>

        <div className="mt-6 space-y-2.5 rounded-2xl border border-carbon-200 bg-white p-4 shadow-card">
          {[
            { icon: Truck, text: settings.deliveryInfo || "Delivery available within Accra." },
            { icon: Store, text: "Kerbside pickup at 103 Hallelujah Broadway, Accra." },
            { icon: ShieldCheck, text: "Genuine product guarantee from Auto360 Gh." },
          ].map((f) => (
            <div key={f.text} className="flex items-start gap-3 text-sm text-carbon-600">
              <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-race-500" />
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}