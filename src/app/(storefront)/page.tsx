import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { BrandSection, TrustSection, ServicesSection, ReviewsSection, LocationSection, WhatsAppCta, BrandMarquee } from "@/components/home/sections";
import { ProductGrid, ProductGridSkeleton, SectionHeading } from "@/components/products/product-grid";
import { getSettings } from "@/lib/services/settings";
import { getFeaturedProducts, getBestSellers } from "@/lib/services/products";
import { getServices } from "@/lib/services/public";
import { getFeaturedCategories } from "@/lib/services/catalog";
import { ProductImage } from "@/components/ui/product-image";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Auto360 Gh — Premium Automotive Products, Lubricants & Services in Accra",
  description:
    "Genuine spare parts, premium LIQUI MOLY engine oils, additives, coolants, brake fluids and professional mechanical services in Accra, Ghana. Drive better. Maintain smarter.",
};

async function FeaturedProducts() {
  const products = await getFeaturedProducts(8);
  return <ProductGrid products={products} priorityFirst={4} />;
}

async function BestSellers() {
  const products = await getBestSellers(8);
  return <ProductGrid products={products} />;
}

async function FeaturedCategories() {
  const categories = await getFeaturedCategories();
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {categories.map((c) => (
        <Link
          key={c._id}
          href={`/shop?category=${encodeURIComponent(c.name)}`}
          className="group relative aspect-square overflow-hidden rounded-2xl border border-carbon-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
        >
          <ProductImage src={c.image} alt={c.name} productName={c.name} brand="Auto360" fill />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-carbon-950/90 to-transparent p-3 pt-8">
            <p className="text-sm font-bold text-white">{c.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default async function HomePage() {
  const settings = await getSettings();
  const [services, categories] = await Promise.all([getServices(), getFeaturedCategories()]);

  return (
    <>
      <Hero settings={settings} />
      <BrandMarquee />

      <section className="bg-carbon-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Featured Products"
            title="Bestsellers & Featured"
            description="A hand-picked selection from our catalogue of genuine automotive products."
            href="/shop"
          />
          <div className="mt-8">
            <Suspense fallback={<ProductGridSkeleton count={8} />}>
              <FeaturedProducts />
            </Suspense>
          </div>
        </div>
      </section>

      <BrandSection settings={settings} products={await getFeaturedProducts(6)} />

      <TrustSection />

      <ServicesSection services={services} />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Shop by Category" title="Browse Our Range" href="/shop" />
          <div className="mt-8">
            {categories.length > 0 ? (
              <FeaturedCategories />
            ) : (
              <div className="rounded-2xl border border-dashed border-carbon-300 bg-carbon-50/60 p-10 text-center text-sm text-carbon-500">
                Categories will appear here.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-carbon-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Most Loved"
            title="Best Sellers"
            description="The products Accra drivers keep coming back for."
            href="/shop?sort=bestseller"
          />
          <div className="mt-8">
            <Suspense fallback={<ProductGridSkeleton count={8} />}>
              <BestSellers />
            </Suspense>
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href="/shop"
              className="group inline-flex h-12 items-center gap-2 rounded-xl bg-carbon-900 px-6 text-base font-semibold text-white transition-colors hover:bg-race-500"
            >
              <ShoppingBag className="h-5 w-5" />
              Browse the Full Shop
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      <ReviewsSection />
      <LocationSection settings={settings} />
      <WhatsAppCta settings={settings} />
    </>
  );
}