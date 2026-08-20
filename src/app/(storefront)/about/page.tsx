import type { Metadata } from "next";
import { BadgeCheck, Truck, Wrench, MapPin, Target, Users, ShieldCheck } from "lucide-react";
import { getSettings } from "@/lib/services/settings";
import { BrandMarquee, TrustSection, ReviewsSection } from "@/components/home/sections";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About Auto360 Gh — Your Automotive Partner in Accra",
  description:
    "Learn about Auto360 Gh, the automotive business at 103 Hallelujah Broadway, Accra — genuine spare parts, premium LIQUI MOLY lubricants and professional vehicle care.",
};

export default async function AboutPage() {
  const settings = await getSettings();

  const values = [
    { icon: ShieldCheck, title: "Genuine, Always", text: "We stock authentic brands and quality-assured parts — never fakes, never short-cuts." },
    { icon: Target, title: "Right Product, First Time", text: "Our team helps you find the correct product for your vehicle and use case." },
    { icon: Users, title: "Customer-First", text: "Honest advice and dependable service for every driver who walks in or messages us." },
    { icon: Truck, title: "Reliable Delivery", text: "Convenient delivery and kerbside pickup so your vehicle stays on the road." },
  ];

  return (
    <>
      <div className="bg-carbon-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-race-400">About Us</p>
          <h1 className="mt-2 max-w-2xl font-display text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
            The Story of Auto360 Gh
          </h1>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-carbon-900 sm:text-3xl">
                Automotive expertise, rooted in Accra
              </h2>
              <div className="mt-5 space-y-4 text-carbon-600 leading-relaxed">
                <p>
                  Auto360 Gh started with a simple belief: drivers in Ghana deserve genuine products and honest,
                  professional advice. From our base at <span className="font-semibold text-carbon-900">{settings.address}</span>,
                  we supply premium automotive parts, lubricants and care products — with LIQUI MOLY as one of our major
                  brands — and back them up with professional mechanical and detailing services.
                </p>
                <p>
                  Whether you need engine oil for a daily commute, a full service, or a showroom-quality detail, our team
                  combines real workshop experience with a modern, convenient way to shop.
                </p>
                <p className="flex items-start gap-2 text-sm font-medium text-carbon-800">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-race-500" />
                  {settings.address} · Plus code {settings.plusCode}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "20+", label: "Liqui Moly products" },
                { value: "9", label: "Product categories" },
                { value: "4", label: "Core services" },
                { value: "100%", label: "Genuine guarantee" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-carbon-200 bg-carbon-50/60 p-6 text-center">
                  <p className="font-display text-3xl font-extrabold text-race-500">{s.value}</p>
                  <p className="mt-1 text-sm text-carbon-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-carbon-200 bg-white p-6 shadow-card">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-carbon-900 text-white">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3.5 font-semibold text-carbon-900">{v.title}</h3>
                <p className="mt-1.5 text-sm text-carbon-500">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TrustSection />
      <ReviewsSection />
      <BrandMarquee />
    </>
  );
}