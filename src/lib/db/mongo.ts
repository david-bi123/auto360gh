import mongoose, { type Model, type SchemaDefinition } from "mongoose";
import { randomUUID } from "crypto";
import type { Collection, Doc, FindOptions, Query } from "./types";

const idDef = {
  type: String,
  default: () => randomUUID(),
} as const;

const schemaDefs = {
  User: {
    _id: idDef,
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: String,
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, default: "customer", index: true },
    avatar: String,
    active: { type: Boolean, default: true },
  },
  Category: {
    _id: idDef,
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    image: String,
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  Brand: {
    _id: idDef,
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    logo: String,
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  Product: {
    _id: idDef,
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sku: { type: String, required: true, unique: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    brandId: String,
    categoryId: String,
    description: { type: String, required: true },
    shortDescription: String,
    price: { type: Number, required: true },
    costPrice: { type: Number, default: 0 },
    compareAtPrice: Number,
    stock: { type: Number, default: 0, index: true },
    reorderLevel: { type: Number, default: 10 },
    images: { type: [String], default: [] },
    imagePublicIds: { type: [String], default: [] },
    specifications: { type: [{ label: String, value: String }], default: [] },
    vehicleCompatibility: {
      type: [
        {
          make: String,
          model: String,
          yearFrom: Number,
          yearTo: Number,
          engine: String,
        },
      ],
      default: [],
    },
    usageInstructions: String,
    featured: { type: Boolean, default: false, index: true },
    bestseller: { type: Boolean, default: false, index: true },
    onSale: { type: Boolean, default: false },
    active: { type: Boolean, default: true, index: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  Order: {
    _id: idDef,
    orderNumber: { type: String, required: true, unique: true },
    customerId: String,
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: String,
    email: String,
    items: { type: [{ productId: String, productName: String, sku: String, unitPrice: Number, quantity: Number, lineTotal: Number, image: String }], default: [] },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    orderMethod: { type: String, enum: ["delivery", "pickup"], default: "pickup" },
    deliveryAddress: String,
    city: String,
    notes: String,
    paymentMethod: { type: String, default: "cash" },
    paymentStatus: { type: String, default: "pending" },
    status: { type: String, default: "pending", index: true },
    timeline: {
      type: [{ status: String, at: { type: Date, default: Date.now }, note: String }],
      default: [],
    },
  },
  Customer: {
    _id: idDef,
    userId: String,
    name: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: String,
    email: String,
    address: String,
    city: String,
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
  },
  InventoryMovement: {
    _id: idDef,
    productId: { type: String, required: true, index: true },
    productName: { type: String, required: true },
    sku: String,
    type: { type: String, required: true, index: true },
    quantity: { type: Number, required: true },
    before: Number,
    after: Number,
    reason: String,
    reference: String,
    performedBy: String,
  },
  Sale: {
    _id: idDef,
    receiptNumber: { type: String, required: true, unique: true },
    items: { type: [{ productId: String, productName: String, sku: String, unitPrice: Number, quantity: Number, lineTotal: Number }], default: [] },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    amountPaid: { type: Number, required: true },
    change: { type: Number, default: 0 },
    paymentMethod: { type: String, required: true },
    paymentMethodLabel: String,
    cashierName: { type: String, required: true },
    customerName: String,
    notes: String,
  },
  Service: {
    _id: idDef,
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    icon: String,
    shortName: String,
    description: { type: String, required: true },
    longDescription: String,
    image: String,
    price: Number,
    features: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  BusinessSettings: {
    _id: idDef,
    name: { type: String, required: true },
    logo: String,
    heroImage: String,
    tagline: String,
    description: String,
    phone: String,
    whatsapp: String,
    email: String,
    address: String,
    plusCode: String,
    city: String,
    country: String,
    mapsUrl: String,
    mapsEmbedUrl: String,
    openingHours: { type: [{ day: String, open: String, close: String, closed: Boolean }], default: [] },
    announcement: String,
    announcementEnabled: { type: Boolean, default: false },
    footerText: String,
    deliveryInfo: String,
    featuredBrandName: String,
    featuredBrandDescription: String,
    featuredBrandImage: String,
    currency: { type: String, default: "GH₵" },
    taxRate: { type: Number, default: 0 },
  },
  SocialLinks: {
    _id: idDef,
    facebook: String,
    instagram: String,
    tiktok: String,
    twitter: String,
    youtube: String,
    whatsapp: String,
  },
  AuditLog: {
    _id: idDef,
    actor: String,
    action: { type: String, required: true },
    entity: String,
    entityId: String,
    metadata: { type: Object, default: {} },
  },
  Notification: {
    _id: idDef,
    type: String,
    title: { type: String, required: true },
    message: String,
    read: { type: Boolean, default: false },
    link: String,
  },
  Cart: {
    _id: idDef,
    userId: String,
    items: { type: [{ productId: String, quantity: Number }], default: [] },
  },
  Wishlist: {
    _id: idDef,
    userId: String,
    productIds: { type: [String], default: [] },
  },
} satisfies Record<string, SchemaDefinition>;

export type ModelName = keyof typeof schemaDefs;

const models = new Map<ModelName, Model<any>>();

function addIndexes(name: ModelName, schema: mongoose.Schema) {
  switch (name) {
    case "User":
      schema.index({ email: 1 }, { unique: true });
      break;
    case "Category":
      schema.index({ featured: 1, sortOrder: 1 });
      break;
    case "Brand":
      schema.index({ featured: 1, sortOrder: 1 });
      break;
    case "Product":
      schema.index({ active: 1, category: 1, featured: -1, createdAt: -1 });
      schema.index({ active: 1, brand: 1, featured: -1, createdAt: -1 });
      schema.index({ active: 1, price: 1 });
      schema.index({ active: 1, createdAt: -1 });
      schema.index({ active: 1, name: 1 });
      schema.index({ active: 1, onSale: -1, createdAt: -1 });
      schema.index({ active: 1, stock: 1 });
      break;
    case "Order":
      schema.index({ status: 1, createdAt: -1 });
      schema.index({ email: 1, createdAt: -1 });
      schema.index({ phone: 1, createdAt: -1 });
      schema.index({ createdAt: -1 });
      break;
    case "Sale":
      schema.index({ createdAt: -1 });
      schema.index({ paymentMethod: 1, createdAt: -1 });
      break;
    case "Customer":
      schema.index({ phone: 1 });
      schema.index({ email: 1 });
      break;
    case "InventoryMovement":
      schema.index({ productId: 1, createdAt: -1 });
      schema.index({ type: 1, createdAt: -1 });
      break;
    case "Service":
      schema.index({ active: 1, sortOrder: 1 });
      break;
    case "Notification":
      schema.index({ read: 1, createdAt: -1 });
      schema.index({ createdAt: -1 });
      break;
  }
}

function getModel<T>(name: ModelName): Model<T> {
  if (!models.has(name)) {
    const schema = new mongoose.Schema(schemaDefs[name] as SchemaDefinition, { timestamps: true });
    addIndexes(name, schema);
    models.set(name, mongoose.models[name] ?? mongoose.model(name, schema));
  }
  return models.get(name) as Model<T>;
}

export async function connectMongo(uri: string): Promise<void> {
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) return;
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
}

export function isMongoConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

function toQuery(query: Query): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(query)) {
    if (Array.isArray(v)) {
      out[k] = v.map((item) => (item && typeof item === "object" && !(item instanceof Date) ? toQuery(item as Query) : item));
    } else if (v instanceof RegExp) {
      out[k] = v;
    } else if (v && typeof v === "object" && !(v instanceof Date)) {
      const op = v as Record<string, unknown>;
      const mapped: Record<string, unknown> = {};
      for (const [ok, ov] of Object.entries(op)) {
        mapped[ok] = ov;
      }
      if (mapped.$regex) {
        mapped.$regex = new RegExp(mapped.$regex as string, (mapped.$options as string) || "i");
        delete mapped.$options;
      }
      out[k] = mapped;
    } else {
      out[k] = v;
    }
  }
  return out;
}

class MongoCollection<T extends Doc> implements Collection<T> {
  readonly name: string;
  private model: Model<T>;

  constructor(name: ModelName) {
    this.name = name;
    this.model = getModel<T>(name);
  }

  private toDoc(d: unknown): T {
    const doc = d as Record<string, unknown>;
    if (doc && typeof doc === "object" && "_id" in doc) {
      const id = (doc._id as { toString?: () => string }).toString?.() ?? doc._id;
      return { ...doc, _id: id as string } as unknown as T;
    }
    return d as T;
  }

  async find(query: Query = {}, opts: FindOptions = {}): Promise<T[]> {
    let q = this.model.find(toQuery(query));
    if (opts.sort) q = q.sort(opts.sort as Record<string, 1 | -1>);
    if (opts.skip) q = q.skip(opts.skip);
    if (opts.limit) q = q.limit(opts.limit);
    const docs = await q.lean();
    return docs.map((d) => this.toDoc(d));
  }

  async findOne(query: Query): Promise<T | null> {
    const d = await this.model.findOne(toQuery(query)).lean();
    return d ? this.toDoc(d) : null;
  }

  async findById(id: string): Promise<T | null> {
    const d = await this.model.findById(id).lean();
    return d ? this.toDoc(d) : null;
  }

  async insertOne(doc: (Omit<T, "_id"> & { _id?: string }) | T): Promise<T> {
    const d = new this.model({ ...doc, _id: (doc as { _id?: string })._id || randomUUID() });
    await d.save();
    return this.toDoc(d.toObject());
  }

  async insertMany(docs: (Omit<T, "_id"> & { _id?: string })[]): Promise<T[]> {
    const inserted: T[] = [];
    for (const d of docs) inserted.push(await this.insertOne(d));
    return inserted;
  }

  async updateOne(query: Query, update: Partial<T>): Promise<T | null> {
    const d = await this.model.findOneAndUpdate(toQuery(query), { $set: update }, { new: true }).lean();
    return d ? this.toDoc(d) : null;
  }

  async updateById(id: string, update: Partial<T>): Promise<T | null> {
    return this.updateOne({ _id: id } as Query, update);
  }

  async deleteOne(query: Query): Promise<boolean> {
    const r = await this.model.deleteOne(toQuery(query));
    return r.deletedCount > 0;
  }

  async deleteById(id: string): Promise<boolean> {
    return this.deleteOne({ _id: id } as Query);
  }

  async count(query: Query = {}): Promise<number> {
    return this.model.countDocuments(toQuery(query));
  }

  async exists(query: Query): Promise<boolean> {
    return (await this.model.exists(toQuery(query))) !== null;
  }

  async distinct(field: string, query: Query = {}): Promise<string[]> {
    return this.model.distinct(field, toQuery(query)) as unknown as Promise<string[]>;
  }
}

export const mongoCollections: Partial<Record<ModelName, MongoCollection<any>>> = {};

export function getMongoCollection<T extends Doc>(name: ModelName): MongoCollection<T> {
  if (!mongoCollections[name]) {
    mongoCollections[name] = new MongoCollection<T>(name);
  }
  return mongoCollections[name] as MongoCollection<T>;
}