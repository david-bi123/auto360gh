import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/admin-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const auth = await requireStaff();
  if (auth instanceof NextResponse) return auth;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be under 5MB." }, { status: 400 });
    }

    if (cloudName && apiKey && apiSecret) {
      const bytes = Buffer.from(await file.arrayBuffer());
      const base64 = bytes.toString("base64");
      const timestamp = Math.floor(Date.now() / 1000);
      const folder = "auto360-gh/products";
      const publicId = `product-${timestamp}-${Math.random().toString(36).slice(2, 8)}`;

      const message = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
      const crypto = await import("node:crypto");
      const signature = crypto.createHash("sha1").update(message).digest("hex");

      const data = new URLSearchParams();
      data.set("file", `data:${file.type};base64,${base64}`);
      data.set("folder", folder);
      data.set("public_id", publicId);
      data.set("timestamp", String(timestamp));
      data.set("api_key", apiKey);
      data.set("signature", signature);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: data,
      });
      const result = (await res.json()) as { secure_url?: string; error?: { message: string } };
      if (!res.ok || !result.secure_url) {
        return NextResponse.json({ error: result.error?.message ?? "Cloudinary upload failed." }, { status: 502 });
      }
      return NextResponse.json({ url: result.secure_url });
    }

    const name = file.name.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
    const placeholder = `https://res.cloudinary.com/auto360gh/image/upload/v1/placeholder-${name}`;
    return NextResponse.json({ url: placeholder });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}