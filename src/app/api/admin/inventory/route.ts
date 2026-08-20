import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/admin-auth";
import { adjustStock } from "@/lib/services/products";

export async function POST(request: NextRequest) {
  const auth = await requireStaff();
  if (auth instanceof NextResponse) return auth;

  try {
    const { productId, quantity, type, reason } = await request.json();
    if (!productId || !quantity || !type) {
      return NextResponse.json({ error: "productId, quantity and type are required." }, { status: 400 });
    }
    const product = await adjustStock(productId, Number(quantity), type, { reason, performedBy: auth.session.name });
    return NextResponse.json({ product });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}