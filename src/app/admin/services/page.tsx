import type { Metadata } from "next";
import { getServices } from "@/lib/services/public";
import { ServicesManager } from "@/components/admin/services-manager";

export const metadata: Metadata = { title: "Services — Auto360 Admin" };
export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await getServices();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-carbon-900">Services</h1>
        <p className="text-sm text-carbon-500">Edit the services shown on your storefront.</p>
      </div>
      <ServicesManager services={services} />
    </div>
  );
}