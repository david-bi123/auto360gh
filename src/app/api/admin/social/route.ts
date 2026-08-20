import { NextRequest, NextResponse } from "next/server";
import { requireManager } from "@/lib/auth/admin-auth";
import { updateSocialLinks } from "@/lib/services/settings";

const ALLOWED = ["facebook", "instagram", "twitter", "youtube", "whatsapp", "tiktok"];

export async function PATCH(request: NextRequest) {
  const auth = await requireManager();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const patch: Record<string, string> = {};
    for (const k of ALLOWED) if (typeof body[k] === "string") patch[k] = body[k].trim();
    if (Object.keys(patch).length === 0) return NextResponse.json({ error: "Nothing to update." }, { status: 400 });

    const links = await updateSocialLinks(patch as never);
    return NextResponse.json({ links });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}