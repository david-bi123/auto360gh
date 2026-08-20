"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, Boxes, ShoppingCart, Users, ScanLine, ReceiptText, BarChart3,
  Wrench, Store, Share2, Bell, Settings, UserCircle, LogOut, Menu, X, ChevronDown, Flame,
} from "lucide-react";
import type { SessionPayload } from "@/lib/auth/session";
import { ROLE_LABELS } from "@/config/constants";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";

const navSections = [
  {
    title: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/pos", label: "Point of Sale", icon: ScanLine },
      { href: "/admin/sales", label: "Sales", icon: ReceiptText },
    ],
  },
  {
    title: "Catalogue",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/inventory", label: "Inventory", icon: Boxes },
      { href: "/admin/services", label: "Services", icon: Wrench },
    ],
  },
  {
    title: "Commerce",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
      { href: "/admin/customers", label: "Customers", icon: Users },
    ],
  },
  {
    title: "Insights",
    items: [{ href: "/admin/reports", label: "Reports", icon: BarChart3 }],
  },
  {
    title: "Management",
    items: [
      { href: "/admin/settings", label: "Business Profile", icon: Store },
      { href: "/admin/settings/social", label: "Social Media", icon: Share2 },
      { href: "/admin/settings/notifications", label: "Notifications", icon: Bell },
      { href: "/admin/staff", label: "Staff", icon: Users },
    ],
  },
];

export function AdminShell({ user, unreadCount, children }: { user: SessionPayload; unreadCount: number; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/account/login");
    router.refresh();
  };

  const nav = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 px-5">
        <Logo tone="light" />
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-carbon-500">{section.title}</p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href;
                const ItemIcon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      active ? "bg-race-500/15 text-race-400" : "text-carbon-300 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <ItemIcon className={cn("h-[18px] w-[18px]", active ? "text-race-400" : "text-carbon-500")} />
                    <span>{item.label}</span>
                    {item.href === "/admin/settings/notifications" && unreadCount > 0 && (
                      <span className="ml-auto rounded-full bg-race-500 px-2 py-0.5 text-[10px] font-bold text-white">{unreadCount}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/5 p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-carbon-300 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-[18px] w-[18px] text-carbon-500" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-carbon-950 lg:block">{nav}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-carbon-950/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-carbon-950 shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-2 text-carbon-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            {nav}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-carbon-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-carbon-600 hover:bg-carbon-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 rounded-full bg-race-50 px-3 py-1.5 text-xs font-semibold text-race-600">
              <Flame className="h-4 w-4" /> Auto360 Admin
            </div>
          </div>

          <div className="relative flex items-center gap-2">
            <button
              onClick={() => {
                router.push("/admin/settings/notifications");
                router.refresh();
              }}
              className="relative rounded-xl p-2 text-carbon-600 transition-colors hover:bg-carbon-100"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-race-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-carbon-100"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-carbon-900 text-xs font-bold uppercase text-white">
                {user.name.slice(0, 1)}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block max-w-40 truncate text-sm font-semibold text-carbon-900">{user.name}</span>
                <span className="block text-[11px] text-carbon-400">{ROLE_LABELS[user.role] ?? user.role}</span>
              </span>
              <ChevronDown className="h-4 w-4 text-carbon-400" />
            </button>
            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-carbon-200 bg-white py-1 shadow-2xl">
                  <Link href="/admin/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-carbon-700 hover:bg-carbon-50">
                    <UserCircle className="h-4 w-4" /> My profile
                  </Link>
                  <Link href="/" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-carbon-700 hover:bg-carbon-50">
                    <Store className="h-4 w-4" /> View storefront
                  </Link>
                  <div className="my-1 border-t border-carbon-100" />
                  <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}