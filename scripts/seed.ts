import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { getDb, getBackend, resetDbCache } from "../src/lib/db";

async function main() {
  resetDbCache();
  const db = await getDb();
  const backend = getBackend();

  console.log(`[seed] backend: ${backend}`);

  const settings = await db.businessSettings.findOne({});
  const social = await db.socialLinks.findOne({});
  const users = await db.users.find({});
  const products = await db.products.find({});
  const categories = await db.categories.find({});
  const brands = await db.brands.find({});
  const services = await db.services.find({});
  const customers = await db.customers.find({});
  const orders = await db.orders.find({});
  const sales = await db.sales.find({});
  const movements = await db.inventoryMovements.find({});
  const notifications = await db.notifications.find({});

  console.log(`[seed] settings:            ${settings ? "ok" : "MISSING"}`);
  console.log(`[seed] social links:        ${social ? "ok" : "MISSING"}`);
  console.log(`[seed] users:               ${users.length}`);
  console.log(`[seed] products:            ${products.length}`);
  console.log(`[seed] categories:          ${categories.length}`);
  console.log(`[seed] brands:              ${brands.length}`);
  console.log(`[seed] services:            ${services.length}`);
  console.log(`[seed] customers:           ${customers.length}`);
  console.log(`[seed] orders:              ${orders.length}`);
  console.log(`[seed] sales:               ${sales.length}`);
  console.log(`[seed] inventory movements: ${movements.length}`);
  console.log(`[seed] notifications:       ${notifications.length}`);

  const totalRevenue =
    orders.filter((o) => o.status !== "cancelled" && o.status !== "refunded").reduce((s, o) => s + o.total, 0) +
    sales.reduce((s, x) => s + x.total, 0);
  console.log(`[seed] demo revenue:        GH₵ ${totalRevenue.toFixed(2)}`);

  const outOfStock = products.filter((p) => p.stock <= 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= p.reorderLevel).length;
  console.log(`[seed] stock: in=${products.length - outOfStock - lowStock} low=${lowStock} out=${outOfStock}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });