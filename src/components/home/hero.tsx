"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Wrench, MessageCircle, ArrowRight, Star, ShieldCheck, Truck, Sparkles } from "lucide-react";
import type { BusinessSettings } from "@/types";
import { whatsappLink } from "@/lib/services/settings";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero({ settings }: { settings: BusinessSettings }) {
  const wa = whatsappLink(settings, "Hello Auto360 Gh, I'd like to make an enquiry.");

  return (
    <section className="relative overflow-hidden bg-carbon-950 text-white">
      <div className="absolute inset-0 bg-grid-dark opacity-70" />
      <div className="absolute -top-40 left-1/2 h-96 w-[52rem] -translate-x-1/2 rounded-full bg-race-500/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-race-600/10 blur-[100px]" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-8 lg:px-8 lg:pb-28 lg:pt-24">
        <div>
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur">
              <span className="flex h-2 w-2">
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-race-500 opacity-75" />
                <span className="h-2 w-2 rounded-full bg-race-500" />
              </span>
              Premium automotive · Accra, Ghana
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 font-display text-4xl font-black uppercase leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.25rem]"
          >
            Drive Better.
            <br />
            <span className="text-gradient-race">Maintain Smarter.</span>
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2} className="mt-5 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
            Genuine automotive parts, premium LIQUI MOLY lubricants and professional vehicle care from Auto360 Gh.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/shop"
              className="group inline-flex h-12 items-center gap-2 rounded-xl bg-race-500 px-6 text-base font-semibold text-white shadow-glow transition-all hover:bg-race-600 active:scale-[0.98]"
            >
              <ShoppingBag className="h-5 w-5" />
              Shop Products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/services"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              <Wrench className="h-5 w-5" />
              Explore Our Services
            </Link>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-xl px-4 text-base font-semibold text-[#25D366] transition-colors hover:text-[#4ce98c]"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-10 grid max-w-lg grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4"
          >
            {[
              { icon: ShieldCheck, label: "100% Genuine" },
              { icon: Truck, label: "Local Delivery" },
              { icon: Star, label: "Rated 4.9/5" },
              { icon: Sparkles, label: "Premium Care" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2.5">
                <s.icon className="h-5 w-5 shrink-0 text-race-400" />
                <span className="text-sm font-medium text-white/80">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden lg:block"
        >
          <HeroStage settings={settings} />
        </motion.div>
      </div>
    </section>
  );
}

function HeroStage({ settings }: { settings: BusinessSettings }) {
  return (
    <div className="relative mx-auto max-w-lg">
      <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-race-500/25 via-white/5 to-transparent blur-2xl" />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-carbon-900 to-carbon-950 p-8 shadow-raised">
        <div className="absolute inset-0 bg-grid-dark opacity-40" />
        <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-race-500/20 blur-3xl" />

        <div className="relative flex items-center justify-between">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
            {settings.featuredBrandName}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-race-400">Featured Brand</span>
        </div>

        <CarSilhouette />

        <div className="relative mt-6 grid grid-cols-3 gap-3">
          {["Engine Oils", "Additives", "Car Care"].map((label, i) => (
            <motion.div
              key={label}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
              className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur"
            >
              <Bottle className="mx-auto" />
              <p className="mt-2 text-center text-[10px] font-semibold uppercase tracking-wider text-white/70">{label}</p>
            </motion.div>
          ))}
        </div>

        <div className="relative mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/50">This week</p>
            <p className="text-sm font-semibold text-white">Full workshop service</p>
          </div>
          <span className="rounded-lg bg-race-500 px-3 py-1.5 text-xs font-bold text-white">Book now</span>
        </div>
      </div>
    </div>
  );
}

function CarSilhouette() {
  return (
    <div className="relative mt-6">
      <svg viewBox="0 0 420 130" className="w-full text-white">
        <defs>
          <linearGradient id="carGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <g fill="url(#carGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1">
          <path d="M30 95 L62 60 Q64 56 70 56 L170 46 Q180 45 190 48 L260 58 Q266 59 268 63 L298 95 L372 95 Q386 95 392 103 Q396 109 390 112 L330 112 Q322 116 312 112 L120 112 Q110 112 106 108 Q102 104 96 104 L52 104 Q44 104 40 98 Q36 92 42 88 L30 95 Z" />
          <path d="M85 108 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0" fill="#111" stroke="rgba(255,255,255,0.5)" />
          <path d="M335 108 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0" fill="#111" stroke="rgba(255,255,255,0.5)" />
        </g>
        <path d="M96 58 L150 50 Q160 49 168 52 L220 60" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none" opacity="0.7" />
        <path d="M40 88 L380 88" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none" />
        <path d="M120 106 L300 106" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" strokeDasharray="4 6" />
      </svg>
      <div className="absolute inset-x-0 -bottom-2 h-6 rounded-full bg-race-500/25 blur-xl" />
    </div>
  );
}

function Bottle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 64" className={`h-16 w-12 ${className ?? ""}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="12" y="18" width="24" height="42" rx="4" className="text-race-400" opacity="0.9" />
      <path d="M16 18 V10 h16 v8" className="text-white/60" />
      <rect x="18" y="2" width="12" height="8" rx="2" className="text-white/70" />
      <line x1="17" y1="26" x2="31" y2="26" className="text-white/80" strokeWidth="1.5" />
      <line x1="17" y1="32" x2="31" y2="32" className="text-white/50" strokeWidth="1.5" />
      <line x1="17" y1="38" x2="26" y2="38" className="text-white/50" strokeWidth="1.5" />
    </svg>
  );
}