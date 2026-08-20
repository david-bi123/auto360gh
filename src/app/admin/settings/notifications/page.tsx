import type { Metadata } from "next";
import { Check, CheckCheck, Bell } from "lucide-react";
import { getNotifications } from "@/lib/services/notifications";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/card";
import { NotificationList } from "@/components/admin/notification-list";

export const metadata: Metadata = { title: "Notifications — Auto360 Admin" };
export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  const notifications = await getNotifications({ limit: 50 });
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-carbon-900">Notifications</h1>
          <p className="text-sm text-carbon-500">
            {unread > 0 ? `${unread} unread · ` : ""}latest activity on orders and POS sales
          </p>
        </div>
      </div>

      <NotificationList notifications={notifications} />
    </div>
  );
}