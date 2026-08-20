import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/admin-auth";
import { getDb } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

export async function PATCH(request: NextRequest) {
  const auth = await requireStaff();
  if (auth instanceof NextResponse) return auth;

  try {
    const { name, phone, currentPassword, newPassword } = await request.json();
    const db = await getDb();
    const user = await db.users.findById(auth.session.sub);
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

    const patch: Record<string, unknown> = { updatedAt: new Date() };
    if (name) patch.name = name;
    if (phone !== undefined) patch.phone = phone;

    if (newPassword) {
      if (!currentPassword) return NextResponse.json({ error: "Enter your current password." }, { status: 400 });
      const ok = await verifyPassword(String(currentPassword), user.passwordHash);
      if (!ok) return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      if (String(newPassword).length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
      patch.passwordHash = await hashPassword(String(newPassword));
    }

    const updated = await db.users.updateById(user._id, patch);
    return NextResponse.json({ user: updated });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}