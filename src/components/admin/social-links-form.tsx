"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import type { SocialLinks } from "@/types";

const FIELDS: { key: keyof Omit<SocialLinks, "_id" | "updatedAt">; label: string; placeholder: string }[] = [
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/auto360gh" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/auto360gh" },
  { key: "twitter", label: "Twitter / X", placeholder: "https://x.com/auto360gh" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@auto360gh" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@auto360gh" },
  { key: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/233598954177" },
];

export function SocialLinksForm({ links }: { links: SocialLinks }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Record<string, string>>(() =>
    Object.fromEntries(FIELDS.map((f) => [f.key, links[f.key] ?? ""]))
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/social", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? "Could not save social links", { type: "error" });
        setLoading(false);
        return;
      }
      toast("Social links saved", { description: "Links only appear when filled in." });
      router.refresh();
    } catch {
      setLoading(false);
      toast("Something went wrong", { type: "error" });
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <p className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
        Leave a field empty to hide that social icon from the storefront footer and contact page.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {FIELDS.map((f) => (
          <Field key={f.key} label={f.label}>
            <Input value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} />
          </Field>
        ))}
      </div>
      <div className="flex items-center justify-end gap-3 border-t border-carbon-200 pt-5">
        <Button type="submit" loading={loading} leftIcon={loading ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}>
          Save social links
        </Button>
      </div>
    </form>
  );
}