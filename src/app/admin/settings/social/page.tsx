import type { Metadata } from "next";
import { getSocialLinks } from "@/lib/services/settings";
import { SocialLinksForm } from "@/components/admin/social-links-form";

export const metadata: Metadata = { title: "Social Media — Auto360 Admin" };
export const dynamic = "force-dynamic";

export default async function AdminSocialPage() {
  const links = await getSocialLinks();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-carbon-900">Social media</h1>
        <p className="text-sm text-carbon-500">Manage the social links used across the storefront.</p>
      </div>
      <SocialLinksForm links={links} />
    </div>
  );
}