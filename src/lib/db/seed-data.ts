import type { BusinessSettings, Category, Brand, Customer, Product, Service, SocialLinks, User } from "@/types";
import { slugify } from "@/lib/utils";

export const seedBusinessSettings: Omit<BusinessSettings, "_id" | "createdAt" | "updatedAt"> = {
  name: "Auto360 Gh",
  logo: "/logo.png",
  heroImage: "",
  tagline: "Drive Better. Maintain Smarter.",
  description:
    "Auto360 Gh is your trusted automotive partner in Accra, Ghana. We supply genuine spare parts, premium LIQUI MOLY lubricants, additives, engine oils, car care products and professional mechanical services — quality you can rely on.",
  phone: "059 895 4177",
  whatsapp: "+233598954177",
  email: "hello@auto360gh.com",
  address: "103 Hallelujah Broadway, Accra",
  plusCode: "MRQ9+W7 Accra",
  city: "Accra",
  country: "Ghana",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=MRQ9%2BW7%20Accra",
  mapsEmbedUrl: "",
  openingHours: [
    { day: "Monday", open: "08:00", close: "18:00", closed: false },
    { day: "Tuesday", open: "08:00", close: "18:00", closed: false },
    { day: "Wednesday", open: "08:00", close: "18:00", closed: false },
    { day: "Thursday", open: "08:00", close: "18:00", closed: false },
    { day: "Friday", open: "08:00", close: "18:00", closed: false },
    { day: "Saturday", open: "08:00", close: "17:00", closed: false },
    { day: "Sunday", open: "", close: "", closed: true },
  ],
  announcement: "Premium automotive products & services in Accra — Genuine LIQUI MOLY lubricants in stock",
  announcementEnabled: true,
  footerText:
    "Genuine parts, premium lubricants and professional vehicle care. Serving Accra and beyond from 103 Hallelujah Broadway.",
  deliveryInfo:
    "Fast delivery within Accra. Kerbside pickup available at 103 Hallelujah Broadway. Same-day delivery on orders placed before 3pm.",
  featuredBrandName: "LIQUI MOLY",
  featuredBrandDescription: "Premium automotive oils, additives and care products — engineered in Germany.",
  featuredBrandImage: "",
  currency: "GH₵",
  taxRate: 0,
};

export const seedSocialLinks = {
  facebook: "https://facebook.com/auto360gh",
  instagram: "https://instagram.com/auto360gh",
  tiktok: "https://tiktok.com/@auto360gh",
  twitter: "",
  youtube: "",
  whatsapp: "https://wa.me/233598954177",
};

export const seedServices: Omit<Service, "_id" | "createdAt">[] = [
  {
    name: "Mechanical Work",
    slug: "mechanical-work",
    icon: "wrench",
    shortName: "Mechanical",
    description: "Professional automotive mechanical support for your vehicle.",
    longDescription:
      "From routine servicing to complex repairs, our experienced team keeps your vehicle running reliably. We diagnose, repair and maintain vehicles with care and precision.",
    features: ["Engine diagnostics", "Routine servicing", "Brake & suspension work", "Preventive maintenance"],
    featured: true,
    active: true,
    price: 150,
    sortOrder: 1,
  },
  {
    name: "Vehicle Detailing",
    slug: "vehicle-detailing",
    icon: "sparkles",
    shortName: "Detailing",
    description: "Vehicle cleaning and detailing services that restore the showroom look.",
    longDescription:
      "Interior and exterior detailing that protects your vehicle's value. Professional washing, polishing, upholstery care and finishing touches.",
    features: ["Exterior wash & polish", "Interior deep cleaning", "Leather & upholstery care", "Headlight restoration"],
    featured: true,
    active: true,
    price: 200,
    sortOrder: 2,
  },
  {
    name: "Lubricants & Additives",
    slug: "lubricants-additives",
    icon: "droplets",
    shortName: "Lubricants",
    description: "Premium oils, additives and automotive fluids — including LIQUI MOLY.",
    longDescription:
      "We stock a full range of premium lubricants, engine oils, transmission fluids, coolants, brake fluids and performance additives for every vehicle type.",
    features: ["Oil change service", "Fluid top-ups", "Expert product selection", "Genuine LIQUI MOLY range"],
    featured: true,
    active: true,
    price: 120,
    sortOrder: 3,
  },
  {
    name: "Genuine Spare Parts",
    slug: "genuine-spare-parts",
    icon: "cog",
    shortName: "Parts",
    description: "Quality replacement parts for different vehicle types.",
    longDescription:
      "Genuine and quality aftermarket replacement parts sourced for your vehicle. We help you find the right part and advise on installation.",
    features: ["Quality assurance", "Correct-fit sourcing", "Filter & brake parts", "Consultation on fitment"],
    featured: true,
    active: true,
    price: 0,
    sortOrder: 4,
  },
];

