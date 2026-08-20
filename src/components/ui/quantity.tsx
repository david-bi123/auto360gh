"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  const dims = size === "sm" ? "h-9" : "h-11";
  const btn = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  return (
    <div className={cn("inline-flex items-center overflow-hidden rounded-xl border border-carbon-200 bg-white", className)}>
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        className={cn("flex items-center justify-center text-carbon-500 transition-colors hover:bg-carbon-50 hover:text-carbon-900 disabled:opacity-40", btn)}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <div className={cn("flex items-center justify-center border-x border-carbon-100 px-2 text-sm font-semibold text-carbon-900 tabular-nums", dims)}>
        {value}
      </div>
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        className={cn("flex items-center justify-center text-carbon-500 transition-colors hover:bg-carbon-50 hover:text-carbon-900 disabled:opacity-40", btn)}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export function StarRating({ rating, reviewCount, size = "sm" }: { rating: number; reviewCount?: number; size?: "sm" | "md" }) {
  const starSize = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = rating >= i - 0.25;
          const half = rating >= i - 0.75 && rating < i - 0.25;
          return (
            <span key={i} className={cn("relative", starSize)}>
              <svg viewBox="0 0 20 20" className={cn("h-full w-full text-carbon-200")} fill="currentColor">
                <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
              </svg>
              {(half || filled) && (
                <svg
                  viewBox="0 0 20 20"
                  className={cn("absolute inset-0 h-full w-full text-amber-400")}
                  fill="currentColor"
                  style={half ? { clipPath: "inset(0 50% 0 0)" } : undefined}
                >
                  <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                </svg>
              )}
            </span>
          );
        })}
      </div>
      {reviewCount !== undefined && <span className="text-xs text-carbon-400">({reviewCount})</span>}
    </div>
  );
}