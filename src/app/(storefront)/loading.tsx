import { Skeleton } from "@/components/ui/card";

export default function StorefrontLoading() {
  return (
    <div className="bg-carbon-50">
      <div className="bg-carbon-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-40 bg-white/20" />
          <Skeleton className="mt-4 h-10 w-72 max-w-full bg-white/20" />
          <Skeleton className="mt-4 h-4 w-96 max-w-full bg-white/20" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-carbon-200 bg-white p-3">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="mt-3 h-4 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}