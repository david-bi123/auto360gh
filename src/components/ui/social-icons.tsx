import { cn } from "@/lib/utils";

export type SocialIconName = "facebook" | "instagram" | "twitter" | "youtube" | "tiktok" | "whatsapp";

const paths: Record<SocialIconName, React.ReactNode> = {
  facebook: (
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  ),
  instagram: (
    <>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </>
  ),
  twitter: (
    <path d="M4 4l7.5 9.5L4.4 20h2.8l5.2-5 4.2 5h4.2L13 10.3 19.5 4h-2.8l-4.6 4.5L8.2 4H4z" />
  ),
  youtube: (
    <>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </>
  ),
  tiktok: (
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  ),
  whatsapp: (
    <>
      <path d="M3 21l1.65-4.9A8.5 8.5 0 1 1 8 18.35L3 21z" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1zm5 0a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1z" />
      <path d="M9 13c.8 1.4 2.3 2 4 2s3.2-.6 4-2" />
    </>
  ),
};

export function SocialIcon({
  name,
  className,
  strokeWidth = 2,
}: {
  name: SocialIconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-4 w-4", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export const socialNameMap: Record<string, SocialIconName> = {
  facebook: "facebook",
  instagram: "instagram",
  twitter: "twitter",
  youtube: "youtube",
  tiktok: "tiktok",
  whatsapp: "whatsapp",
};