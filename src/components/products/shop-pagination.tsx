"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function ShopPagination({ page, pages }: { page: number; pages: number }) {
  const router = useRouter();
  const params = useSearchParams();

  const go = (p: number) => {
    const next = new URLSearchParams(params.toString());
    next.set("page", String(p));
    router.push(`/shop?${next.toString()}`);
  };

  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        disabled={page <= 1}
        onClick={() => go(page - 1)}
        className="h-9 rounded-lg border border-carbon-200 bg-white px-4 text-sm font-medium text-carbon-700 transition-colors hover:bg-carbon-50 disabled:opacity-40"
      >
        Previous
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 1)
        .reduce<number[]>((acc, p) => (acc[acc.length - 1] === p ? acc : [...acc, p]), [])
        .map((p, i, arr) => (
          <span key={p} className="flex items-center gap-2">
            {i > 0 && arr[i - 1] !== p - 1 && <span className="text-carbon-300">…</span>}
            <button
              onClick={() => go(p)}
              className={
                p === page
                  ? "flex h-9 w-9 items-center justify-center rounded-lg bg-carbon-900 text-sm font-semibold text-white"
                  : "flex h-9 w-9 items-center justify-center rounded-lg border border-carbon-200 bg-white text-sm font-medium text-carbon-700 transition-colors hover:bg-carbon-50"
              }
            >
              {p}
            </button>
          </span>
        ))}
      <button
        disabled={page >= pages}
        onClick={() => go(page + 1)}
        className="h-9 rounded-lg border border-carbon-200 bg-white px-4 text-sm font-medium text-carbon-700 transition-colors hover:bg-carbon-50 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}