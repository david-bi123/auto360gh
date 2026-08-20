"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingCart, X, MessageCircle, ChevronRight, PackageSearch, User } from "lucide-react";
import type { BusinessSettings, Product } from "@/types";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/config/constants";
import { useCartCount } from "@/store/cart";
import { Logo } from "./logo";
import { ProductImage } from "@/components/ui/product-image";
import { formatGH } from "@/lib/utils";
import { Skeleton } from "@/components/ui/card";

export function Navbar({ settings }: { settings: BusinessSettings }) {
  const pathname = usePathname();
  const router = useRouter();
  const cartCount = useCartCount();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 60);
  }, [searchOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(query.trim())}&limit=6`);
        const data = await res.json();
        setResults(data.items ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 260);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const whatsappHref = `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
    "Hello Auto360 Gh, I'd like to make an enquiry."
  )}`;

  return (
    <>
      {settings.announcementEnabled && settings.announcement && (
        <div className="bg-carbon-950 px-4 py-2 text-center">
          <p className="text-xs font-medium tracking-wide text-white/85">{settings.announcement}</p>
        </div>
      )}

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled ? "bg-white/85 shadow-card backdrop-blur-xl" : "bg-white/70 backdrop-blur-md"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg text-carbon-700 transition-colors hover:bg-carbon-100 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" aria-label="Auto360 Gh home">
              <Logo />
            </Link>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  pathname === link.href ? "bg-carbon-100 text-carbon-900" : "text-carbon-600 hover:bg-carbon-100/70 hover:text-carbon-900"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-carbon-700 transition-colors hover:bg-carbon-100"
              aria-label="Search products"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-[#128C4A] transition-colors hover:bg-[#25D366]/10 md:flex"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden xl:inline">WhatsApp</span>
            </Link>
            <Link
              href="/account"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-carbon-700 transition-colors hover:bg-carbon-100"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-carbon-700 transition-colors hover:bg-carbon-100"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-race-500 px-1 text-[10px] font-bold text-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-carbon-950/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-white shadow-raised"
            >
              <div className="flex items-center justify-between border-b border-carbon-100 p-4">
                <Logo />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-carbon-100 text-carbon-600"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium transition-colors",
                      pathname === link.href ? "bg-race-50 text-race-600" : "text-carbon-800 hover:bg-carbon-50"
                    )}
                  >
                    {link.label}
                    <ChevronRight className="h-4 w-4 text-carbon-300" />
                  </Link>
                ))}
              </nav>
              <div className="border-t border-carbon-100 p-4">
                <Link
                  href="/account"
                  className="mb-2 flex h-11 items-center justify-center gap-2 rounded-xl border border-carbon-200 text-sm font-semibold text-carbon-800 transition-colors hover:bg-carbon-50"
                >
                  <User className="h-4 w-4" /> Account / Login
                </Link>
                <Link
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-semibold text-white"
                >
                  <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-start justify-center bg-carbon-950/50 p-4 pt-20 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -16, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 340 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-raised"
            >
              <div className="flex items-center gap-3 border-b border-carbon-100 px-4">
                <Search className="h-5 w-5 text-carbon-400" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && query.trim()) {
                      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
                      setSearchOpen(false);
                    }
                  }}
                  placeholder="Search engine oils, additives, parts…"
                  className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-carbon-400"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-carbon-400 hover:bg-carbon-100"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {loading && (
                  <div className="space-y-2 p-2">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
                  </div>
                )}
                {!loading && results === null && query.trim() === "" && (
                  <div className="flex items-center gap-3 p-4 text-sm text-carbon-400">
                    <PackageSearch className="h-5 w-5" /> Type to search the Auto360 Gh catalogue.
                  </div>
                )}
                {!loading && results && results.length === 0 && (
                  <div className="p-4 text-sm text-carbon-500">No products found for “{query}”.</div>
                )}
                {!loading && results && results.length > 0 && (
                  <>
                    {results.map((p) => (
                      <button
                        key={p._id}
                        onClick={() => {
                          router.push(`/shop/${p.slug}`);
                          setSearchOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-carbon-50"
                      >
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                          <ProductImage src={p.images[0]} alt={p.name} productName={p.name} brand={p.brand} fill />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-carbon-900">{p.name}</p>
                          <p className="text-xs text-carbon-400">{p.brand}</p>
                        </div>
                        <span className="shrink-0 text-sm font-semibold text-carbon-900">{formatGH(p.price)}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        router.push(`/shop?q=${encodeURIComponent(query)}`);
                        setSearchOpen(false);
                      }}
                      className="mt-1 w-full rounded-xl bg-carbon-50 py-2.5 text-center text-sm font-medium text-carbon-700 transition-colors hover:bg-carbon-100"
                    >
                      View all results
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}