import type { InventoryMovement, Product, StockStatus } from "@/types";
import { slugify } from "@/lib/utils";
import { getDb } from "@/lib/db";

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price_asc" | "price_desc" | "newest" | "featured" | "bestseller" | "on_sale" | "name";
  featured?: boolean;
  bestseller?: boolean;
  onSale?: boolean;
  inStock?: boolean;
  page?: number;
  perPage?: number;
}

export function stockStatus(product: Pick<Product, "stock" | "reorderLevel">): StockStatus {
  if (product.stock <= 0) return "out_of_stock";
  if (product.stock <= product.reorderLevel) return "low_stock";
  return "in_stock";
}

export async function queryProducts(filters: ProductFilters = {}) {
  const db = await getDb();
  const query: Record<string, unknown> = { active: true };
  const sort: Record<string, 1 | -1> = {};

  if (filters.search) {
    query.$or = [{ name: { $regex: filters.search, $options: "i" } }, { sku: { $regex: filters.search, $options: "i" } }];
  }
  if (filters.category) query.category = filters.category;
  if (filters.brand) query.brand = filters.brand;
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const price: Record<string, number> = {};
    if (filters.minPrice !== undefined) price.$gte = filters.minPrice;
    if (filters.maxPrice !== undefined) price.$lte = filters.maxPrice;
    query.price = price;
  }
  if (filters.featured) query.featured = true;
  if (filters.bestseller) query.bestseller = true;
  if (filters.onSale) query.onSale = true;
  if (filters.inStock) query.stock = { $gt: 0 };

  switch (filters.sort) {
    case "price_asc":
      sort.price = 1;
      break;
    case "price_desc":
      sort.price = -1;
      break;
    case "newest":
      sort.createdAt = -1;
      break;
    case "featured":
      sort.featured = -1;
      sort.createdAt = -1;
      break;
    case "bestseller":
      sort.bestseller = -1;
      sort.createdAt = -1;
      break;
    case "on_sale":
      sort.onSale = -1;
      sort.createdAt = -1;
      break;
    case "name":
      sort.name = 1;
      break;
    default:
      sort.featured = -1;
      sort.createdAt = -1;
  }

  const page = Math.max(1, filters.page ?? 1);
  const perPage = Math.min(48, Math.max(1, filters.perPage ?? 12));

  const [items, total] = await Promise.all([
    db.products.find(query as never, { sort, skip: (page - 1) * perPage, limit: perPage }),
    db.products.count(query as never),
  ]);

  return {
    items,
    total,
    page,
    pages: Math.max(1, Math.ceil(total / perPage)),
    perPage,
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = await getDb();
  return db.products.findOne({ slug, active: true });
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getDb();
  return db.products.findById(id);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const db = await getDb();
  return db.products.find(
    { category: product.category, active: true, _id: { $ne: product._id } } as never,
    { sort: { featured: -1, createdAt: -1 }, limit }
  );
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const db = await getDb();
  return db.products.find({ featured: true, active: true } as never, { sort: { createdAt: -1 }, limit });
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  const db = await getDb();
  return db.products.find({ bestseller: true, active: true } as never, { sort: { rating: -1 }, limit });
}

export async function getOnSaleProducts(limit = 8): Promise<Product[]> {
  const db = await getDb();
  return db.products.find({ onSale: true, active: true } as never, { sort: { createdAt: -1 }, limit });
}

export async function getLowStockProducts(): Promise<Product[]> {
  const db = await getDb();
  const all = await db.products.find({} as never);
  return all.filter((p) => stockStatus(p) === "low_stock" || stockStatus(p) === "out_of_stock");
}

export interface ProductInput {
  name: string;
  sku: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  costPrice: number;
  compareAtPrice?: number;
  stock: number;
  reorderLevel: number;
  images: string[];
  featured: boolean;
  bestseller: boolean;
  active: boolean;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const db = await getDb();
  const existing = await db.products.findOne({ sku: input.sku });
  if (existing) {
    throw new Error("A product with this SKU already exists. Please check the SKU.");
  }
  const now = new Date();
  return db.products.insertOne({
    ...input,
    slug: `${slugify(input.name)}-${Date.now().toString(36).slice(-4)}`,
    shortDescription: input.description.slice(0, 140),
    specifications: [],
    vehicleCompatibility: [],
    onSale: !!input.compareAtPrice && input.compareAtPrice > input.price,
    rating: 0,
    reviewCount: 0,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<Product> {
  const db = await getDb();
  const product = await db.products.findById(id);
  if (!product) throw new Error("Product not found.");
  const patch: Partial<Product> = { ...input, updatedAt: new Date() };
  if (input.compareAtPrice !== undefined) {
    patch.onSale = input.compareAtPrice > (input.price ?? product.price);
  }
  if (input.description !== undefined) patch.shortDescription = input.description.slice(0, 140);
  return (await db.products.updateById(id, patch))!;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await getDb();
  return db.products.deleteById(id);
}

export async function adjustStock(
  productId: string,
  quantity: number,
  type: InventoryMovement["type"],
  opts: { reason?: string; reference?: string; performedBy?: string } = {}
): Promise<Product> {
  const db = await getDb();
  const product = await db.products.findById(productId);
  if (!product) throw new Error("Product not found.");

  const next = product.stock + quantity;
  if (next < 0) {
    throw new Error(`Not enough stock for "${product.name}". Available: ${product.stock}.`);
  }

  const updated = (await db.products.updateById(productId, { stock: next, updatedAt: new Date() }))!;

  await db.inventoryMovements.insertOne({
    productId,
    productName: product.name,
    sku: product.sku,
    type,
    quantity,
    before: product.stock,
    after: next,
    reason: opts.reason,
    reference: opts.reference,
    performedBy: opts.performedBy,
    createdAt: new Date(),
  });

  return updated;
}

export async function getProductBySKU(sku: string): Promise<Product | null> {
  const db = await getDb();
  return db.products.findOne({ sku: { $regex: sku, $options: "i" } } as never);
}