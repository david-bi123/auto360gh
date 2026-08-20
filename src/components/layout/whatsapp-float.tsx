"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { whatsappLink } from "@/lib/services/settings";
import type { BusinessSettings } from "@/types";

export function WhatsAppFloat({ settings }: { settings: BusinessSettings }) {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 900);
    return () => clearTimeout(t);
  }, []);

  const quickActions = [
    {
      label: "Ask about a product",
      text: "Hello Auto360 Gh, I'd like to ask about a product. Is it available?",
    },
    {
      label: "Book a service",
      text: "Hello Auto360 Gh, I'd like to book a mechanical / detailing service.",
    },
    {
      label: "Place an order",
      text: "Hello Auto360 Gh, I'd like to place an order for pickup/delivery.",
    },
  ];

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: "spring", damping: 24, stiffness: 320 }}
            className="w-72 overflow-hidden rounded-2xl border border-carbon-200 bg-white shadow-raised"
          >
            <div className="flex items-center gap-3 bg-[#075E54] p-4 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]/30">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Auto360 Gh</p>
                <p className="text-xs text-white/70">Typically replies within minutes</p>
              </div>
            </div>
            <div className="space-y-2 p-3">
              {quickActions.map((a) => (
                <a
                  key={a.label}
                  href={whatsappLink(settings, a.text)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-carbon-200 px-3.5 py-2.5 text-sm text-carbon-800 transition-colors hover:border-[#25D366] hover:bg-[#25D366]/5"
                >
                  {a.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Chat with Auto360 Gh on WhatsApp"
        className={cnFloat(show)}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}

function cnFloat(show: boolean): string {
  return [
    "flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_-4px_rgba(37,211,102,0.6)] transition-all duration-300",
    show ? "scale-100 opacity-100" : "scale-0 opacity-0",
    "hover:scale-110 active:scale-95",
  ].join(" ");
}