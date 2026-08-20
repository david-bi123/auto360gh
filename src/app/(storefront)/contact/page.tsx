import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { getSettings, whatsappLink } from "@/lib/services/settings";
import { ContactForm } from "@/components/contact/contact-form";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact Auto360 Gh — Automotive Products & Services, Accra",
  description:
    "Get in touch with Auto360 Gh at 103 Hallelujah Broadway, Accra. Call, WhatsApp or visit us for genuine auto parts, LIQUI MOLY lubricants and services.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  const wa = whatsappLink(settings, "Hello Auto360 Gh, I'd like to make an enquiry.");

  const info = [
    { icon: MapPin, label: "Address", value: settings.address, sub: `Plus code: ${settings.plusCode}`, href: settings.mapsUrl },
    { icon: Phone, label: "Phone", value: settings.phone, sub: "Call us during opening hours", href: `tel:${settings.phone}` },
    { icon: MessageCircle, label: "WhatsApp", value: settings.whatsapp, sub: "Fast replies", href: wa },
    { icon: Mail, label: "Email", value: settings.email, sub: "For general enquiries", href: `mailto:${settings.email}` },
  ];

  return (
    <>
      <div className="bg-carbon-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-race-400">Contact</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">Get in Touch</h1>
          <p className="mt-4 max-w-xl text-white/60">
            Questions about a product, a service booking or a bulk order? We are here to help.
          </p>
        </div>
      </div>

      <div className="bg-carbon-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-5">
              {info.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href?.startsWith("http") ? "_blank" : undefined}
                  rel={c.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-start gap-4 rounded-2xl border border-carbon-200 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-carbon-900 text-white">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-carbon-400">{c.label}</p>
                    <p className="mt-0.5 font-semibold text-carbon-900">{c.value}</p>
                    {c.sub && <p className="text-sm text-carbon-500">{c.sub}</p>}
                  </div>
                </a>
              ))}

              <div className="rounded-2xl border border-carbon-200 bg-white p-5 shadow-card">
                <p className="flex items-center gap-2 text-sm font-semibold text-carbon-900">
                  <Clock className="h-4 w-4 text-race-500" /> Opening Hours
                </p>
                <ul className="mt-3 space-y-1.5">
                  {settings.openingHours.map((h) => (
                    <li key={h.day} className="flex items-center justify-between text-sm">
                      <span className="text-carbon-600">{h.day}</span>
                      <span className={h.closed ? "font-medium text-carbon-400" : "font-medium text-carbon-800"}>
                        {h.closed ? "Closed" : `${h.open} – ${h.close}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <ContactForm settings={settings} />
          </div>
        </div>
      </div>
    </>
  );
}