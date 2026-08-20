"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search, Plus, Minus, Trash2, ScanLine, ReceiptText, Printer, X, ShoppingCart, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { formatGH } from "@/lib/utils";
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from "@/config/constants";
import type { PaymentMethod, Sale } from "@/types";

interface POSProduct {
  _id: string;
  name: string;
  sku: string;
  brand: string;
  price: number;
  stock: number;
}

interface CartLine {
  productId: string;
  name: string;
  sku: string;
  price: number;
  qty: number;
  stock: number;
}

export function PosTerminal() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<POSProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [discount, setDiscount] = useState("");
  const [paid, setPaid] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<Sale | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const search = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}&limit=24&full=1`);
      const data = await res.json();
      setProducts(data.items ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 250);
    return () => clearTimeout(t);
  }, [query, search]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchRef.current) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const add = (p: POSProduct) => {
    setCart((prev) => {
      const line = prev.find((l) => l.productId === p._id);
      if (line) {
        if (line.qty >= p.stock) {
          toast(`Only ${p.stock} in stock for ${p.name}`, { type: "error" });
          return prev;
        }
        return prev.map((l) => (l.productId === p._id ? { ...l, qty: l.qty + 1 } : l));
      }
      if (p.stock <= 0) {
        toast(`${p.name} is out of stock`, { type: "error" });
        return prev;
      }
      return [...prev, { productId: p._id, name: p.name, sku: p.sku, price: p.price, qty: 1, stock: p.stock }];
    });
  };

  const setQty = (id: string, qty: number) => {
    setCart((prev) => prev.map((l) => (l.productId === id ? { ...l, qty: Math.max(1, Math.min(qty, l.stock)) } : l)));
  };

  const remove = (id: string) => setCart((prev) => prev.filter((l) => l.productId !== id));

  const subtotal = cart.reduce((s, l) => s + l.price * l.qty, 0);
  const discountVal = Math.min(Number(discount) || 0, subtotal);
  const total = Math.max(0, subtotal - discountVal);
  const paidVal = Number(paid) || 0;
  const change = paidVal >= total ? paidVal - total : 0;

  const complete = async () => {
    if (cart.length === 0) {
      toast("Add products to the sale first", { type: "error" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((l) => ({ productId: l.productId, quantity: l.qty })),
          discount: discountVal,
          amountPaid: paidVal || undefined,
          paymentMethod,
          customerName: customerName || undefined,
          notes: notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? "Could not complete sale", { type: "error" });
        setSubmitting(false);
        return;
      }
      setReceipt(data.sale);
      setCart([]);
      setDiscount("");
      setPaid("");
      setCustomerName("");
      setNotes("");
    } catch {
      setSubmitting(false);
      toast("Something went wrong", { type: "error" });
    }
  };

  const print = () => window.print();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      <div>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-carbon-400" />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search products by name or SKU…  (press "/" to focus)'
            className="h-13 w-full rounded-2xl border border-carbon-200 bg-white py-3.5 pl-11 pr-4 text-sm shadow-card outline-none focus:border-race-400"
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
          {loading && products.length === 0 && (
            <div className="col-span-full py-16 text-center text-sm text-carbon-400">Searching…</div>
          )}
          {!loading && products.length === 0 && (
            <div className="col-span-full flex flex-col items-center gap-2 py-16 text-center">
              <ScanLine className="h-10 w-10 text-carbon-300" />
              <p className="text-sm text-carbon-500">Search to add products to the sale.</p>
            </div>
          )}
          {products.map((p) => (
            <button
              key={p._id}
              onClick={() => add(p)}
              disabled={p.stock <= 0}
              className="group rounded-2xl border border-carbon-200 bg-white p-4 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-race-300 hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="line-clamp-2 min-h-10 text-sm font-semibold text-carbon-900">{p.name}</span>
                <Plus className="h-4 w-4 shrink-0 text-carbon-300 transition-colors group-hover:text-race-500" />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold text-carbon-900">{formatGH(p.price)}</span>
                <span className={`text-xs font-semibold ${p.stock <= 0 ? "text-red-500" : p.stock <= 5 ? "text-amber-500" : "text-carbon-400"}`}>
                  {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-fit flex-col rounded-2xl border border-carbon-200 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-carbon-100 px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-carbon-900">
            <ShoppingCart className="h-5 w-5 text-race-500" /> Sale
          </h2>
          <span className="rounded-full bg-carbon-100 px-3 py-1 text-sm font-bold text-carbon-700">{cart.length}</span>
        </div>

        <div className="max-h-72 flex-1 space-y-2 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <p className="py-10 text-center text-sm text-carbon-400">Cart is empty. Tap a product to add it.</p>
          ) : (
            cart.map((l) => (
              <div key={l.productId} className="rounded-xl border border-carbon-100 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-1 text-sm font-semibold text-carbon-900">{l.name}</p>
                  <button onClick={() => remove(l.productId)} className="rounded p-1 text-carbon-300 hover:bg-red-50 hover:text-red-500" aria-label="Remove">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setQty(l.productId, l.qty - 1)} className="rounded-lg bg-carbon-100 p-1.5 hover:bg-carbon-200" aria-label="Decrease">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{l.qty}</span>
                    <button onClick={() => setQty(l.productId, l.qty + 1)} className="rounded-lg bg-carbon-100 p-1.5 hover:bg-carbon-200" aria-label="Increase">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-carbon-900">{formatGH(l.price * l.qty)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-3 border-t border-carbon-100 p-4">
          <div className="flex items-center gap-2">
            <Percent className="h-4 w-4 text-carbon-400" />
            <input
              type="number"
              min="0"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="Discount (GH₵)"
              className="h-10 w-full rounded-xl border border-carbon-200 px-3 text-sm outline-none focus:border-race-400"
            />
          </div>
          <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}>
            {PAYMENT_METHODS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </Select>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min="0"
              value={paid}
              onChange={(e) => setPaid(e.target.value)}
              placeholder="Amount received"
              className="h-10 rounded-xl border border-carbon-200 px-3 text-sm outline-none focus:border-race-400"
            />
            <div className="flex h-10 items-center justify-between rounded-xl bg-carbon-50 px-3 text-sm">
              <span className="text-carbon-500">Change</span>
              <span className="font-bold text-emerald-600">{formatGH(change)}</span>
            </div>
          </div>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer name (optional)"
            className="h-10 w-full rounded-xl border border-carbon-200 px-3 text-sm outline-none focus:border-race-400"
          />
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Note (optional)"
            className="h-10 w-full rounded-xl border border-carbon-200 px-3 text-sm outline-none focus:border-race-400"
          />

          <dl className="space-y-1 border-t border-carbon-100 pt-3 text-sm">
            <div className="flex justify-between"><dt className="text-carbon-500">Subtotal</dt><dd className="font-semibold">{formatGH(subtotal)}</dd></div>
            {discountVal > 0 && (
              <div className="flex justify-between"><dt className="text-carbon-500">Discount</dt><dd className="font-semibold text-red-500">-{formatGH(discountVal)}</dd></div>
            )}
            <div className="flex justify-between text-base"><dt className="font-bold text-carbon-900">Total</dt><dd className="font-extrabold text-race-600">{formatGH(total)}</dd></div>
          </dl>

          <Button onClick={complete} loading={submitting} className="w-full" size="lg" leftIcon={<ReceiptText className="h-4 w-4" />}>
            Complete sale
          </Button>
        </div>
      </div>

      {receipt && (
        <Modal open onClose={() => setReceipt(null)} title={`Receipt ${receipt.receiptNumber}`}>
          <div className="space-y-4">
            <div className="receipt-print rounded-2xl border border-dashed border-carbon-300 bg-white p-5 text-sm">
              <div className="text-center">
                <p className="font-display text-lg font-extrabold text-carbon-900">AUTO360 GH</p>
                <p className="text-xs text-carbon-500">{receipt.receiptNumber} · {new Date(receipt.createdAt).toLocaleString("en-GB")}</p>
              </div>
              <div className="my-3 border-t border-dashed border-carbon-300" />
              <ul className="space-y-1.5">
                {receipt.items.map((it) => (
                  <li key={it.sku} className="flex justify-between gap-3">
                    <span className="flex-1">
                      <span className="font-medium text-carbon-800">{it.productName}</span>
                      <span className="block text-xs text-carbon-400">{it.quantity} × {formatGH(it.unitPrice)}</span>
                    </span>
                    <span className="font-semibold">{formatGH(it.lineTotal)}</span>
                  </li>
                ))}
              </ul>
              <div className="my-3 border-t border-dashed border-carbon-300" />
              <dl className="space-y-1">
                <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatGH(receipt.subtotal)}</dd></div>
                {receipt.discount > 0 && <div className="flex justify-between"><dt>Discount</dt><dd>-{formatGH(receipt.discount)}</dd></div>}
                <div className="flex justify-between font-extrabold text-carbon-900"><dt>Total</dt><dd>{formatGH(receipt.total)}</dd></div>
                <div className="flex justify-between"><dt>Paid</dt><dd>{formatGH(receipt.amountPaid)}</dd></div>
                <div className="flex justify-between"><dt>Change</dt><dd>{formatGH(receipt.change)}</dd></div>
                <div className="flex justify-between"><dt>Method</dt><dd>{receipt.paymentMethodLabel}</dd></div>
              </dl>
              <p className="mt-3 text-center text-xs text-carbon-500">
                Cashier: {receipt.cashierName}
                {receipt.customerName ? ` · ${receipt.customerName}` : ""}
                <br />Thank you for choosing Auto360 Gh!
              </p>
            </div>
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={() => setReceipt(null)} leftIcon={<X className="h-4 w-4" />}>Close</Button>
              <Button onClick={print} leftIcon={<Printer className="h-4 w-4" />}>Print receipt</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}