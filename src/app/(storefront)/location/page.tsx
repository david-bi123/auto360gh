import type { Metadata } from "next";
import { MapPin, Navigation, Phone, MessageCircle } from "lucide-react";
import { getSettings, whatsappLink } from "@/lib/services/settings";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Our Location — Auto360 Gh, 103 Hallelujah Broadway, Accra",
  description:
    "Visit Auto360 Gh at 103 Hallelujah Broadway, Accra (Plus code MRQ9+W7 Accra). Get directions, call or WhatsApp us.",
};

export default async function LocationPage() {
  const settings = await getSettings();
  const wa = whatsappLink(settings, "Hello Auto360 Gh, can I get directions to your shop?");

  return (
    <>
      <div className="bg-carbon-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-race-400">Our Location</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">Visit Auto360 Gh</h1>
          <p className="mt-4 max-w-xl text-white/60">
            We are based at {settings.address}. Pull in for kerbside pickup, walk in to browse, or arrange delivery.
          </p>
        </div>
      </div>

      <div className="bg-carbon-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-1">
              <div className="rounded-2xl border border-carbon-200 bg-white p-6 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-race-500 text-white">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-carbon-900">Auto360 Gh</p>
                    <p className="text-sm text-carbon-500">{settings.address}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-xl bg-carbon-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-wider text-carbon-400">Google Maps Plus Code</p>
                  <p className="mt-0.5 font-mono text-lg font-bold text-carbon-900">{settings.plusCode}</p>
                </div>
                <div className="mt-5 flex flex-col gap-2.5">
                  <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-carbon-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-race-500">
                    <Navigation className="h-4 w-4" /> Get Directions
                  </a>
                  <a href={`tel:${settings.phone}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-carbon-200 px-5 text-sm font-semibold text-carbon-800 transition-colors hover:bg-carbon-50">
                    <Phone className="h-4 w-4" /> {settings.phone}
                  </a>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1fb959]">
                    <MessageCircle className="h-4 w-4" /> WhatsApp Directions
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-carbon-200 bg-white p-6 shadow-card">
                <p className="text-sm font-semibold text-carbon-900">Delivery areas</p>
                <p className="mt-1.5 text-sm leading-relaxed text-carbon-500">{settings.deliveryInfo}</p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-3xl border border-carbon-200 bg-white shadow-card">
                {settings.mapsEmbedUrl ? (
                  <iframe
                    src={settings.mapsEmbedUrl}
                    title="Auto360 Gh on Google Maps"
                    className="h-[520px] w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="relative flex h-[520px] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-carbon-800 to-carbon-950">
                      <div className="absolute inset-0 bg-grid-dark opacity-60" />
                      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-race-500/10 blur-3xl" />
                      <div className="relative flex h-20 w-20 animate-bounce items-center justify-center rounded-3xl bg-race-500 shadow-glow">
                        <MapPin className="h-10 w-10 text-white" />
                      </div>
                      <p className="relative mt-5 text-lg font-bold text-white">Auto360 Gh</p>
                      <p className="relative text-sm text-white/60">{settings.address}</p>
                      <p className="relative mt-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-white/70">
                        {settings.plusCode}
                      </p>
                      <p className="relative mt-5 text-sm font-medium text-race-400">Tap anywhere to open in Google Maps →</p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}