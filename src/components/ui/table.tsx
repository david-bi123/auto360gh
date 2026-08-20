import { type ReactNode, type ThHTMLAttributes, type TdHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Table({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-xl border border-carbon-200 bg-white shadow-card", className)}>
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  );
}

export function THead({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <thead className={cn("border-b border-carbon-200 bg-carbon-50/80", className)}>
      {children}
    </thead>
  );
}

export function TBody({ className, children }: { className?: string; children: ReactNode }) {
  return <tbody className={cn("divide-y divide-carbon-100", className)}>{children}</tbody>;
}

export function TRow({ className, children, ...props }: ThHTMLAttributes<HTMLTableRowElement> & { children: ReactNode }) {
  return (
    <tr className={cn("transition-colors hover:bg-carbon-50/60", className)} {...props}>
      {children}
    </tr>
  );
}

export function THeadCell({ className, children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn("px-4 py-3 text-xs font-semibold uppercase tracking-wider text-carbon-500", className)}
      {...props}
    >
      {children}
    </th>
  );
}

export function TCell({ className, children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-4 py-3 text-carbon-800 align-middle", className)} {...props}>{children}</td>;
}

export function Pagination({
  page,
  pages,
  onChange,
  className,
}: {
  page: number;
  pages: number;
  onChange: (page: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <p className="text-sm text-carbon-500">
        Page {page} of {pages}
      </p>
      <div className="flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="h-9 rounded-lg border border-carbon-200 bg-white px-3 text-sm font-medium text-carbon-700 transition-colors hover:bg-carbon-50 disabled:opacity-40"
        >
          Previous
        </button>
        <button
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
          className="h-9 rounded-lg border border-carbon-200 bg-white px-3 text-sm font-medium text-carbon-700 transition-colors hover:bg-carbon-50 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}