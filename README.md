# Auto360 Gh — Automotive Commerce Platform

A production-quality automotive e-commerce + management platform for **Auto360 Gh**, 103 Hallelujah Broadway, Accra, Ghana.

- Public storefront: shop, product details, services, about, contact, location, cart, checkout, customer account.
- Admin platform: dashboard, products, inventory (with movement history), orders, customers, Point of Sale, sales, reports, services, business profile, social media, notifications, staff, and profile.
- Built with **Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + MongoDB** — with an automatic **in-memory demo backend** when no database is configured.
- Cloudinary-ready image uploads (falls back to branded SVG placeholders in the demo).

---

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000

No database or credentials are required — the platform seeds itself with realistic demo data (28 products, 12 orders, 18 POS sales, 10 customers, 5 users) in memory.

### Seed script

```bash
npm run seed
```

Runs against the configured backend (memory or MongoDB) and reports seeded counts.

---

## Demo accounts

| Role      | Email                  | Password        |
| --------- | ---------------------- | --------------- |
| Super Admin | `admin@auto360gh.com` | `Admin@360Gh123` |
| Manager   | `manager@auto360gh.com` | `Manager@360Gh123` |
| Cashier   | `cashier@auto360gh.com` | `Cashier@360Gh123` |
| Staff     | `staff@auto360gh.com`  | `Staff@360Gh123` |
| Customer  | `customer@auto360gh.com` | `Customer@360Gh123` |

- Admin platform: `/admin` — Dashboard, Products, Inventory, Orders, Customers, **POS** (`/admin/pos`), Sales, Reports, Services, Settings.
- Customer account: `/account` — orders, order tracking, profile, password change.

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you need:

| Variable                     | Purpose                                                    |
| ---------------------------- | ---------------------------------------------------------- |
| `MONGODB_URI`                | MongoDB connection string. If empty, an in-memory backend is used. |
| `AUTH_SECRET`                | Secret used to sign session JWTs (a dev fallback is built in). |
| `CLOUDINARY_CLOUD_NAME`      | Cloudinary account for product image uploads.              |
| `CLOUDINARY_API_KEY`         | Cloudinary API key.                                        |
| `CLOUDINARY_API_SECRET`      | Cloudinary API secret.                                     |
| `NEXT_PUBLIC_APP_URL`        | Public URL (WhatsApp product links, SEO).                  |
| `SEED_DEMO_DATA`             | `true` auto-seeds demo data on first boot (default).       |

All Cloudinary / MongoDB values are optional for the demo. When absent:
- Product images use a premium SVG placeholder that matches the brand styling.
- Data lives in memory (auto-seeded on first access, resets on restart).

---

## Architecture

```
src/
  app/
    (storefront)/            Public site (home, shop, product, services, about, contact,
                             location, cart, checkout, order success, account)
    admin/                   Admin platform (dashboard, products, inventory, orders,
                             customers, POS, sales, reports, services, settings, staff, profile)
    api/                     Route handlers (auth, orders, products search, upload,
                             admin products/orders/inventory/sales/settings/social/staff/notifications/profile)
    sitemap.ts, robots.ts, layout.tsx, globals.css
  components/
    ui/                      Design-system primitives (button, field, card, modal, toast,
                             tabs, table, quantity, product-image, social-icons)
    layout/                  Navbar, footer, whatsapp float, bottom nav, logo
    home/                    Home page sections
    products/                Product cards, grids, quick view
    admin/                   Admin shell, dashboard charts, POS, product/inventory/order
                             forms, settings forms, staff manager, notifications
    account/                 Customer account forms
    orders/                  Order timeline
  lib/
    db/                      Dual backend: types.ts, memory.ts, mongo.ts, index.ts,
                             seed-data.ts, seed.ts (idempotent ensureSeeded)
    services/                Business logic: products, orders, sales, inventory,
                             customers, settings, analytics, notifications, public
    auth/                    JWT sessions (jose), bcrypt passwords, role guards,
                             middleware route protection
  store/cart.ts              Zustand persisted cart (with save-for-later)
  config/constants.ts        Order statuses, payment methods, delivery fees, role labels
  types/index.ts             Shared TypeScript models
```

### Data layer

`src/lib/db/index.ts` picks the backend automatically:

- **MongoDB** (`MONGODB_URI` set): Mongoose models with string `_id`s and timestamps.
- **In-memory**: a Mongoose-like `Collection` API used by the same services, seeded on demand.

Every page/service talks to the data layer through `src/lib/services/*`, so switching backends requires no code changes.

### Business rules

- Stock **decrements automatically** on every order and POS sale, with a full **inventory movement history** (who, when, before/after, reference).
- Low stock / out of stock surfaces on the dashboard, inventory and product pages.
- **WhatsApp** buttons and the floating chat always use the number configured in Business Profile.
- **Social links** only render in the footer when filled in.
- Delivery fee `GH₵ 20`, free delivery over `GH₵ 500` (configurable in `src/config/constants.ts`).

---

## Scripts

| Command           | Description                                     |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Start the Next.js dev server                   |
| `npm run build`   | Production build                               |
| `npm start`       | Start the production server                    |
| `npm run seed`    | Seed the database and report counts            |
| `npx tsc --noEmit`| Type-check the whole project                   |

---

## Deployment

Deploy as a standard Next.js app (Vercel, Railway, a VPS with Node 20+, etc.).

- **Vercel:** import the GitHub repo (framework preset: **Next.js**), then add the env vars from the table above under *Settings → Environment Variables*. `NEXT_PUBLIC_APP_URL` must be your production URL.
- The database auto-seeds on first boot when `SEED_DEMO_DATA=true`; you can also run `npm run seed` once locally against the same MongoDB URI.
- All credentials (MongoDB, Cloudinary, demo accounts, Vercel setup) are listed in **`auth.md`**.

---

© Auto360 Gh — 103 Hallelujah Broadway, Accra, Ghana · 059 895 4177