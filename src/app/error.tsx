"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-race-50 text-race-600">
        <TriangleAlert className="h-8 w-8" />
      </span>
      <h1 className="mt-5 font-display text-2xl font-extrabold text-carbon-900">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-carbon-500">
        An unexpected error occurred. Please try again — if the problem persists, contact us on WhatsApp.
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex h-11 items-center rounded-xl bg-race-500 px-6 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-race-600"
      >
        Try again
      </button>
    </div>
  );
}