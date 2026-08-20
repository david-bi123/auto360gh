import type { BusinessSettings, SocialLinks } from "@/types";
import { getDb, getBackend } from "@/lib/db";
import { ensureSeeded } from "@/lib/db/seed";
import { seedBusinessSettings, seedSocialLinks } from "@/lib/db/seed-data";

let settingsCache: BusinessSettings | null = null;
let socialCache: SocialLinks | null = null;

function defaultSettings(): BusinessSettings {
  return {
    ...(seedBusinessSettings as BusinessSettings),
    _id: "settings-default",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function defaultSocial(): SocialLinks {
  return { ...seedSocialLinks, _id: "social-default", updatedAt: new Date() };
}

async function ensureAvailable<T extends { _id: string }>(
  load: (db: Awaited<ReturnType<typeof getDb>>) => Promise<T | null>
): Promise<T | null> {
  const db = await getDb();
  const found = await load(db);
  if (found) return found;
  try {
    await ensureSeeded(db, getBackend() ?? "memory");
  } catch {
    /* ignore seed errors — fall through to defaults below */
  }
  return load(db);
}

export async function getSettings(): Promise<BusinessSettings> {
  if (settingsCache) return settingsCache;
  const settings = await ensureAvailable((db) => db.businessSettings.findOne({}));
  settingsCache = settings ?? defaultSettings();
  return settingsCache;
}

export async function updateSettings(patch: Partial<BusinessSettings>): Promise<BusinessSettings> {
  const db = await getDb();
  const settings = await getSettings();
  const updated = (await db.businessSettings.updateById(settings._id, { ...patch, updatedAt: new Date() }))!;
  settingsCache = updated;
  return updated;
}

export async function getSocialLinks(): Promise<SocialLinks> {
  if (socialCache) return socialCache;
  const links = await ensureAvailable((db) => db.socialLinks.findOne({}));
  socialCache = links ?? defaultSocial();
  return socialCache;
}

export async function updateSocialLinks(patch: Partial<SocialLinks>): Promise<SocialLinks> {
  const db = await getDb();
  const links = await getSocialLinks();
  const updated = (await db.socialLinks.updateById(links._id, { ...patch, updatedAt: new Date() }))!;
  socialCache = updated;
  return updated;
}

export function resetSettingsCache() {
  settingsCache = null;
  socialCache = null;
}

export function whatsappNumber(settings: BusinessSettings): string {
  const digits = (settings.whatsapp || settings.phone || "").replace(/[^\d]/g, "").replace(/^0+/, "");
  return digits || "233598954177";
}

export function whatsappLink(settings: BusinessSettings, text: string): string {
  const num = whatsappNumber(settings);
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}

export function getConfiguredSocialLinks(links: SocialLinks): { key: string; url: string }[] {
  return Object.entries(links)
    .filter(([key, value]) => key !== "_id" && key !== "updatedAt" && typeof value === "string" && value.trim() !== "")
    .map(([key, value]) => ({ key, url: value as string }));
}