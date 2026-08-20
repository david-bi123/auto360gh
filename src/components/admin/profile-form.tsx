"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import type { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";

export function ProfileForm({ user }: { user: User | null }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword && form.newPassword !== form.confirm) {
      toast("New passwords do not match", { type: "error" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          currentPassword: form.newPassword ? form.currentPassword : undefined,
          newPassword: form.newPassword || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? "Could not update profile", { type: "error" });
        setLoading(false);
        return;
      }
      toast("Profile updated");
      setForm({ ...form, currentPassword: "", newPassword: "", confirm: "" });
      router.refresh();
    } catch {
      setLoading(false);
      toast("Something went wrong", { type: "error" });
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Full name" required>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </Field>
      <Field label="Phone">
        <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </Field>
      <div className="border-t border-carbon-100 pt-4">
        <p className="mb-3 text-sm font-semibold text-carbon-900">Change password</p>
        <div className="space-y-4">
          <Field label="Current password">
            <Input type="password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
          </Field>
          <Field label="New password">
            <Input type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
          </Field>
          <Field label="Confirm new password">
            <Input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
          </Field>
        </div>
      </div>
      <Button type="submit" loading={loading} leftIcon={<Save className="h-4 w-4" />}>Save profile</Button>
    </form>
  );
}