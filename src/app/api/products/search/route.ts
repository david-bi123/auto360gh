import { NextRequest, NextResponse } from "next/server";
import { queryProducts } from "@/lib/services/products";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const q = params.get("q") ?? "";
  const limit = Math.min(30, Number(params.get("limit") ?? 12));
  const full = params.get("full") === "1";

  try {
    const result = await queryProducts({
      search: q || undefined,
      perPage: limit,
      sort: "newest",
    });

    const items = result.items.map((p) => {
      const base = {
        _id: p._id,
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        brand: p.brand,
        category: p.category,
        price: p.price,
        stock: p.stock,
        images: p.images,
        active: p.active,
      };
      return full ? { ...base, description: p.description, costPrice: p.costPrice } : base;
    });

    return NextResponse.json({ items, total: result.total });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}