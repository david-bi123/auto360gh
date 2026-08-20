"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Tabs({
  tabs,
  defaultValue,
  className,
}: {
  tabs: { value: string; label: ReactNode; content: ReactNode }[];
  defaultValue: string;
  className?: string;
}) {
  const [active, setActive] = useState(defaultValue);
  return (
    <div className={className}>
      <div className="flex gap-1 overflow-x-auto no-scrollbar border-b border-carbon-200">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setActive(t.value)}
            className={cn(
              "relative shrink-0 px-4 py-2.5 text-sm font-medium transition-colors",
              active === t.value ? "text-carbon-900" : "text-carbon-500 hover:text-carbon-800"
            )}
          >
            {t.label}
            {active === t.value && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-race-500" />
            )}
          </button>
        ))}
      </div>
      <div className="pt-5">{tabs.find((t) => t.value === active)?.content}</div>
    </div>
  );
}