export const seedCategories: Omit<Category, "_id" | "createdAt">[] = [
  { name: "Engine Oils", slug: "engine-oils", description: "Premium engine oils for petrol and diesel engines.", featured: true, sortOrder: 1 },
  { name: "Transmission Fluids", slug: "transmission-fluids", description: "Gearbox and automatic transmission fluids.", featured: false, sortOrder: 2 },
  { name: "Additives & Treatments", slug: "additives-treatments", description: "Performance additives and engine treatments.", featured: true, sortOrder: 3 },
  { name: "Coolants & Antifreeze", slug: "coolants-antifreeze", description: "Engine coolant and antifreeze for all climates.", featured: false, sortOrder: 4 },
  { name: "Brake Fluids", slug: "brake-fluids", description: "High-performance brake fluids for safe stopping.", featured: false, sortOrder: 5 },
  { name: "Car Care & Cleaning", slug: "car-care-cleaning", description: "Detailing and cleaning products for your vehicle.", featured: true, sortOrder: 6 },
  { name: "Fuel System", slug: "fuel-system", description: "Cleaners and treatments for a healthy fuel system.", featured: false, sortOrder: 7 },
  { name: "Filters", slug: "filters", description: "Oil, air and fuel filters for common vehicle models.", featured: false, sortOrder: 8 },
  { name: "Spare Parts", slug: "spare-parts", description: "Genuine and quality replacement parts.", featured: false, sortOrder: 9 },
];

export const seedBrands: Omit<Brand, "_id" | "createdAt">[] = [
  { name: "LIQUI MOLY", slug: "liqui-moly", description: "Premium German automotive oils, additives and care products.", featured: true, sortOrder: 1 },
  { name: "Auto360 Genuine", slug: "auto360-genuine", description: "Quality assured parts supplied by Auto360 Gh.", featured: false, sortOrder: 2 },
  { name: "Bosch", slug: "bosch", description: "Trusted automotive components and consumables.", featured: false, sortOrder: 3 },
  { name: "Shell", slug: "shell", description: "Engine oils and lubricants.", featured: false, sortOrder: 4 },
];

export function seedUsers(): Omit<User, "_id" | "createdAt" | "updatedAt">[] {
  return [
    {
      name: "Auto360 Admin",
      email: "admin@auto360gh.com",
      phone: "059 895 4177",
      passwordHash: "PLACEHOLDER",
      role: "super_admin",
      active: true,
    },
    {
      name: "Kwame Osei",
      email: "manager@auto360gh.com",
      phone: "024 411 2098",
      passwordHash: "PLACEHOLDER",
      role: "manager",
      active: true,
    },
    {
      name: "Ama Mensah",
      email: "cashier@auto360gh.com",
      phone: "026 833 4412",
      passwordHash: "PLACEHOLDER",
      role: "cashier",
      active: true,
    },
    {
      name: "Yaw Boateng",
      email: "staff@auto360gh.com",
      phone: "020 199 3321",
      passwordHash: "PLACEHOLDER",
      role: "staff",
      active: true,
    },
    {
      name: "Demo Customer",
      email: "customer@auto360gh.com",
      phone: "055 622 1789",
      passwordHash: "PLACEHOLDER",
      role: "customer",
      active: true,
    },
  ];
}

