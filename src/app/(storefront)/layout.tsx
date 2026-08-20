import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { BottomNav } from "@/components/layout/bottom-nav";
import { getSettings, getSocialLinks } from "@/lib/services/settings";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const [settings, social] = await Promise.all([getSettings(), getSocialLinks()]);

  return (
    <div className="flex min-h-screen flex-col pb-16 lg:pb-0">
      <Navbar settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} social={social} />
      <WhatsAppFloat settings={settings} />
      <BottomNav />
    </div>
  );
}