import type { Metadata } from "next";
import { getSettings } from "@/lib/services/settings";
import { BusinessProfileForm } from "@/components/admin/business-profile-form";

export const metadata: Metadata = { title: "Business Profile — Auto360 Admin" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-carbon-900">Business profile</h1>
        <p className="text-sm text-carbon-500">Contact details, opening hours and branding shown across the storefront.</p>
      </div>
      <BusinessProfileForm settings={settings} />
    </div>
  );
}