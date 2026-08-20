"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import type { BusinessSettings, OpeningHour } from "@/types";

export function BusinessProfileForm({ settings }: { settings: BusinessSettings }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: settings.name,
    tagline: settings.tagline,
    description: settings.description,
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    email: settings.email,
    address: settings.address,
    plusCode: settings.plusCode,
    city: settings.city,
    country: settings.country,
    mapsUrl: settings.mapsUrl,
    footerText: settings.footerText,
    deliveryInfo: settings.deliveryInfo,
    announcement: settings.announcement,
    announcementEnabled: settings.announcementEnabled,
    featuredBrandName: settings.featuredBrandName,
    featuredBrandDescription: settings.featuredBrandDescription,
  });
  const [hours, setHours] = useState<OpeningHour[]>(
    settings.openingHours.length ? settings.openingHours : [
      { day: "Monday", open: "08:00", close: "18:00" },
      { day: "Tuesday", open: "08:00", close: "18:00" },
      { day: "Wednesday", open: "08:00", close: "18:00" },
      { day: "Thursday", open: "08:00", close: "18:00" },
      { day: "Friday", open: "08:00", close: "18:00" },
      { day: "Saturday", open: "08:00", close: "17:00" },
      { day: "Sunday", open: "09:00", close: "14:00", closed: true },
    ]
  );

  const set = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, openingHours: hours }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? "Could not save settings", { type: "error" });
        setLoading(false);
        return;
      }
      toast("Business profile saved", { description: "The storefront has been updated." });
      router.refresh();
    } catch {
      setLoading(false);
      toast("Something went wrong", { type: "error" });
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Business name" required>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Tagline" required>
          <Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </Field>
        <Field label="Phone" required>
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="WhatsApp number" hint="Used for all WhatsApp buttons and the floating chat">
          <Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
        </Field>
        <Field label="Email">
          <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Plus code" hint="Google Maps plus code">
          <Input value={form.plusCode} onChange={(e) => set("plusCode", e.target.value)} />
        </Field>
        <Field label="Address" required>
          <Input value={form.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
        <Field label="City / Country">
          <div className="grid grid-cols-2 gap-3">
            <Input value={form.city} onChange={(e) => set("city", e.target.value)} />
            <Input value={form.country} onChange={(e) => set("country", e.target.value)} />
          </div>
        </Field>
        <Field label="Google Maps link">
          <Input value={form.mapsUrl} onChange={(e) => set("mapsUrl", e.target.value)} />
        </Field>
        <Field label="Featured brand name" hint="e.g. LIQUI MOLY">
          <Input value={form.featuredBrandName} onChange={(e) => set("featuredBrandName", e.target.value)} />
        </Field>
      </div>

      <Field label="Description" hint="Shown in the footer and about sections">
        <Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
      </Field>
      <Field label="Featured brand description">
        <Textarea rows={2} value={form.featuredBrandDescription} onChange={(e) => set("featuredBrandDescription", e.target.value)} />
      </Field>
      <Field label="Footer text">
        <Input value={form.footerText} onChange={(e) => set("footerText", e.target.value)} />
      </Field>
      <Field label="Delivery info" hint="Shown on checkout">
        <Input value={form.deliveryInfo} onChange={(e) => set("deliveryInfo", e.target.value)} />
      </Field>
      <Field label="Announcement bar text">
        <Input value={form.announcement} onChange={(e) => set("announcement", e.target.value)} />
      </Field>
      <label className="flex items-center gap-2 text-sm font-medium text-carbon-700">
        <input type="checkbox" checked={form.announcementEnabled} onChange={(e) => set("announcementEnabled", e.target.checked)} className="h-4 w-4 accent-race-500" />
        Show announcement bar
      </label>

      <div className="rounded-2xl border border-carbon-200 bg-white p-5">
        <p className="mb-3 text-sm font-semibold text-carbon-900">Opening hours</p>
        <div className="space-y-2">
          {hours.map((h, i) => (
            <div key={h.day} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2">
              <span className="text-sm font-medium text-carbon-700">{h.day}</span>
              <label className="flex items-center gap-1.5 text-xs text-carbon-500">
                <input type="checkbox" checked={!h.closed} onChange={(e) => setHours(hours.map((x, j) => (j === i ? { ...x, closed: !e.target.checked } : x)))} className="h-3.5 w-3.5 accent-race-500" />
                Open
              </label>
              <input
                type="time"
                value={h.open}
                disabled={h.closed}
                onChange={(e) => setHours(hours.map((x, j) => (j === i ? { ...x, open: e.target.value } : x)))}
                className="h-9 rounded-lg border border-carbon-200 px-2 text-sm outline-none focus:border-race-400 disabled:opacity-40"
              />
              <input
                type="time"
                value={h.close}
                disabled={h.closed}
                onChange={(e) => setHours(hours.map((x, j) => (j === i ? { ...x, close: e.target.value } : x)))}
                className="h-9 rounded-lg border border-carbon-200 px-2 text-sm outline-none focus:border-race-400 disabled:opacity-40"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-carbon-200 pt-5">
        <Button type="submit" loading={loading} leftIcon={loading ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}>
          Save business profile
        </Button>
      </div>
    </form>
  );
}