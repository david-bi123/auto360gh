import { NextRequest, NextResponse } from "next/server";
import { requireStaff, isManager } from "@/lib/auth/admin-auth";
import { createProduct, updateProduct, deleteProduct, queryProducts } from "@/lib/services/products";

export async function GET(request: NextRequest) {
  const auth = await requireStaff();
  if (auth instanceof NextResponse) return auth;

  const params = request.nextUrl.searchParams;
  const search = params.get("search") ?? "";
  const category = params.get("category") ?? "";
  const page = Number(params.get("page") ?? "1");
  const perPage = Number(params.get("perPage") ?? "10");

  const result = await queryProducts({ search, category, page, perPage });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const auth = await requireStaff();
  if (auth instanceof NextResponse) return auth;
  if (!isManager(auth.session)) return NextResponse.json({ error: "Manager access required." }, { status: 403 });

  try {
    const body = await request.json();
    const product = await createProduct(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireStaff();
  if (auth instanceof NextResponse) return auth;
  if (!isManager(auth.session)) return NextResponse.json({ error: "Manager access required." }, { status: 403 });

  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "Product id is required." }, { status: 400 });
    const product = await updateProduct(body.id, body);
    return NextResponse.json({ product });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireStaff();
  if (auth instanceof NextResponse) return auth;
  if (!isManager(auth.session)) return NextResponse.json({ error: "Manager access required." }, { status: 403 });

  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Product id is required." }, { status: 400 });
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}