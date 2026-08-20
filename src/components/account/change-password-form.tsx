"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";

export function ChangePasswordForm() {
  const { toast } = useToast();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) {
      toast("New passwords do not match", { type: "error" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? "Could not update password", { type: "error" });
        setLoading(false);
        return;
      }
      toast("Password updated", { description: "Use your new password next time you sign in." });
      setForm({ currentPassword: "", newPassword: "", confirm: "" });
      setLoading(false);
    } catch {
      setLoading(false);
      toast("Something went wrong", { type: "error" });
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Current password" required>
        <Input type="password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
      </Field>
      <Field label="New password" required hint="At least 8 characters">
        <Input type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
      </Field>
      <Field label="Confirm new password" required>
        <Input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
      </Field>
      <Button type="submit" loading={loading} leftIcon={<KeyRound className="h-4 w-4" />}>Update Password</Button>
    </form>
  );
}