"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  GraduationCap,
  ShoppingBasket,
  Truck,
  Store,
  MapPin,
  Wrench,
  Sparkles,
  Droplets,
  Cog,
  ArrowRight,
  Star,
  Quote,
  Phone,
  MessageCircle,
  Navigation,
} from "lucide-react";
import type { BusinessSettings, Service } from "@/types";
import { whatsappLink } from "@/lib/services/settings";
import { ProductImage } from "@/components/ui/product-image";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const serviceIcons: Record<string, typeof Wrench> = {
  wrench: Wrench,
  sparkles: Sparkles,
  droplets: Droplets,
  cog: Cog,
};

export function BrandSection({ settings, products }: { settings: BusinessSettings; products: Product[] }) {
  return (
    <section className="bg-carbon-950 py-20 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-race-500/10 blur-2xl" />
            <div className="relative grid grid-cols-2 gap-4 sm:grid-cols-3">
              {products.slice(0, 6).map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.45 }}
                  className={cn(
                    "overflow-hidden rounded-2xl border border-white/10 bg-carbon-900 shadow-inner-line",
                    i % 3 === 1 && "sm:-translate-y-3"
                  )}
                >
                  <div className="aspect-square">
                    <ProductImage src={p.images[0]} alt={p.name} productName={p.name} brand={p.brand} fill />
                  </div>
                  <div className="p-3">
                    <p className="truncate text-xs font-medium text-white/80">{p.name}</p>
                    <p className="mt-0.5 text-[11px] text-race-400">GH₵ {p.price.toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-race-400">Featured Brand</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold uppercase leading-tight sm:text-4xl">
              Premium Lubrication.
              <br />
              <span className="text-gradient-race">German Engineering.</span>
            </h2>
            <p className="mt-4 text-lg font-semibold text-white/90">{settings.featuredBrandName}</p>
            <p className="mt-2 max-w-lg leading-relaxed text-white/60">{settings.featuredBrandDescription}</p>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {["Engine oils & transmission fluids", "Performance additives", "Coolants & brake fluids", "Car care & cleaning"].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-white/80">
                  <BadgeCheck className="h-5 w-5 shrink-0 text-race-400" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop?brand=LIQUI MOLY"
                className="group inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-carbon-950 transition-colors hover:bg-race-50"
              >
                Explore Liqui Moly Products
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="/shop?brand=LIQUI MOLY&sort=price_asc" className="inline-flex h-11 items-center rounded-xl border border-white/20 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                View Prices
              </Link>
            </div>
            <p className="mt-4 text-xs text-white/40">
              Auto360 Gh is an authorized retailer of {settings.featuredBrandName} products. {settings.featuredBrandName} is a registered brand owned by its manufacturer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  const items = [
    { icon: BadgeCheck, title: "Genuine Products", text: "Only authentic brands and quality-assured parts." },
    { icon: GraduationCap, title: "Professional Expertise", text: "Experienced team with real automotive knowledge." },
    { icon: ShoppingBasket, title: "Convenient Ordering", text: "Order online, on WhatsApp or in person — your choice." },
    { icon: Truck, title: "Local Delivery", text: "Fast delivery across Accra on eligible orders." },
    { icon: Store, title: "Kerbside Pickup", text: "Collect your order quickly at Hallelujah Broadway." },
    { icon: MapPin, title: "In-Store Shopping", text: "Browse our range and shop with specialist guidance." },
  ];
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-race-500">Why Auto360</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight text-carbon-900 sm:text-4xl">
            Built Around Your Vehicle
          </h2>
          <p className="mt-3 text-carbon-500">Genuine products. Expert knowledge. Reliable service.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="group rounded-2xl border border-carbon-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-carbon-900 text-white transition-colors group-hover:bg-race-500">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-carbon-900">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-carbon-500">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicesSection({ services }: { services: Service[] }) {
  return (
    <section className="bg-carbon-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-race-500">Our Services</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight text-carbon-900 sm:text-4xl">
              Professional Vehicle Care
            </h2>
          </div>
          <Link href="/services" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-race-600 hover:text-race-700">
            All services <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => {
            const Icon = serviceIcons[service.icon] ?? Wrench;
            return (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-carbon-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-carbon-100">
                  <ProductImage src={service.image} alt={service.name} productName={service.name} brand="Auto360 Services" fill />
                  <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl bg-carbon-950/85 text-white backdrop-blur transition-colors group-hover:bg-race-500">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold text-carbon-900">{service.name}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-carbon-500">{service.description}</p>
                  <Link
                    href="/services"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-race-600 hover:text-race-700"
                  >
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  const reviews = [
    { name: "Kwame M.", role: "Toyota Corolla owner", text: "Genuine engine oil at a fair price and they explained exactly what my car needed. Very professional.", rating: 5 },
    { name: "Akosua B.", role: "Accra · Regular customer", text: "Ordered brake fluid on WhatsApp, picked it up the same afternoon. Smooth and easy experience.", rating: 5 },
    { name: "Yaw A.", role: "Mechanical work", text: "They serviced my car and used real Liqui Moly products. I could feel the difference immediately.", rating: 4.5 },
  ];
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-race-500">Customer Trust</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight text-carbon-900 sm:text-4xl">
            Drivers Trust Auto360
          </h2>
          <p className="mt-3 flex items-center justify-center gap-2 text-carbon-500">
            <span className="flex items-center gap-0.5 text-amber-400">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </span>
            Rated 4.9/5 by our customers
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.figure
              key={r.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="flex flex-col rounded-2xl border border-carbon-200 bg-white p-6 shadow-card"
            >
              <Quote className="h-6 w-6 text-race-400" />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-carbon-600">“{r.text}”</blockquote>
              <figcaption className="mt-5 flex items-center justify-between border-t border-carbon-100 pt-4">
                <div>
                  <p className="text-sm font-semibold text-carbon-900">{r.name}</p>
                  <p className="text-xs text-carbon-400">{r.role}</p>
                </div>
                <span className="flex items-center gap-0.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={cn("h-3.5 w-3.5", s <= Math.round(r.rating) ? "fill-current" : "fill-carbon-200 text-carbon-200")} />
                  ))}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LocationSection({ settings }: { settings: BusinessSettings }) {
  const wa = whatsappLink(settings, "Hello Auto360 Gh, can I get directions to your shop?");
  return (
    <section className="bg-carbon-950 py-20 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-race-400">Visit Us</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
              Find Auto360 Gh
            </h2>
            <p className="mt-4 flex items-start gap-3 text-lg font-semibold">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-race-400" />
              {settings.address}
            </p>
            <p className="mt-1 pl-8 text-sm text-white/60">Plus code: {settings.plusCode}</p>
            <p className="mt-4 pl-8 text-sm leading-relaxed text-white/60">
              Easy to reach, with kerbside pickup. Call ahead and we will have your order ready.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 pl-8">
              <a
                href={settings.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-race-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-race-600"
              >
                <Navigation className="h-4 w-4" /> Get Directions
              </a>
              <a href={`tel:${settings.phone}`} className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-semibold transition-colors hover:bg-white/10">
                <Phone className="h-4 w-4" /> {settings.phone}
              </a>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#25D366]/40 px-5 text-sm font-semibold text-[#25D366] transition-colors hover:bg-[#25D366]/10">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-race-500/10 blur-2xl" />
            <a
              href={settings.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block overflow-hidden rounded-[1.75rem] border border-white/10 bg-carbon-900"
            >
              {settings.mapsEmbedUrl ? (
                <iframe
                  src={settings.mapsEmbedUrl}
                  title="Auto360 Gh location map"
                  className="h-80 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <MapPlaceholder address={settings.address} plusCode={settings.plusCode} />
              )}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function MapPlaceholder({ address, plusCode }: { address: string; plusCode: string }) {
  return (
    <div className="relative flex h-80 w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-carbon-800 to-carbon-950">
      <div className="absolute inset-0 bg-grid-dark opacity-50" />
      <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-race-500/10 blur-3xl" />
      <div className="relative flex h-16 w-16 animate-bounce items-center justify-center rounded-2xl bg-race-500 shadow-glow">
        <MapPin className="h-8 w-8 text-white" />
      </div>
      <p className="relative mt-4 text-sm font-semibold text-white">{address}</p>
      <p className="relative text-xs text-white/50">Tap to open in Google Maps · {plusCode}</p>
    </div>
  );
}

export function WhatsAppCta({ settings }: { settings: BusinessSettings }) {
  const wa = whatsappLink(settings, "Hello Auto360 Gh, I need help choosing the right product.");
  return (
    <section className="relative overflow-hidden bg-carbon-950 py-16 text-white">
      <div className="absolute inset-0 bg-grid-dark opacity-50" />
      <div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-[#25D366]/15 blur-[90px]" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 lg:flex-row lg:px-8 lg:text-left">
        <div>
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">
            Need help choosing the right product?
          </h2>
          <p className="mt-2 text-white/60">Talk to an Auto360 Gh specialist on WhatsApp — we reply fast.</p>
        </div>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-[#25D366] px-6 text-base font-semibold text-white shadow-[0_8px_30px_-6px_rgba(37,211,102,0.55)] transition-all hover:bg-[#1fb959] active:scale-[0.98]"
        >
          <MessageCircle className="h-5 w-5" /> Talk to a Specialist
        </a>
      </div>
    </section>
  );
}

export function BrandMarquee() {
  const items = ["LIQUI MOLY", "Engine Oils", "Additives", "Brake Fluids", "Coolants", "Transmission Fluids", "Car Care", "Spare Parts", "Bosch", "Detailing", "Mechanical Work"];
  return (
    <div className="overflow-hidden border-y border-white/10 bg-carbon-950 py-4">
      <div className="mask-fade-x flex w-max animate-marquee gap-8">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap text-sm font-bold uppercase tracking-[0.3em] text-white/30">
            {item}
            <span className="h-1.5 w-1.5 rounded-full bg-race-500/70" />
          </span>
        ))}
      </div>
    </div>
  );
}