export const seedCustomers: Omit<Customer, "_id" | "createdAt" | "updatedAt">[] = [
  { name: "Kwame Mensah", phone: "024 411 2098", whatsapp: "024 411 2098", email: "kwame.mensah@gmail.com", address: "East Legon, Accra", city: "Accra", totalOrders: 0, totalSpent: 0 },
  { name: "Akosua Boateng", phone: "026 833 4412", whatsapp: "026 833 4412", email: "akosua.boateng@yahoo.com", address: "Adenta, Accra", city: "Accra", totalOrders: 0, totalSpent: 0 },
  { name: "Yaw Asante", phone: "020 199 3321", whatsapp: "020 199 3321", email: "yaw.asante@outlook.com", address: "Osu, Accra", city: "Accra", totalOrders: 0, totalSpent: 0 },
  { name: "Efua Owusu", phone: "055 622 1789", whatsapp: "055 622 1789", email: "efua.owusu@gmail.com", address: "Tema", city: "Accra", totalOrders: 0, totalSpent: 0 },
  { name: "Kojo Amoah", phone: "024 718 5566", whatsapp: "024 718 5566", email: "kojo.amoah@gmail.com", address: "Madina, Accra", city: "Accra", totalOrders: 0, totalSpent: 0 },
  { name: "Abena Darko", phone: "026 455 7788", whatsapp: "026 455 7788", email: "abena.darko@yahoo.com", address: "Spintex, Accra", city: "Accra", totalOrders: 0, totalSpent: 0 },
  { name: "Kofi Owusu-Ansah", phone: "020 312 9090", whatsapp: "020 312 9090", email: "kofi.oa@gmail.com", address: "Dzorwulu, Accra", city: "Accra", totalOrders: 0, totalSpent: 0 },
  { name: "Ama Serwaa", phone: "055 178 2345", whatsapp: "055 178 2345", email: "ama.serwaa@outlook.com", address: "Dansoman, Accra", city: "Accra", totalOrders: 0, totalSpent: 0 },
  { name: "Nana Yaw Osei", phone: "024 905 6677", whatsapp: "024 905 6677", email: "nana.yaw.osei@gmail.com", address: "Cantonments, Accra", city: "Accra", totalOrders: 0, totalSpent: 0 },
  { name: "Adjoa Mansah", phone: "026 634 8811", whatsapp: "026 634 8811", email: "adjoa.mansah@gmail.com", address: "Legon, Accra", city: "Accra", totalOrders: 0, totalSpent: 0 },
];

const P = (name: string, category: string, brand: string, price: number, stock: number, extra: Partial<Product> = {}): Omit<Product, "_id" | "createdAt" | "updatedAt"> => ({
  name,
  slug: slugify(name),
  sku: slugify(name).toUpperCase().replace(/-/g, "").slice(0, 10) + "-" + String(price).replace(".", ""),
  brand,
  category,
  description:
    "Premium automotive product supplied by Auto360 Gh in Accra. This listing uses a generic demonstration description — for exact specifications, pack sizes and compatibility, please confirm with an Auto360 Gh specialist or the brand's official documentation.",
  shortDescription: `Genuine ${brand} product — ${category.toLowerCase()}. Demo listing with generic description.`,
  price,
  costPrice: Math.round(price * 0.72),
  stock,
  reorderLevel: 10,
  images: [],
  specifications: [{ label: "Pack Size", value: "Standard retail pack" }, { label: "Shelf Life", value: "See product label" }],
  vehicleCompatibility: [],
  usageInstructions: "Follow the product label instructions and your vehicle manufacturer's recommendations.",
  featured: false,
  bestseller: false,
  onSale: false,
  active: true,
  rating: 0,
  reviewCount: 0,
  ...extra,
});

