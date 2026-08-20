import { cn } from "@/lib/utils";

const BRAND_LOGO = "/logo.png";

export function LogoMark({
  className,
  tone = "dark",
  src = BRAND_LOGO,
}: {
  className?: string;
  tone?: "dark" | "light";
  src?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white",
        tone === "dark" ? "shadow-card ring-1 ring-carbon-100" : "shadow-lg ring-1 ring-white/15",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="Auto360 Gh logo" className="h-full w-full object-contain p-1" />
    </div>
  );
}

export function Logo({
  className,
  name = "Auto360",
  tone = "dark",
  compact = false,
  src,
}: {
  className?: string;
  name?: string;
  tone?: "dark" | "light";
  compact?: boolean;
  src?: string;
}) {
  const textTone = tone === "dark" ? "text-carbon-900" : "text-white";
  const subTone = tone === "dark" ? "text-carbon-400" : "text-white/60";
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark tone={tone} src={src} />
      <div className="flex flex-col leading-none">
        <span className={cn("font-display text-lg font-extrabold uppercase tracking-tight", textTone)}>
          Auto<span className="text-race-500">360</span>
        </span>
        {!compact && (
          <span className={cn("text-[10px] font-semibold uppercase tracking-[0.28em]", subTone)}>Gh · Accra</span>
        )}
      </div>
    </div>
  );
}