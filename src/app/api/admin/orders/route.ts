import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/admin-auth";
import { updateOrderStatus, getOrder } from "@/lib/services/orders";
import type { OrderStatus } from "@/types";
import { ORDER_STATUS_META } from "@/config/constants";
import { getDb } from "@/lib/db";

const STATUSES = Object.keys(ORDER_STATUS_META) as OrderStatus[];

export async function PATCH(request: NextRequest) {
  const auth = await requireStaff();
  if (auth instanceof NextResponse) return auth;

  try {
    const { id, status, note } = await request.json();
    if (!id) return NextResponse.json({ error: "Order id is required." }, { status: 400 });
    if (!STATUSES.includes(status)) return NextResponse.json({ error: "Invalid status." }, { status: 400 });

    const order = await getOrder(id);
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

    const updated = await updateOrderStatus(id, status as OrderStatus, note || undefined);

    if (status === "completed" && order.status !== "completed") {
      const db = await getDb();
      await db.notifications.insertOne({
        type: "order",
        title: "Order completed",
        message: `${order.orderNumber} was marked completed by ${auth.session.name}.`,
        read: false,
        link: "/admin/orders",
        createdAt: new Date(),
      });
    }

    return NextResponse.json({ order: updated });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}