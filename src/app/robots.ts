import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/pos", "/account", "/api"] },
    ],
    sitemap: "https://auto360gh.com/sitemap.xml",
  };
}