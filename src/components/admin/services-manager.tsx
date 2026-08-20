"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Wrench } from "lucide-react";
import type { Service } from "@/types";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { formatGH } from "@/lib/utils";

export function ServicesManager({ services }: { services: Service[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [editing, setEditing] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!editing) return;
    setLoading(true);
    const res = await fetch("/api/admin/services", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editing._id, ...editing }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast(data.error ?? "Update failed", { type: "error" });
      setLoading(false);
      return;
    }
    toast("Service updated", { description: data.service.name });
    setEditing(null);
    router.refresh();
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {services.map((s) => (
          <div key={s._id} className="flex flex-col rounded-2xl border border-carbon-200 bg-white p-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-race-50 text-race-600">
                  <Wrench className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-carbon-900">{s.name}</p>
                  <p className="text-xs text-carbon-400">{s.shortName}</p>
                </div>
              </div>
              <button onClick={() => setEditing(s)} className="rounded-lg p-2 text-carbon-500 transition-colors hover:bg-carbon-100 hover:text-carbon-800" title="Edit service">
                <Pencil className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 line-clamp-2 flex-1 text-sm text-carbon-600">{s.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-bold text-carbon-900">{s.price ? formatGH(s.price) : "Quoted"}</span>
              <span className="text-xs text-carbon-400">{s.features.length} features</span>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal open onClose={() => setEditing(null)} title="Edit service">
          <div className="space-y-4">
            <Field label="Service name">
              <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </Field>
            <Field label="Short name" hint="Shown in navigation / compact views">
              <Input value={editing.shortName} onChange={(e) => setEditing({ ...editing, shortName: e.target.value })} />
            </Field>
            <Field label="Description">
              <Textarea rows={4} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </Field>
            <Field label="Starting price (GH₵)" hint="Leave 0 to show “Quoted”">
              <Input type="number" min="0" value={String(editing.price ?? "")} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
            </Field>
            <Field label="Features (one per line)">
              <Textarea rows={4} value={editing.features.join("\n")} onChange={(e) => setEditing({ ...editing, features: e.target.value.split("\n").map((f) => f.trim()).filter(Boolean) })} />
            </Field>
            <label className="flex items-center gap-2 text-sm font-medium text-carbon-700">
              <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="h-4 w-4 accent-race-500" />
              Visible on the website
            </label>
            <div className="flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={save} loading={loading}>Save service</Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}