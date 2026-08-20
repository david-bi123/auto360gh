import type { Service } from "@/types";
import { getDb } from "@/lib/db";

export async function getServices(): Promise<Service[]> {
  const db = await getDb();
  return db.services.find({} as never, { sort: { sortOrder: 1 } });
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const db = await getDb();
  return db.services.findOne({ slug });
}