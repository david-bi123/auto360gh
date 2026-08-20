import { NextRequest, NextResponse } from "next/server";
import { requireManager } from "@/lib/auth/admin-auth";
import { updateSettings } from "@/lib/services/settings";

const ALLOWED = [
  "name", "logo", "heroImage", "tagline", "description", "phone", "whatsapp", "email",
  "address", "plusCode", "city", "country", "mapsUrl", "mapsEmbedUrl",
  "openingHours", "announcement", "announcementEnabled", "footerText", "deliveryInfo",
  "featuredBrandName", "featuredBrandDescription", "featuredBrandImage",
];

export async function PATCH(request: NextRequest) {
  const auth = await requireManager();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const patch: Record<string, unknown> = {};
    for (const k of ALLOWED) if (k in body) patch[k] = body[k];
    if (Object.keys(patch).length === 0) return NextResponse.json({ error: "Nothing to update." }, { status: 400 });

    const settings = await updateSettings(patch as never);
    return NextResponse.json({ settings });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}