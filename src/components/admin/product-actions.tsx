"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, Minus, Package } from "lucide-react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export function ProductActions({ product }: { product: Product }) {
  const router = useRouter();
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [qty, setQty] = useState("10");
  const [type, setType] = useState<"stock_added" | "stock_removed" | "sale" | "return" | "damaged" | "manual_adjustment">("stock_added");
  const [reason, setReason] = useState("");
  const [adjusting, setAdjusting] = useState(false);

  const remove = async () => {
    setDeleting(true);
    const res = await fetch(`/api/admin/products?id=${product._id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      toast(data.error ?? "Could not delete product", { type: "error" });
      setDeleting(false);
      return;
    }
    toast("Product deleted", { description: product.name });
    setDeleteOpen(false);
    router.refresh();
  };

  const adjust = async () => {
    const n = Number(qty);
    if (!n) {
      toast("Enter a valid quantity", { type: "error" });
      return;
    }
    const delta = type === "sale" || type === "damaged" || type === "stock_removed" ? -Math.abs(n) : Math.abs(n);
    setAdjusting(true);
    const res = await fetch("/api/admin/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product._id, quantity: delta, type, reason }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast(data.error ?? "Adjustment failed", { type: "error" });
      setAdjusting(false);
      return;
    }
    toast("Stock updated", { description: `New stock: ${data.product.stock}` });
    setStockOpen(false);
    setReason("");
    router.refresh();
  };

  const stockTone = product.stock <= 0 ? "text-red-600 bg-red-50" : product.stock <= product.reorderLevel ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50";

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        onClick={() => setStockOpen(true)}
        className={cn("rounded-lg px-2.5 py-1.5 text-xs font-bold transition-opacity hover:opacity-80", stockTone)}
        title="Adjust stock"
      >
        {product.stock}
      </button>
      <Link
        href={`/admin/products/${product._id}/edit`}
        className="rounded-lg p-2 text-carbon-500 transition-colors hover:bg-carbon-100 hover:text-carbon-800"
        title="Edit"
      >
        <Pencil className="h-4 w-4" />
      </Link>
      <button
        onClick={() => setDeleteOpen(true)}
        className="rounded-lg p-2 text-carbon-400 transition-colors hover:bg-red-50 hover:text-red-600"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <Modal open={stockOpen} onClose={() => setStockOpen(false)} title={`Adjust stock — ${product.name}`}>
        <div className="space-y-4">
          <div className="rounded-xl bg-carbon-50 px-4 py-3 text-sm">
            Current stock: <span className="font-bold text-carbon-900">{product.stock}</span> · Reorder at {product.reorderLevel}
          </div>
          <Field label="Adjustment type">
            <Select value={type} onChange={(e) => setType(e.target.value as typeof type)}>
              <option value="stock_added">Stock received / restock (+)</option>
              <option value="return">Customer return (+)</option>
              <option value="sale">Sold (—)</option>
              <option value="damaged">Damaged (—)</option>
              <option value="stock_removed">Stock removed (—)</option>
              <option value="manual_adjustment">Manual adjustment (+)</option>
            </Select>
          </Field>
          <Field label="Quantity">
            <Input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} />
          </Field>
          <Field label="Reason / reference" hint="Shown in inventory movement history">
            <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Restock from supplier" />
          </Field>
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={() => setStockOpen(false)}>Cancel</Button>
            <Button onClick={adjust} loading={adjusting} leftIcon={type === "sale" ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}>
              Apply adjustment
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete product">
        <div className="space-y-4">
          <p className="text-sm text-carbon-600">
            Are you sure you want to delete <span className="font-semibold text-carbon-900">{product.name}</span>? This cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={remove} loading={deleting} leftIcon={<Package className="h-4 w-4" />}>Delete product</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}