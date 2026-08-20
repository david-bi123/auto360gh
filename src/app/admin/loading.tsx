import { Skeleton } from "@/components/ui/card";

export default function AdminLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-carbon-100 bg-white p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-20" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-carbon-100 bg-white p-5 lg:col-span-2">
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="rounded-2xl border border-carbon-100 bg-white p-5">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
      <div className="rounded-2xl border border-carbon-100 bg-white p-5">
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}