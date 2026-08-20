import { NextRequest, NextResponse } from "next/server";
import { requireStaff, isManager } from "@/lib/auth/admin-auth";
import { getDb } from "@/lib/db";

export async function PATCH(request: NextRequest) {
  const auth = await requireStaff();
  if (auth instanceof NextResponse) return auth;
  if (!isManager(auth.session)) return NextResponse.json({ error: "Manager access required." }, { status: 403 });

  try {
    const { id, ...patch } = await request.json();
    if (!id) return NextResponse.json({ error: "Service id is required." }, { status: 400 });
    const allowed = ["name", "shortName", "description", "features", "price", "active", "sortOrder"];
    const clean: Record<string, unknown> = {};
    for (const k of allowed) if (k in patch) clean[k] = patch[k];
    if (Object.keys(clean).length === 0) return NextResponse.json({ error: "Nothing to update." }, { status: 400 });

    const db = await getDb();
    const service = await db.services.findById(id);
    if (!service) return NextResponse.json({ error: "Service not found." }, { status: 404 });
    const updated = await db.services.updateById(id, { ...clean, updatedAt: new Date() });
    return NextResponse.json({ service: updated });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}