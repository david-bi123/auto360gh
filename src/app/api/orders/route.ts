import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/services/orders";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const order = await createOrder({
      customerName: String(body.customerName ?? ""),
      phone: String(body.phone ?? ""),
      whatsapp: body.whatsapp ? String(body.whatsapp) : undefined,
      email: body.email ? String(body.email) : undefined,
      items: Array.isArray(body.items)
        ? body.items.map((i: { productId: string; quantity: number }) => ({ productId: String(i.productId), quantity: Number(i.quantity) }))
        : [],
      orderMethod: body.orderMethod === "delivery" ? "delivery" : "pickup",
      deliveryAddress: body.deliveryAddress ? String(body.deliveryAddress) : undefined,
      city: body.city ? String(body.city) : undefined,
      notes: body.notes ? String(body.notes) : undefined,
      paymentMethod: body.paymentMethod ? String(body.paymentMethod) : "Cash",
    });

    return NextResponse.json({ success: true, orderId: order._id, orderNumber: order.orderNumber, total: order.total }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}