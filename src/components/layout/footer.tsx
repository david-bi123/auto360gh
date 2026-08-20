import Link from "next/link";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import type { BusinessSettings, SocialLinks } from "@/types";
import { NAV_LINKS } from "@/config/constants";
import { Logo } from "./logo";
import { getConfiguredSocialLinks, whatsappLink } from "@/lib/services/settings";
import { SocialIcon, socialNameMap, type SocialIconName } from "@/components/ui/social-icons";
import { cn } from "@/lib/utils";

export function Footer({ settings, social }: { settings: BusinessSettings; social: SocialLinks }) {
  const links = getConfiguredSocialLinks(social);
  const waLink = whatsappLink(settings, "Hello Auto360 Gh, I'd like to make an enquiry.");

  return (
    <footer className="bg-carbon-950 text-carbon-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo tone="light" />
            <p className="max-w-xs text-sm leading-relaxed text-carbon-400">{settings.description}</p>
            <div className="flex items-center gap-2">
              {links.length === 0 && <span className="text-xs text-carbon-500">Follow us soon</span>}
              {links.map(({ key, url }) => {
                const iconName: SocialIconName = socialNameMap[key] ?? "facebook";
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-carbon-300 transition-all hover:border-race-500 hover:text-race-400"
                  >
                    <SocialIcon name={iconName} />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-2.5">
              {[...NAV_LINKS, { label: "Our Location", href: "/location" }].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-carbon-400 transition-colors hover:text-race-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-race-500" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-race-500" />
                <a href={`tel:${settings.phone}`} className="hover:text-race-400">{settings.phone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-race-500" />
                <a href={`mailto:${settings.email}`} className="hover:text-race-400">{settings.email}</a>
              </li>
              <li>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#25D366] hover:underline">
                  <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Opening Hours</h4>
            <ul className="space-y-2 text-sm">
              {settings.openingHours.map((h) => (
                <li key={h.day} className="flex items-center justify-between gap-3 border-b border-white/5 pb-2">
                  <span className="flex items-center gap-2 text-carbon-400">
                    <Clock className="h-3.5 w-3.5 text-race-500" />
                    {h.day}
                  </span>
                  <span className={cn("font-medium", h.closed ? "text-carbon-500" : "text-carbon-200")}>
                    {h.closed ? "Closed" : `${h.open} – ${h.close}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-carbon-500">© {new Date().getFullYear()} Auto360 Gh. All rights reserved.</p>
          <p className="text-xs text-carbon-500">
            Genuine parts · Premium lubricants · Professional service in {settings.city}, {settings.country}
          </p>
        </div>
      </div>
    </footer>
  );
}