import Image from "next/image";
import { cn } from "@/lib/utils";

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function PlaceholderArt({ productName, brand }: { productName: string; brand: string }) {
  const seed = hashString(productName || brand || "auto360");
  const hueShift = seed % 5;
  const gradients = [
    "from-[#141a20] via-[#1d252d] to-[#2a333d]",
    "from-[#0e1216] via-[#1a2129] to-[#26303a]",
    "from-[#13181f] via-[#202832] to-[#2c3743]",
    "from-[#101418] via-[#1c232b] to-[#333d47]",
    "from-[#141b22] via-[#232c36] to-[#3a4550]",
  ];
  const accent = seed % 3 === 0 ? "text-race-500" : "text-race-400";
  const initials = (brand || "A")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={cn("relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br", gradients[hueShift])}>
      <div className="absolute inset-0 bg-grid-dark opacity-60" />
      <div className={cn("absolute -right-10 -top-10 h-44 w-44 rounded-full blur-3xl", accent, "opacity-[0.13] bg-current")} />
      <div className="absolute -bottom-14 -left-14 h-44 w-44 rounded-full bg-race-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-inner-line">
          <svg viewBox="0 0 48 48" className={cn("h-11 w-11", accent)} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 30a7 7 0 1 1 6.9-6h8.2a7 7 0 1 1 6.9 6H13z" />
            <path d="M15.5 30l-3-8a2 2 0 0 1 1.9-2.7h4.4M32.5 30l3-8a2 2 0 0 0-1.9-2.7h-4.4" />
            <path d="M9 24h2.5M36.5 24H39" />
            <path d="M13 27h22" strokeWidth="1.4" opacity="0.6" />
          </svg>
        </div>
        <div>
          <p className={cn("font-display text-[10px] font-bold uppercase tracking-[0.3em]", accent)}>{initials || "AUTO360"}</p>
          <p className="mt-1 max-w-[200px] text-xs font-medium leading-snug text-white/80 line-clamp-2">{productName}</p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.25em] text-white/30">
        <span>Auto360 Gh</span>
        <span className="h-0.5 w-0.5 rounded-full bg-race-500" />
        <span>Accra</span>
      </div>
    </div>
  );
}

export function ProductImage({
  src,
  alt,
  productName,
  brand,
  fill,
  width,
  height,
  className,
  sizes,
  priority,
}: {
  src?: string;
  alt: string;
  productName?: string;
  brand?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }
  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <PlaceholderArt productName={productName ?? alt} brand={brand ?? "Auto360 Gh"} />
    </div>
  );
}