export function seedProducts(): Omit<Product, "_id" | "createdAt" | "updatedAt">[] {
  return [
    P("LIQUI MOLY Top Tec 4200 5W-40 Engine Oil (1L)", "Engine Oils", "LIQUI MOLY", 285, 42, {
      featured: true, bestseller: true, rating: 4.8, reviewCount: 34,
      specifications: [{ label: "Viscosity", value: "5W-40 (demo)" }, { label: "Volume", value: "1 Litre" }],
      vehicleCompatibility: [{ make: "Toyota", model: "Corolla", yearFrom: 2010, yearTo: 2020 }, { make: "Hyundai", model: "Elantra", yearFrom: 2012, yearTo: 2021 }],
    }),
    P("LIQUI MOLY Leichtlauf High Tech 5W-40 Engine Oil (1L)", "Engine Oils", "LIQUI MOLY", 275, 30, {
      featured: true, rating: 4.7, reviewCount: 21, onSale: true, compareAtPrice: 315,
      specifications: [{ label: "Viscosity", value: "5W-40 (demo)" }, { label: "Volume", value: "1 Litre" }],
    }),
    P("LIQUI MOLY Molygen 5W-30 Engine Oil (1L)", "Engine Oils", "LIQUI MOLY", 330, 18, {
      featured: true, rating: 4.9, reviewCount: 27,
      specifications: [{ label: "Viscosity", value: "5W-30 (demo)" }, { label: "Volume", value: "1 Litre" }],
    }),
    P("LIQUI MOLY Synthoil High Tech 5W-50 Engine Oil (1L)", "Engine Oils", "LIQUI MOLY", 360, 12, {
      rating: 4.6, reviewCount: 15,
      specifications: [{ label: "Viscosity", value: "5W-50 (demo)" }, { label: "Volume", value: "1 Litre" }],
    }),
    P("LIQUI MOLY MoS2 Leichtlauf 10W-40 Engine Oil (1L)", "Engine Oils", "LIQUI MOLY", 240, 55, {
      bestseller: true, rating: 4.5, reviewCount: 41,
      specifications: [{ label: "Viscosity", value: "10W-40 (demo)" }, { label: "Volume", value: "1 Litre" }],
    }),
    P("LIQUI MOLY ATF 1800 Automatic Transmission Fluid (1L)", "Transmission Fluids", "LIQUI MOLY", 300, 22, {
      rating: 4.6, reviewCount: 12,
      specifications: [{ label: "Type", value: "ATF (demo)" }, { label: "Volume", value: "1 Litre" }],
    }),
    P("LIQUI MOLY Top Tec ATF 1200 Transmission Fluid (1L)", "Transmission Fluids", "LIQUI MOLY", 340, 8, {
      rating: 4.7, reviewCount: 9,
      specifications: [{ label: "Type", value: "ATF (demo)" }, { label: "Volume", value: "1 Litre" }],
    }),
    P("LIQUI MOLY Brake Fluid DOT 4 (500ml)", "Brake Fluids", "LIQUI MOLY", 150, 60, {
      bestseller: true, rating: 4.8, reviewCount: 52,
      specifications: [{ label: "Specification", value: "DOT 4 (demo)" }, { label: "Volume", value: "500 ml" }],
    }),
    P("LIQUI MOLY Brake Fluid DOT 5.1 (500ml)", "Brake Fluids", "LIQUI MOLY", 190, 25, {
      rating: 4.7, reviewCount: 14,
      specifications: [{ label: "Specification", value: "DOT 5.1 (demo)" }, { label: "Volume", value: "500 ml" }],
    }),
    P("LIQUI MOLY Coolant Antifreeze G12 Ready-Mix (1L)", "Coolants & Antifreeze", "LIQUI MOLY", 210, 34, {
      featured: true, rating: 4.6, reviewCount: 23,
      specifications: [{ label: "Type", value: "G12 (demo)" }, { label: "Volume", value: "1 Litre" }],
    }),
    P("LIQUI MOLY Coolant Antifreeze G11 (1.5L)", "Coolants & Antifreeze", "LIQUI MOLY", 250, 20, {
      rating: 4.5, reviewCount: 11,
      specifications: [{ label: "Type", value: "G11 (demo)" }, { label: "Volume", value: "1.5 Litre" }],
    }),
    P("LIQUI MOLY Fuel System Cleaner (300ml)", "Fuel System", "LIQUI MOLY", 120, 40, {
      bestseller: true, rating: 4.7, reviewCount: 38,
      specifications: [{ label: "Additive", value: "Fuel system cleaner (demo)" }, { label: "Volume", value: "300 ml" }],
    }),
    P("LIQUI MOLY Injection Cleaner Petrol (300ml)", "Fuel System", "LIQUI MOLY", 110, 38, {
      rating: 4.6, reviewCount: 19,
      specifications: [{ label: "Additive", value: "Petrol injection cleaner (demo)" }, { label: "Volume", value: "300 ml" }],
    }),
    P("LIQUI MOLY Diesel Purge (300ml)", "Fuel System", "LIQUI MOLY", 130, 26, {
      rating: 4.8, reviewCount: 17,
      specifications: [{ label: "Additive", value: "Diesel system cleaner (demo)" }, { label: "Volume", value: "300 ml" }],
    }),
    P("LIQUI MOLY Oil Additive MoS2 (300ml)", "Additives & Treatments", "LIQUI MOLY", 125, 48, {
      rating: 4.5, reviewCount: 29,
      specifications: [{ label: "Additive", value: "MoS2 oil additive (demo)" }, { label: "Volume", value: "300 ml" }],
    }),
    P("LIQUI MOLY Cera Tec Engine Treatment (300ml)", "Additives & Treatments", "LIQUI MOLY", 420, 10, {
      featured: true, rating: 4.9, reviewCount: 31,
      specifications: [{ label: "Additive", value: "Ceramic engine treatment (demo)" }, { label: "Volume", value: "300 ml" }],
    }),
    P("LIQUI MOLY Engine Flush (500ml)", "Additives & Treatments", "LIQUI MOLY", 180, 32, {
      rating: 4.6, reviewCount: 22,
      specifications: [{ label: "Additive", value: "Engine flush (demo)" }, { label: "Volume", value: "500 ml" }],
    }),
    P("LIQUI MOLY Valve Clean (300ml)", "Fuel System", "LIQUI MOLY", 140, 28, {
      rating: 4.4, reviewCount: 13,
      specifications: [{ label: "Additive", value: "Valve cleaner (demo)" }, { label: "Volume", value: "300 ml" }],
    }),
    P("LIQUI MOLY Engine Oil Additive (300ml)", "Additives & Treatments", "LIQUI MOLY", 110, 50, {
      rating: 4.4, reviewCount: 16,
      specifications: [{ label: "Additive", value: "Engine oil additive (demo)" }, { label: "Volume", value: "300 ml" }],
    }),
    P("LIQUI MOLY Radiator Cleaner (300ml)", "Coolants & Antifreeze", "LIQUI MOLY", 95, 44, {
      rating: 4.3, reviewCount: 10,
      specifications: [{ label: "Additive", value: "Radiator cleaner (demo)" }, { label: "Volume", value: "300 ml" }],
    }),
    P("LIQUI MOLY Universal Car Shampoo (500ml)", "Car Care & Cleaning", "LIQUI MOLY", 90, 60, {
      bestseller: true, rating: 4.5, reviewCount: 26, onSale: true, compareAtPrice: 110,
      specifications: [{ label: "Type", value: "Car shampoo (demo)" }, { label: "Volume", value: "500 ml" }],
    }),
    P("LIQUI MOLY Interior Care Leather & Vinyl (250ml)", "Car Care & Cleaning", "LIQUI MOLY", 95, 35, {
      rating: 4.4, reviewCount: 14,
      specifications: [{ label: "Type", value: "Interior care (demo)" }, { label: "Volume", value: "250 ml" }],
    }),
    P("LIQUI MOLY Wheel Cleaner (500ml)", "Car Care & Cleaning", "LIQUI MOLY", 105, 40, {
      rating: 4.3, reviewCount: 12,
      specifications: [{ label: "Type", value: "Wheel cleaner (demo)" }, { label: "Volume", value: "500 ml" }],
    }),
    P("LIQUI MOLY Aircon Cleaner (250ml)", "Car Care & Cleaning", "LIQUI MOLY", 135, 22, {
      rating: 4.4, reviewCount: 9,
      specifications: [{ label: "Type", value: "AC cleaner (demo)" }, { label: "Volume", value: "250 ml" }],
    }),
    P("Auto360 Genuine Oil Filter — Toyota", "Filters", "Auto360 Genuine", 85, 0, {
      rating: 4.2, reviewCount: 18,
      specifications: [{ label: "Type", value: "Oil filter" }, { label: "Fitment", value: "Demo — confirm vehicle" }],
    }),
    P("Auto360 Genuine Air Filter — Toyota Corolla", "Filters", "Auto360 Genuine", 120, 15, {
      rating: 4.3, reviewCount: 12,
      specifications: [{ label: "Type", value: "Air filter" }, { label: "Fitment", value: "Toyota Corolla (demo)" }],
    }),
    P("Bosch Iridium Spark Plug Set (4pc)", "Spare Parts", "Bosch", 320, 14, {
      bestseller: true, rating: 4.8, reviewCount: 22,
      specifications: [{ label: "Type", value: "Iridium spark plug" }, { label: "Quantity", value: "4 pieces" }],
    }),
    P("Auto360 Ceramic Brake Pads — Front Set", "Spare Parts", "Auto360 Genuine", 460, 9, {
      rating: 4.6, reviewCount: 15,
      specifications: [{ label: "Type", value: "Brake pads" }, { label: "Fitment", value: "Demo — confirm vehicle" }],
    }),
  ];
}