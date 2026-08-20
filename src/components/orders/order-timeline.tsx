import { Check, Clock, Truck, PackageCheck, Package, XCircle, RotateCcw, Loader } from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { ORDER_STATUS_META, ORDER_STATUS_FLOW } from "@/config/constants";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const statusIcon: Record<string, typeof Check> = {
  pending: Clock,
  confirmed: Package,
  processing: Loader,
  ready: PackageCheck,
  out_for_delivery: Truck,
  completed: Check,
  cancelled: XCircle,
  refunded: RotateCcw,
};

export function OrderTimeline({ order }: { order: Order }) {
  const events = [...order.timeline].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
  const isActive = (s: OrderStatus) => s === order.status;
  const isPast = (s: OrderStatus) => {
    if (ORDER_STATUS_FLOW.includes(s) && ORDER_STATUS_FLOW.includes(order.status)) {
      return ORDER_STATUS_FLOW.indexOf(s) < ORDER_STATUS_FLOW.indexOf(order.status);
    }
    return events.some((e) => e.status === s && new Date(e.at).getTime() <= Date.now());
  };

  return (
    <ol className="relative space-y-0">
      {events.map((event, i) => {
        const Icon = statusIcon[event.status] ?? Clock;
        const active = isActive(event.status);
        const past = isPast(event.status);
        return (
          <li key={i} className="relative flex gap-4 pb-7 last:pb-0">
            {i < events.length - 1 && (
              <span className={cn("absolute left-[15px] top-8 h-full w-0.5", past || active ? "bg-race-500" : "bg-carbon-200")} />
            )}
            <span
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                active
                  ? "border-race-500 bg-race-500 text-white shadow-glow"
                  : past
                    ? "border-race-500 bg-white text-race-500"
                    : "border-carbon-200 bg-white text-carbon-300"
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="pt-1">
              <p className={cn("text-sm font-semibold", active ? "text-carbon-900" : past ? "text-carbon-800" : "text-carbon-400")}>
                {ORDER_STATUS_META[event.status].label}
              </p>
              <p className="text-xs text-carbon-400">{formatDateTime(event.at)}</p>
              {event.note && <p className="mt-1 text-xs text-carbon-500">{event.note}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}