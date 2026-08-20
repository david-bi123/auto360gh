import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/services/products";
import { getDb } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = { title: "Edit Product — Auto360 Admin" };

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, db] = await Promise.all([getProductById(id), getDb()]);
  if (!product) notFound();

  const [categories, brands] = await Promise.all([
    db.categories.find({} as never, { sort: { name: 1 } }),
    db.brands.find({} as never, { sort: { name: 1 } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-carbon-900">Edit product</h1>
        <p className="text-sm text-carbon-500">{product.name}</p>
      </div>
      <ProductForm product={product} categories={categories} brands={brands} />
    </div>
  );
}