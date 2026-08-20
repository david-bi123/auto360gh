"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, UserPlus, ShieldCheck, KeyRound } from "lucide-react";
import type { User, Role } from "@/types";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { ROLE_LABELS } from "@/config/constants";
import { cn } from "@/lib/utils";

const STAFF_ROLE_VALUES: Role[] = ["super_admin", "admin", "manager", "cashier", "staff"];

export function StaffManager({ users, currentUserId }: { users: User[]; currentUserId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [modal, setModal] = useState<"create" | User | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "cashier" as Role });
  const [editForm, setEditForm] = useState({ name: "", phone: "", role: "cashier" as Role, password: "", active: true });

  const openEdit = (u: User) => {
    setEditForm({ name: u.name, phone: u.phone ?? "", role: u.role, password: "", active: u.active });
    setModal(u);
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      toast(data.error ?? "Could not create user", { type: "error" });
      setLoading(false);
      return;
    }
    toast("Staff member created", { description: data.user.email });
    setModal(null);
    setForm({ name: "", email: "", phone: "", password: "", role: "cashier" });
    router.refresh();
  };

  const update = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal || typeof modal === "string") return;
    setLoading(true);
    const res = await fetch("/api/admin/staff", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: modal._id, ...editForm }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast(data.error ?? "Could not update user", { type: "error" });
      setLoading(false);
      return;
    }
    toast("Staff member updated");
    setModal(null);
    router.refresh();
  };

  const roleTone: Record<string, "dark" | "race" | "amber" | "sky" | "slate" | "mint"> = {
    super_admin: "dark",
    admin: "race",
    manager: "amber",
    cashier: "sky",
    staff: "slate",
    customer: "mint",
  };

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setModal("create")} leftIcon={<UserPlus className="h-4 w-4" />}>Add staff member</Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-carbon-200 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-carbon-100 bg-carbon-50/60 text-left text-xs uppercase tracking-wider text-carbon-500">
              <th className="px-4 py-3">Staff member</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-carbon-100">
            {users.map((u) => (
              <tr key={u._id} className={cn("transition-colors", u.active ? "hover:bg-carbon-50/50" : "opacity-50")}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-carbon-900 text-xs font-bold uppercase text-white">
                      {u.name.slice(0, 1)}
                    </span>
                    <div>
                      <p className="font-semibold text-carbon-900">
                        {u.name} {u._id === currentUserId && <span className="text-xs font-medium text-race-600">(you)</span>}
                      </p>
                      <p className="text-xs text-carbon-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={roleTone[u.role] ?? "slate"}>{ROLE_LABELS[u.role]}</Badge>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", u.active ? "bg-emerald-50 text-emerald-600" : "bg-carbon-100 text-carbon-500")}>
                    <ShieldCheck className="h-3.5 w-3.5" /> {u.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(u)} className="rounded-lg p-2 text-carbon-500 hover:bg-carbon-100 hover:text-carbon-800" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modal === "create"} onClose={() => setModal(null)} title="Add staff member">
        <form onSubmit={create} className="space-y-4">
          <Field label="Full name" required>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Kofi Mensah" />
          </Field>
          <Field label="Email" required>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="kofi@auto360gh.com" />
          </Field>
          <Field label="Phone">
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+233 55 000 0000" />
          </Field>
          <Field label="Role">
            <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
              {STAFF_ROLE_VALUES.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </Select>
          </Field>
          <Field label="Temporary password" required hint="At least 8 characters">
            <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </Field>
          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
            <Button type="submit" loading={loading} leftIcon={<Plus className="h-4 w-4" />}>Create staff</Button>
          </div>
        </form>
      </Modal>

      {modal && typeof modal !== "string" && (
        <Modal open onClose={() => setModal(null)} title={`Edit ${modal.name}`}>
          <form onSubmit={update} className="space-y-4">
            <Field label="Full name">
              <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </Field>
            <Field label="Phone">
              <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
            </Field>
            <Field label="Role">
              <Select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value as Role })}>
                {STAFF_ROLE_VALUES.map((r) => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </Select>
            </Field>
            <Field label="New password" hint="Leave blank to keep current password">
              <Input type="password" value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} />
            </Field>
            <label className="flex items-center gap-2 text-sm font-medium text-carbon-700">
              <input type="checkbox" checked={editForm.active} onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })} className="h-4 w-4 accent-race-500" />
              Account active (can sign in)
            </label>
            <div className="flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
              <Button type="submit" loading={loading} leftIcon={<KeyRound className="h-4 w-4" />}>Save changes</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}