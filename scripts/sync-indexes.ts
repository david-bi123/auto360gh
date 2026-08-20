import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import mongoose from "mongoose";
import { connectMongo, getMongoCollection } from "../src/lib/db/mongo";
import type { ModelName } from "../src/lib/db/mongo";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("No MONGODB_URI set — skipping index sync.");
    process.exit(0);
  }

  await connectMongo(uri);

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
  for (const n of names) getMongoCollection(n);

  await mongoose.syncIndexes();

  const db = mongoose.connection.db!;
  for (const name of ["users", "products", "orders", "sales", "inventorymovements", "customers", "notifications", "categories", "brands", "services"]) {
    const coll = db.collection(name);
    const indexes = await coll.indexes();
    console.log(`${name}:`);
    for (const ix of indexes) {
      const key = Object.entries(ix.key).map(([k, v]) => `${k}:${v}`).join(",");
      console.log(`   ${key}${ix.unique ? " [unique]" : ""}${ix.name === "_id_" ? " [default]" : ""}`);
    }
  }

  await mongoose.disconnect();
  console.log("DONE");
}

main().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});