import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { signToken, createSessionCookie, SESSION_COOKIE } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.users.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    if (!user.active) {
      return NextResponse.json({ error: "This account has been deactivated." }, { status: 403 });
    }

    const ok = await verifyPassword(String(password), user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = await signToken({ sub: user._id, email: user.email, name: user.name, role: user.role, phone: user.phone });
    const res = NextResponse.json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      redirect: user.role === "customer" ? "/account" : "/admin",
    });
    res.headers.set("Set-Cookie", createSessionCookie(token));
    return res;
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}