import { NextRequest, NextResponse } from "next/server";
import { requireStaff, isManager } from "@/lib/auth/admin-auth";
import { createSale } from "@/lib/services/sales";

export async function POST(request: NextRequest) {
  const auth = await requireStaff();
  if (auth instanceof NextResponse) return auth;

  try {
    const { items, discount, amountPaid, paymentMethod, customerName, notes } = await request.json();
    const sale = await createSale({
      items,
      discount: Number(discount ?? 0),
      amountPaid: amountPaid !== undefined ? Number(amountPaid) : undefined,
      paymentMethod,
      cashierName: auth.session.name,
      customerName,
      notes,
    });
    return NextResponse.json({ sale }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}