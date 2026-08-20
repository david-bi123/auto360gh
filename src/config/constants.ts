import type { OrderStatus, PaymentMethod, Role } from "@/types";

export const BUSINESS_PHONE = "+233598954177";
export const BUSINESS_WHATSAPP = "233598954177";
export const BUSINESS_ADDRESS = "103 Hallelujah Broadway, Accra";
export const BUSINESS_PLUS_CODE = "MRQ9+W7 Accra";
export const BUSINESS_EMAIL = "hello@auto360gh.com";

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  manager: "Manager",
  cashier: "Cashier",
  staff: "Staff",
  customer: "Customer",
};

export const ROLE_HIERARCHY: Role[] = ["super_admin", "admin", "manager", "cashier", "staff", "customer"];

export const ORDER_STATUS_META: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "amber" },
  confirmed: { label: "Confirmed", color: "sky" },
  processing: { label: "Processing", color: "indigo" },
  ready: { label: "Ready for Pickup", color: "violet" },
  out_for_delivery: { label: "Out for Delivery", color: "cyan" },
  completed: { label: "Completed", color: "mint" },
  cancelled: { label: "Cancelled", color: "slate" },
  refunded: { label: "Refunded", color: "rose" },
};

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "ready",
  "out_for_delivery",
  "completed",
];

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "card", label: "Card" },
  { value: "other", label: "Other" },
];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash",
  mobile_money: "Mobile Money",
  bank_transfer: "Bank Transfer",
  card: "Card",
  other: "Other",
};

export const INVENTORY_MOVEMENT_TYPES = [
  { value: "stock_added", label: "Stock Added" },
  { value: "stock_removed", label: "Stock Removed" },
  { value: "sale", label: "Sale" },
  { value: "pos_sale", label: "POS Sale" },
  { value: "order", label: "Order" },
  { value: "manual_adjustment", label: "Manual Adjustment" },
  { value: "return", label: "Return" },
  { value: "damaged", label: "Damaged Stock" },
] as const;

export const STOCK_STATUS_META = {
  in_stock: { label: "In Stock", color: "mint" },
  low_stock: { label: "Low Stock", color: "amber" },
  out_of_stock: { label: "Out of Stock", color: "slate" },
} as const;

export const DELIVERY_FEE = 20;
export const FREE_DELIVERY_THRESHOLD = 500;

export const STORE_PATHS = {
  shop: "/shop",
  services: "/services",
  about: "/about",
  contact: "/contact",
  location: "/location",
  cart: "/cart",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const DEFAULT_META = {
  title: "Auto360 Gh — Automotive Products, Lubricants & Services in Accra",
  description:
    "Auto360 Gh is your automotive partner in Accra, Ghana. Genuine spare parts, premium LIQUI MOLY lubricants, engine oils, additives and professional mechanical services.",
  keywords: [
    "Auto360 Gh",
    "auto parts Accra",
    "Liqui Moly Ghana",
    "automotive products Accra",
    "car parts Ghana",
    "lubricants Accra",
    "mechanical services Accra",
    "engine oil Accra",
  ].join(", "),
};
