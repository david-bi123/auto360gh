import type { Metadata } from "next";
import Link from "next/link";
import { Wrench, Sparkles, Droplets, Cog, Check, ArrowRight, Phone, MessageCircle } from "lucide-react";
import { getServices } from "@/lib/services/public";
import { getSettings, whatsappLink } from "@/lib/services/settings";
import { ProductImage } from "@/components/ui/product-image";
import { BrandMarquee } from "@/components/home/sections";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Services — Mechanical Work, Detailing, Lubricants & Spare Parts",
  description:
    "Professional automotive services in Accra: mechanical work, vehicle detailing, premium lubricants and genuine spare parts from Auto360 Gh.",
};

const iconMap: Record<string, typeof Wrench> = { wrench: Wrench, sparkles: Sparkles, droplets: Droplets, cog: Cog };

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getServices(), getSettings()]);
  const wa = whatsappLink(settings, "Hello Auto360 Gh, I'd like to book a service.");

  return (
    <>
      <div className="bg-carbon-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-race-400">Auto360 Gh Services</p>
          <h1 className="mt-2 max-w-2xl font-display text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
            Professional Vehicle Care in Accra
          </h1>
          <p className="mt-4 max-w-xl text-white/60">
            From routine mechanical work to showroom-fresh detailing, our team cares for your vehicle like our own.
          </p>
        </div>
      </div>

      <div className="bg-carbon-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon] ?? Wrench;
              return (
                <div
                  key={service._id}
                  className="group overflow-hidden rounded-3xl border border-carbon-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="relative aspect-[21/9] overflow-hidden bg-carbon-100">
                    <ProductImage src={service.image} alt={service.name} productName={service.name} brand="Auto360 Services" fill />
                    <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-xl bg-carbon-950/85 text-white backdrop-blur transition-colors group-hover:bg-race-500">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="p-6 sm:p-7">
                    <span className="text-xs font-semibold uppercase tracking-wider text-race-500">Service {String(i + 1).padStart(2, "0")}</span>
                    <h2 className="mt-1.5 text-xl font-bold text-carbon-900 sm:text-2xl">{service.name}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-carbon-500">{service.longDescription}</p>
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {service.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-carbon-700">
                          <Check className="h-4 w-4 shrink-0 text-mint-500" /> {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-race-600 hover:text-race-700"
                    >
                      Book this service <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-3xl bg-carbon-950 px-6 py-8 text-white sm:flex-row sm:px-10">
            <div>
              <h2 className="font-display text-xl font-extrabold uppercase sm:text-2xl">Prefer to talk first?</h2>
              <p className="mt-1 text-sm text-white/60">Call or WhatsApp us and we will advise on the right service for your vehicle.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={`tel:${settings.phone}`} className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-carbon-950 transition-colors hover:bg-carbon-100">
                <Phone className="h-4 w-4" /> {settings.phone}
              </a>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1fb959]">
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
      <BrandMarquee />
    </>
  );
}