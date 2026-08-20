import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Truck, Droplets, Car, HelpCircle } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/services/products";
import { getSettings, whatsappLink } from "@/lib/services/settings";
import { ProductDetail } from "@/components/products/product-detail";
import { ProductGrid } from "@/components/products/product-grid";
import { SectionHeading } from "@/components/products/product-grid";
import { Card, CardContent } from "@/components/ui/card";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} — ${product.brand}`,
    description: product.shortDescription ?? product.description.slice(0, 155),
    openGraph: {
      title: `${product.name} | Auto360 Gh`,
      description: product.shortDescription ?? product.description.slice(0, 155),
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [resolved, settings] = await Promise.all([getProductBySlug(slug), getSettings()]);
  if (!resolved) notFound();

  const relatedProducts = await getRelatedProducts(resolved, 4);
  const wa = whatsappLink(settings, `Hello Auto360 Gh, I need help choosing the right ${resolved.category} product.`);

  return (
    <div className="bg-carbon-50 pb-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-carbon-400">
          <a href="/" className="hover:text-race-600">Home</a>
          <span>/</span>
          <a href="/shop" className="hover:text-race-600">Shop</a>
          <span>/</span>
          <a href={`/shop?category=${encodeURIComponent(resolved.category)}`} className="hover:text-race-600">{resolved.category}</a>
          <span>/</span>
          <span className="text-carbon-700 line-clamp-1">{resolved.name}</span>
        </nav>

        <ProductDetail product={resolved} settings={settings} />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="space-y-6 p-6">
              <div>
                <h2 className="text-lg font-bold text-carbon-900">Description</h2>
                <p className="mt-2 text-sm leading-relaxed text-carbon-600">{resolved.description}</p>
              </div>

              {resolved.specifications.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-carbon-900">Specifications</h2>
                  <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                    {resolved.specifications.map((s) => (
                      <div key={s.label} className="flex items-center justify-between rounded-xl border border-carbon-200 bg-carbon-50/60 px-4 py-3">
                        <dt className="flex items-center gap-2 text-sm font-medium text-carbon-500">
                          <Droplets className="h-4 w-4 text-race-500" /> {s.label}
                        </dt>
                        <dd className="text-sm font-semibold text-carbon-800">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {resolved.vehicleCompatibility.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-carbon-900">Vehicle Compatibility</h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {resolved.vehicleCompatibility.map((v, i) => (
                      <li key={i} className="flex items-center gap-2 rounded-full border border-carbon-200 bg-white px-3.5 py-1.5 text-sm text-carbon-700">
                        <Car className="h-4 w-4 text-race-500" />
                        {v.make} {v.model} {v.yearFrom ? `(${v.yearFrom}–${v.yearTo ?? "now"})` : ""}
                        {v.engine ? ` · ${v.engine}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {resolved.usageInstructions && (
                <div>
                  <h2 className="text-lg font-bold text-carbon-900">Usage Instructions</h2>
                  <p className="mt-2 text-sm leading-relaxed text-carbon-600">{resolved.usageInstructions}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-between bg-carbon-950 text-white">
            <CardContent className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-race-500/15 text-race-400">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Need help choosing the right product?</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Talk to an Auto360 Gh specialist. We can confirm fitment, compatibility and the best product for your vehicle.
              </p>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-semibold text-white transition-colors hover:bg-[#1fb959]"
              >
                Talk to an Auto360 Specialist
              </a>
            </CardContent>
            <div className="flex items-center gap-2 border-t border-white/10 px-6 py-4 text-xs text-white/50">
              <Truck className="h-4 w-4 text-race-400" /> {settings.deliveryInfo}
            </div>
          </Card>
        </div>

        <div className="mt-16">
          <SectionHeading eyebrow="You may also like" title="Related Products" href="/shop" />
          <div className="mt-6">
            <ProductGrid products={relatedProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}