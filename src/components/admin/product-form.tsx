"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ImagePlus, Trash2, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea, Select } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { ProductImage } from "@/components/ui/product-image";
import type { Product, Category, Brand } from "@/types";

export function ProductForm({ product, categories, brands }: { product?: Product; categories: Category[]; brands: Brand[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [imgInput, setImgInput] = useState("");
  const [form, setForm] = useState({
    name: product?.name ?? "",
    sku: product?.sku ?? "",
    brand: product?.brand ?? brands[0]?.name ?? "",
    category: product?.category ?? categories[0]?.name ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    costPrice: product?.costPrice?.toString() ?? "",
    compareAtPrice: product?.compareAtPrice?.toString() ?? "",
    stock: product?.stock?.toString() ?? "0",
    reorderLevel: product?.reorderLevel?.toString() ?? "5",
    featured: product?.featured ?? false,
    bestseller: product?.bestseller ?? false,
    active: product?.active ?? true,
  });

  const set = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const addImage = () => {
    const v = imgInput.trim();
    if (!v) return;
    if (!/^https?:\/\//.test(v)) {
      toast("Image URL must start with http:// or https://", { type: "error" });
      return;
    }
    setImages((imgs) => [...imgs, v]);
    setImgInput("");
  };

  const upload = async (file: File) => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.url) {
        toast(data.error ?? "Upload failed", { type: "error" });
        return;
      }
      setImages((imgs) => [...imgs, data.url]);
    } catch {
      toast("Upload failed", { type: "error" });
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.sku || !form.category || !form.price) {
      toast("Name, SKU, category and price are required.", { type: "error" });
      return;
    }
    setLoading(true);
    const payload = {
      id: product?._id,
      name: form.name,
      sku: form.sku,
      brand: form.brand,
      category: form.category,
      description: form.description,
      price: Number(form.price),
      costPrice: Number(form.costPrice) || 0,
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      stock: Number(form.stock) || 0,
      reorderLevel: Number(form.reorderLevel) || 0,
      images,
      featured: form.featured,
      bestseller: form.bestseller,
      active: form.active,
    };
    try {
      const res = await fetch("/api/admin/products", {
        method: product ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? "Could not save product", { type: "error" });
        setLoading(false);
        return;
      }
      toast(product ? "Product updated" : "Product created", { description: data.product?.name });
      router.push("/admin/products");
      router.refresh();
    } catch {
      setLoading(false);
      toast("Something went wrong", { type: "error" });
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Field label="Product name" required>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="LIQUI MOLY MoS2 Leichtlauf 10W-40 Engine Oil (1L)" />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="SKU" required hint="Unique stock-keeping unit">
              <Input value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder="LM-2041-1L" />
            </Field>
            <Field label="Category" required>
              <Select value={form.category} onChange={(e) => set("category", e.target.value)}>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Brand">
              <Select value={form.brand} onChange={(e) => set("brand", e.target.value)}>
                {brands.map((b) => (
                  <option key={b._id} value={b.name}>{b.name}</option>
                ))}
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (GH₵)" required>
                <Input type="number" min="0" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} />
              </Field>
              <Field label="Cost (GH₵)">
                <Input type="number" min="0" step="0.01" value={form.costPrice} onChange={(e) => set("costPrice", e.target.value)} />
              </Field>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Compare-at price (GH₵)" hint="Leave empty for no discount">
              <Input type="number" min="0" step="0.01" value={form.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Stock" required>
                <Input type="number" min="0" value={form.stock} onChange={(e) => set("stock", e.target.value)} />
              </Field>
              <Field label="Reorder at" required>
                <Input type="number" min="0" value={form.reorderLevel} onChange={(e) => set("reorderLevel", e.target.value)} />
              </Field>
            </div>
          </div>

          <Field label="Description" required>
            <Textarea rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Full description of the product, benefits and usage." />
          </Field>

          <div className="flex flex-wrap gap-6 rounded-2xl border border-carbon-200 bg-white p-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-carbon-700">
              <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 accent-race-500" />
              Featured on homepage
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-carbon-700">
              <input type="checkbox" checked={form.bestseller} onChange={(e) => set("bestseller", e.target.checked)} className="h-4 w-4 accent-race-500" />
              Best seller
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-carbon-700">
              <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="h-4 w-4 accent-race-500" />
              Visible in store
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-carbon-200 bg-white p-4">
            <p className="mb-3 text-sm font-semibold text-carbon-900">Product images</p>
            <div className="grid grid-cols-3 gap-2">
              {images.map((src, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-carbon-100">
                  <ProductImage src={src} alt={form.name || "Product"} productName={form.name || "Product"} brand={form.brand} fill />
                  <button
                    type="button"
                    onClick={() => setImages((imgs) => imgs.filter((_, j) => j !== i))}
                    className="absolute right-1 top-1 rounded-full bg-red-500/90 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {images.length < 4 && (
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-carbon-200 text-carbon-400 transition-colors hover:border-race-400 hover:text-race-500">
                  <ImagePlus className="h-5 w-5" />
                  <span className="text-[10px] font-medium">Upload</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
                </label>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <Input value={imgInput} onChange={(e) => setImgInput(e.target.value)} placeholder="Paste image URL" />
              <Button type="button" variant="outline" onClick={addImage}>Add</Button>
            </div>
            <p className="mt-2 text-xs text-carbon-400">Images are uploaded to Cloudinary when configured; otherwise a branded placeholder is used.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-carbon-200 pt-5">
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/products")}>Cancel</Button>
        <Button type="submit" loading={loading} leftIcon={loading ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}>
          {product ? "Save changes" : "Create product"}
        </Button>
      </div>
    </form>
  );
}