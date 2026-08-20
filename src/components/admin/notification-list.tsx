"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, CheckCheck, BellRing } from "lucide-react";
import type { Notification } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function NotificationList({ notifications }: { notifications: Notification[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [marking, setMarking] = useState<string | null>(null);

  const markAll = async () => {
    setMarking("all");
    const res = await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    if (res.ok) {
      toast("All notifications marked as read");
      router.refresh();
    }
    setMarking(null);
  };

  const markOne = async (id: string) => {
    setMarking(id);
    await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setMarking(null);
    router.refresh();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-carbon-200 bg-white shadow-card">
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <BellRing className="h-10 w-10 text-carbon-300" />
          <p className="text-sm text-carbon-500">No notifications yet.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between border-b border-carbon-100 bg-carbon-50/60 px-4 py-3">
            <span className="text-sm font-semibold text-carbon-700">{notifications.length} notifications</span>
            <Button variant="ghost" size="sm" onClick={markAll} loading={marking === "all"} leftIcon={<CheckCheck className="h-4 w-4" />}>
              Mark all read
            </Button>
          </div>
          <ul className="divide-y divide-carbon-100">
            {notifications.map((n) => (
              <li
                key={n._id}
                className={cn(
                  "flex items-start gap-3 px-4 py-4 transition-colors",
                  !n.read ? "bg-race-50/30" : "hover:bg-carbon-50/50"
                )}
              >
                <span
                  className={cn(
                    "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    n.type === "order" ? "bg-sky-50 text-sky-600" : "bg-emerald-50 text-emerald-600"
                  )}
                >
                  <BellRing className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-sm font-semibold text-carbon-900">
                    {n.title}
                    {!n.read && <Badge tone="race">New</Badge>}
                  </p>
                  <p className="mt-0.5 text-sm text-carbon-600">{n.message}</p>
                  <p className="mt-0.5 text-xs text-carbon-400">{formatDateTime(n.createdAt)}</p>
                  {n.link && (
                    <Link href={n.link} onClick={() => !n.read && markOne(n._id)} className="mt-1 inline-block text-xs font-semibold text-race-600 hover:underline">
                      View
                    </Link>
                  )}
                </div>
                {!n.read && (
                  <button
                    onClick={() => markOne(n._id)}
                    disabled={marking === n._id}
                    className="rounded-lg p-2 text-carbon-400 transition-colors hover:bg-carbon-100 hover:text-carbon-700"
                    title="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}