"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast("Passwords do not match", { type: "error" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? "Registration failed", { type: "error" });
        setLoading(false);
        return;
      }
      toast("Account created!", { description: "Please sign in with your new account." });
      router.push("/account/login");
    } catch {
      setLoading(false);
      toast("Something went wrong", { type: "error" });
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Full name" required>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Kwame Mensah" />
      </Field>
      <Field label="Email address" required>
        <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
      </Field>
      <Field label="Phone number">
        <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="e.g. 024 000 0000" />
      </Field>
      <Field label="Password" required hint="At least 8 characters">
        <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
      </Field>
      <Field label="Confirm password" required>
        <Input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="••••••••" />
      </Field>
      <Button type="submit" size="lg" className="w-full" loading={loading} leftIcon={<UserPlus className="h-4 w-4" />}>
        Create Account
      </Button>
      <p className="text-center text-xs text-carbon-400">
        Already have an account?{" "}
        <a href="/account/login" className="font-semibold text-race-600 hover:underline">
          Sign in
        </a>
      </p>
    </form>
  );
}