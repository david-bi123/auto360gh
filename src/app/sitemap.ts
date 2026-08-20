import type { MetadataRoute } from "next";
import { getDb } from "@/lib/db";

const base = "https://auto360gh.com";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await getDb();
  const [products, services, categories] = await Promise.all([
    db.products.find({ active: true } as never),
    db.services.find({ active: true } as never),
    db.categories.find({} as never),
  ]);

  const staticPages = ["", "shop", "services", "about", "contact", "location", "cart", "checkout"].map((p) => ({
    url: `${base}/${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));

  const productPages = products.map((p) => ({
    url: `${base}/shop/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const servicePages = services.map((s) => ({
    url: `${base}/services#${s.slug}`,
    lastModified: s.updatedAt ?? s.createdAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const categoryPages = categories.map((c) => ({
    url: `${base}/shop?category=${encodeURIComponent(c.name)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...servicePages, ...categoryPages];
}