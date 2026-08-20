import type {
  AuditLog,
  Brand,
  BusinessSettings,
  Category,
  Customer,
  InventoryMovement,
  Notification,
  Order,
  Product,
  Sale,
  Service,
  SocialLinks,
  User,
} from "@/types";
import { getMongoCollection, connectMongo, type ModelName } from "./mongo";
import { getMemoryCollection, type MemoryCollection } from "./memory";
import type { Collection } from "./types";
import { ensureSeeded } from "./seed";

export interface Db {
  users: Collection<User>;
  categories: Collection<Category>;
  brands: Collection<Brand>;
  products: Collection<Product>;
  orders: Collection<Order>;
  customers: Collection<Customer>;
  inventoryMovements: Collection<InventoryMovement>;
  sales: Collection<Sale>;
  services: Collection<Service>;
  businessSettings: Collection<BusinessSettings>;
  socialLinks: Collection<SocialLinks>;
  auditLogs: Collection<AuditLog>;
  notifications: Collection<Notification>;
}

type Backend = "mongo" | "memory";

let cachedDb: Db | null = null;
let cachedBackend: Backend | null = null;
let dbPromise: Promise<Db> | null = null;

export function getDb(): Promise<Db> {
  if (cachedDb) return Promise.resolve(cachedDb);
  if (dbPromise) return dbPromise;
  dbPromise = initDb();
  return dbPromise;
}

async function initDb(): Promise<Db> {

  const uri = process.env.MONGODB_URI;
  let backend: Backend = "memory";

  if (uri) {
    try {
      await connectMongo(uri);
      backend = "mongo";
    } catch (err) {
      console.warn(
        `[auto360] MongoDB connection failed (${(err as Error).message}). Falling back to the in-memory demo store.`
      );
      backend = "memory";
    }
  }

  const names: ModelName[] = [
    "User",
    "Category",
    "Brand",
    "Product",
    "Order",
    "Customer",
    "InventoryMovement",
    "Sale",
    "Service",
    "BusinessSettings",
    "SocialLinks",
    "AuditLog",
    "Notification",
    "Cart",
    "Wishlist",
  ];

  const db: Db = {
    users: backend === "mongo" ? getMongoCollection<User>("User") : getMemoryCollection<User>("User"),
    categories: backend === "mongo" ? getMongoCollection<Category>("Category") : getMemoryCollection<Category>("Category"),
    brands: backend === "mongo" ? getMongoCollection<Brand>("Brand") : getMemoryCollection<Brand>("Brand"),
    products: backend === "mongo" ? getMongoCollection<Product>("Product") : getMemoryCollection<Product>("Product"),
    orders: backend === "mongo" ? getMongoCollection<Order>("Order") : getMemoryCollection<Order>("Order"),
    customers: backend === "mongo" ? getMongoCollection<Customer>("Customer") : getMemoryCollection<Customer>("Customer"),
    inventoryMovements:
      backend === "mongo"
        ? getMongoCollection<InventoryMovement>("InventoryMovement")
        : getMemoryCollection<InventoryMovement>("InventoryMovement"),
    sales: backend === "mongo" ? getMongoCollection<Sale>("Sale") : getMemoryCollection<Sale>("Sale"),
    services: backend === "mongo" ? getMongoCollection<Service>("Service") : getMemoryCollection<Service>("Service"),
    businessSettings:
      backend === "mongo"
        ? getMongoCollection<BusinessSettings>("BusinessSettings")
        : getMemoryCollection<BusinessSettings>("BusinessSettings"),
    socialLinks:
      backend === "mongo" ? getMongoCollection<SocialLinks>("SocialLinks") : getMemoryCollection<SocialLinks>("SocialLinks"),
    auditLogs: backend === "mongo" ? getMongoCollection<AuditLog>("AuditLog") : getMemoryCollection<AuditLog>("AuditLog"),
    notifications:
      backend === "mongo"
        ? getMongoCollection<Notification>("Notification")
        : getMemoryCollection<Notification>("Notification"),
  };

  cachedDb = db;
  cachedBackend = backend;
  dbPromise = null;

  if (process.env.SEED_DEMO_DATA !== "false") {
    await ensureSeeded(db, backend);
  }

  return db;
}

export function resetDbCache() {
  cachedDb = null;
  cachedBackend = null;
  dbPromise = null;
}

export function getBackend(): Backend | null {
  return cachedBackend;
}

export function isMemoryBackend(): boolean {
  return cachedBackend === "memory";
}

export type { MemoryCollection };