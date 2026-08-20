export type Role = "super_admin" | "admin" | "manager" | "cashier" | "staff" | "customer";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: Role;
  avatar?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SafeUser = {
  _id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatar?: string;
};

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  featured?: boolean;
  sortOrder: number;
  createdAt: Date;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  featured?: boolean;
  sortOrder: number;
  createdAt: Date;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface VehicleCompatibility {
  make: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  engine?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  brandId?: string;
  categoryId?: string;
  description: string;
  shortDescription?: string;
  price: number;
  costPrice: number;
  compareAtPrice?: number;
  stock: number;
  reorderLevel: number;
  images: string[];
  imagePublicIds?: string[];
  specifications: ProductSpecification[];
  vehicleCompatibility: VehicleCompatibility[];
  usageInstructions?: string;
  featured: boolean;
  bestseller: boolean;
  onSale: boolean;
  active: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItemInput {
  productId: string;
  quantity: number;
}

export interface OrderItem {
  productId?: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  image?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "ready"
  | "out_for_delivery"
  | "completed"
  | "cancelled"
  | "refunded";

export interface OrderTimelineEvent {
  status: OrderStatus;
  at: Date;
  note?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  orderMethod: "delivery" | "pickup";
  deliveryAddress?: string;
  city?: string;
  notes?: string;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "refunded";
  status: OrderStatus;
  timeline: OrderTimelineEvent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  _id: string;
  userId?: string;
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  city?: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryMovement {
  _id: string;
  productId: string;
  productName: string;
  sku: string;
  type: "stock_added" | "stock_removed" | "sale" | "pos_sale" | "order" | "manual_adjustment" | "return" | "damaged";
  quantity: number;
  before: number;
  after: number;
  reason?: string;
  reference?: string;
  performedBy?: string;
  createdAt: Date;
}

export interface SaleItem {
  productId?: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export type PaymentMethod = "cash" | "mobile_money" | "bank_transfer" | "card" | "other";

export interface Sale {
  _id: string;
  receiptNumber: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  amountPaid: number;
  change: number;
  paymentMethod: PaymentMethod;
  paymentMethodLabel: string;
  cashierName: string;
  customerName?: string;
  notes?: string;
  createdAt: Date;
}

export interface Service {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  shortName?: string;
  description: string;
  longDescription?: string;
  image?: string;
  price?: number;
  features: string[];
  featured: boolean;
  active?: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface OpeningHour {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

export interface BusinessSettings {
  _id: string;
  name: string;
  logo?: string;
  heroImage?: string;
  tagline: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  plusCode: string;
  city: string;
  country: string;
  mapsUrl: string;
  mapsEmbedUrl?: string;
  openingHours: OpeningHour[];
  announcement: string;
  announcementEnabled: boolean;
  footerText: string;
  deliveryInfo: string;
  featuredBrandName: string;
  featuredBrandDescription: string;
  featuredBrandImage?: string;
  currency: string;
  taxRate: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialLinks {
  _id: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  youtube?: string;
  whatsapp?: string;
  updatedAt: Date;
}

export interface CartItem extends OrderItem {
  productId: string;
  brand?: string;
  slug: string;
  inStock: boolean;
}

export interface AuditLog {
  _id: string;
  actor?: string;
  action: string;
  entity?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface Notification {
  _id: string;
  type: "order" | "stock" | "sale" | "system" | "customer";
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: Date;
}

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
  perPage: number;
}
