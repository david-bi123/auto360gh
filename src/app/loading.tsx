import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-carbon-200 border-t-race-500" />
        </div>
        <p className="text-sm font-medium text-carbon-500">Loading…</p>
      </div>
    </div>
  );
}