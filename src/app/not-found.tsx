import Link from "next/link";
import { SearchX } from "lucide-react";
import { getSettings, whatsappLink } from "@/lib/services/settings";

export const metadata = { title: "Page not found — Auto360 Gh" };

export default async function NotFound() {
  const settings = await getSettings();
  const wa = whatsappLink(settings, "Hello Auto360 Gh, I couldn't find a page on your website.");
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-carbon-100 text-carbon-500">
        <SearchX className="h-8 w-8" />
      </span>
      <p className="mt-5 text-6xl font-extrabold tracking-tight text-carbon-900">404</p>
      <h1 className="mt-2 font-display text-xl font-extrabold text-carbon-900">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-carbon-500">
        The page you are looking for doesn't exist or has moved. Browse our shop or reach out and we'll help you find it.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="inline-flex h-11 items-center rounded-xl bg-carbon-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-carbon-800">
          Back to home
        </Link>
        <Link href="/shop" className="inline-flex h-11 items-center rounded-xl bg-race-500 px-6 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-race-600">
          Browse shop
        </Link>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center rounded-xl bg-[#25D366] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1fb959]">
          WhatsApp us
        </a>
      </div>
    </div>
  );
}