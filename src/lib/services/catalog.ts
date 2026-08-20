import type { Brand, Category } from "@/types";
import { getDb } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function getCategories(): Promise<Category[]> {
  const db = await getDb();
  return db.categories.find({} as never, { sort: { sortOrder: 1, name: 1 } });
}

export async function getFeaturedCategories(): Promise<Category[]> {
  const db = await getDb();
  return db.categories.find({ featured: true } as never, { sort: { sortOrder: 1 } });
}

export async function getBrands(): Promise<Brand[]> {
  const db = await getDb();
  return db.brands.find({} as never, { sort: { sortOrder: 1, name: 1 } });
}

export async function getFeaturedBrand(): Promise<Brand | null> {
  const db = await getDb();
  return db.brands.findOne({ featured: true });
}

export async function createCategory(name: string, description?: string): Promise<Category> {
  const db = await getDb();
  const slug = slugify(name);
  const existing = await db.categories.findOne({ slug });
  if (existing) throw new Error("A category with this name already exists.");
  return db.categories.insertOne({ name, slug, description, featured: false, sortOrder: 999, createdAt: new Date() });
}

export async function updateCategory(id: string, patch: Partial<Category>): Promise<Category> {
  const db = await getDb();
  return (await db.categories.updateById(id, { ...patch }))!;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const db = await getDb();
  const used = await db.products.count({ categoryId: id } as never);
  if (used > 0) throw new Error("This category is in use by products and cannot be deleted.");
  return db.categories.deleteById(id);
}

export async function createBrand(name: string, description?: string): Promise<Brand> {
  const db = await getDb();
  const slug = slugify(name);
  const existing = await db.brands.findOne({ slug });
  if (existing) throw new Error("A brand with this name already exists.");
  return db.brands.insertOne({ name, slug, description, featured: false, sortOrder: 999, createdAt: new Date() });
}

export async function updateBrand(id: string, patch: Partial<Brand>): Promise<Brand> {
  const db = await getDb();
  return (await db.brands.updateById(id, { ...patch }))!;
}

export async function deleteBrand(id: string): Promise<boolean> {
  const db = await getDb();
  const used = await db.products.count({ brandId: id } as never);
  if (used > 0) throw new Error("This brand is in use by products and cannot be deleted.");
  return db.brands.deleteById(id);
}

export async function categoryCounts() {
  const db = await getDb();
  const categories = await getCategories();
  const counts: Record<string, number> = {};
  for (const c of categories) {
    counts[c.name] = await db.products.count({ category: c.name, active: true } as never);
  }
  return counts;
}