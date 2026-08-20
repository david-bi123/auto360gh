"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, User, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/account", label: "Overview", icon: LayoutDashboard },
  { href: "/account/orders", label: "My Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/profile", label: "Profile", icon: User },
];

export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav className="h-fit space-y-1 rounded-2xl border border-carbon-200 bg-white p-3 shadow-card lg:sticky lg:top-20">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-race-50 text-race-600" : "text-carbon-600 hover:bg-carbon-50 hover:text-carbon-900"
            )}
          >
            <tab.icon className="h-4 w-4" /> {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}