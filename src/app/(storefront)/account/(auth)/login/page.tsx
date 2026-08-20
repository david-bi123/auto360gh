import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/account/login-form";
import { LogoMark } from "@/components/layout/logo";
import { BRAND_NAME } from "@/config/constants";

export const metadata: Metadata = { title: "Sign In — Auto360 Gh" };

export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-carbon-950 px-4 py-16">
      <div className="absolute inset-0 bg-grid-dark opacity-40" />
      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-carbon-200 bg-white p-8 shadow-raised">
          <div className="flex flex-col items-center gap-2 text-center">
            <LogoMark />
            <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight text-carbon-900">Welcome back</h1>
            <p className="text-sm text-carbon-500">Sign in to your {BRAND_NAME} account.</p>
          </div>
          <div className="mt-7">
            <Suspense fallback={null}>
              <LoginForm brandName={BRAND_NAME} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}