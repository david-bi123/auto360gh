import type { Metadata } from "next";
import { getDb } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = { title: "New Product — Auto360 Admin" };

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const db = await getDb();
  const [categories, brands] = await Promise.all([
    db.categories.find({} as never, { sort: { name: 1 } }),
    db.brands.find({} as never, { sort: { name: 1 } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-carbon-900">New product</h1>
        <p className="text-sm text-carbon-500">Add a product to your catalogue and inventory.</p>
      </div>
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}