"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import type { BusinessSettings } from "@/types";

export function LoginForm({ settings }: { settings: BusinessSettings }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? "Login failed", { type: "error" });
        setLoading(false);
        return;
      }
      toast(`Welcome back, ${data.user.name}!`, { description: data.user.role === "customer" ? "Signed in to your account." : "Signed in to the dashboard." });
      const from = searchParams.get("from");
      router.push(from && from.startsWith("/") ? from : data.redirect);
      router.refresh();
    } catch {
      setLoading(false);
      toast("Something went wrong", { type: "error" });
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Email address" required>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
      </Field>
      <Field label="Password" required>
        <div className="relative">
          <Input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            className="pr-11"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-carbon-400 hover:text-carbon-700"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </Field>
      <Button type="submit" size="lg" className="w-full" loading={loading} leftIcon={<LogIn className="h-4 w-4" />}>
        Sign In
      </Button>
      <p className="text-center text-xs text-carbon-400">
        New here?{" "}
        <a href="/account/register" className="font-semibold text-race-600 hover:underline">
          Create an account
        </a>
      </p>
      <div className="rounded-xl bg-carbon-50 p-3 text-center">
        <p className="text-xs font-semibold text-carbon-600">Demo staff accounts</p>
        <p className="mt-1 text-[11px] text-carbon-400">
          admin@auto360gh.com · manager@auto360gh.com · cashier@auto360gh.com
        </p>
        <p className="text-[11px] text-carbon-400">Password for all: @360Gh123</p>
      </div>
      <p className="text-center text-xs text-carbon-400">Powered by {settings.name}</p>
    </form>
  );
}