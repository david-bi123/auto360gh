"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { ORDER_STATUS_META, ORDER_STATUS_FLOW } from "@/config/constants";

const STATUSES = Object.keys(ORDER_STATUS_META) as OrderStatus[];

export function OrderStatusControl({ order }: { order: Order }) {
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const idx = ORDER_STATUS_FLOW.indexOf(order.status);
  const nextStatus = idx >= 0 && idx < ORDER_STATUS_FLOW.length - 1 ? ORDER_STATUS_FLOW[idx + 1] : null;

  const save = async (target: OrderStatus, n?: string) => {
    setLoading(true);
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order._id, status: target, note: n }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast(data.error ?? "Update failed", { type: "error" });
      setLoading(false);
      return;
    }
    toast("Status updated", { description: `${order.orderNumber} → ${ORDER_STATUS_META[target].label}` });
    setNote("");
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {nextStatus && order.status !== "completed" && (
          <Button
            loading={loading}
            onClick={() => save(nextStatus)}
            leftIcon={<ArrowRight className="h-4 w-4" />}
          >
            Mark {ORDER_STATUS_META[nextStatus].label}
          </Button>
        )}
        {order.status === "completed" && (
          <Button variant="outline" leftIcon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />} disabled>
            Order completed
          </Button>
        )}
      </div>

      <div className="rounded-2xl border border-carbon-200 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-carbon-500">Set status manually</p>
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-56">
            <Select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{ORDER_STATUS_META[s].label}</option>
              ))}
            </Select>
          </div>
          <div className="flex-1 min-w-40">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note (optional)…"
              className="h-11 w-full rounded-xl border border-carbon-200 bg-white px-3 text-sm outline-none focus:border-race-400"
            />
          </div>
          <Button loading={loading} onClick={() => save(status, note || undefined)}>Apply</Button>
        </div>
      </div>

      {order.status !== "cancelled" && order.status !== "refunded" && (
        <div className="flex gap-2">
          <Button variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => save("cancelled", note || "Cancelled by staff")} leftIcon={<XCircle className="h-4 w-4" />}>
            Cancel order
          </Button>
          <Button variant="outline" className="text-carbon-700" onClick={() => save("refunded", note || "Refunded")} leftIcon={<RotateCcw className="h-4 w-4" />}>
            Mark refunded
          </Button>
        </div>
      )}
    </div>
  );
}