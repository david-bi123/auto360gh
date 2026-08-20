import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/admin-auth";
import { markNotificationRead, markAllNotificationsRead } from "@/lib/services/notifications";

export async function PATCH(request: NextRequest) {
  const auth = await requireStaff();
  if (auth instanceof NextResponse) return auth;

  try {
    const { id, all } = await request.json();
    if (all) {
      await markAllNotificationsRead();
      return NextResponse.json({ success: true });
    }
    if (!id) return NextResponse.json({ error: "Notification id is required." }, { status: 400 });
    await markNotificationRead(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}