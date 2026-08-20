import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/admin-auth";
import { getDb } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { ROLE_HIERARCHY } from "@/config/constants";
import type { Role } from "@/types";

const STAFF_ROLE_VALUES = ["super_admin", "admin", "manager", "cashier", "staff"] as const;
const ROLE_RANK = (r: Role) => ROLE_HIERARCHY.indexOf(r);

async function auth() {
  const result = await requireStaff();
  if (result instanceof NextResponse) return result;
  if (!["super_admin", "admin"].includes(result.session.role)) {
    return NextResponse.json({ error: "Only admins can manage staff." }, { status: 403 });
  }
  return result;
}

export async function POST(request: NextRequest) {
  const authRes = await auth();
  if (authRes instanceof NextResponse) return authRes;

  try {
    const { name, email, phone, password, role } = await request.json();
    if (!name || !email || !password) return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
    if (!STAFF_ROLE_VALUES.includes(role)) return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    if (ROLE_RANK(role as Role) < ROLE_RANK(authRes.session.role)) {
      return NextResponse.json({ error: "You cannot assign a higher role than your own." }, { status: 403 });
    }
    if (String(password).length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });

    const db = await getDb();
    const existing = await db.users.findOne({ email: { $regex: email, $options: "i" } } as never);
    if (existing) return NextResponse.json({ error: "A user with this email already exists." }, { status: 400 });

    const user = await db.users.insertOne({
      name,
      email,
      phone: phone ?? "",
      passwordHash: await hashPassword(String(password)),
      role: role as Role,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const authRes = await auth();
  if (authRes instanceof NextResponse) return authRes;

  try {
    const { id, role, active, name, phone, password } = await request.json();
    if (!id) return NextResponse.json({ error: "User id is required." }, { status: 400 });
    if (id === authRes.session.sub && role) {
      return NextResponse.json({ error: "You cannot change your own role." }, { status: 403 });
    }

    const db = await getDb();
    const user = await db.users.findById(id);
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
    if (role && ROLE_RANK(role as Role) < ROLE_RANK(authRes.session.role)) {
      return NextResponse.json({ error: "You cannot assign a higher role than your own." }, { status: 403 });
    }

    const patch: Record<string, unknown> = { updatedAt: new Date() };
    if (role) patch.role = role;
    if (active !== undefined) patch.active = active;
    if (name) patch.name = name;
    if (phone !== undefined) patch.phone = phone;
    if (password) {
      if (String(password).length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
      patch.passwordHash = await hashPassword(String(password));
    }

    const updated = await db.users.updateById(id, patch);
    return NextResponse.json({ user: updated });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}