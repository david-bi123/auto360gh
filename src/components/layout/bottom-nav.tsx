"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Package, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartCount } from "@/store/cart";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/account", label: "Account", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const cartCount = useCartCount();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-carbon-200 bg-white/95 backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
                active ? "text-race-500" : "text-carbon-500"
              )}
            >
              <span className="relative">
                <Icon className={cn("h-5 w-5", active && "stroke-[2.4]")} />
                {item.href === "/cart" && cartCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-race-500 px-1 text-[9px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}