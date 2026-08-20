import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { STAFF_ROLES } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/admin-shell";
import { getNotifications } from "@/lib/services/notifications";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || !STAFF_ROLES.includes(session.role)) {
    redirect("/account/login");
  }

  const notifications = await getNotifications({ limit: 8 });
  const unreadCount = notifications.filter((n) => !n.read).length;

  return <AdminShell user={session} unreadCount={unreadCount}>{children}</AdminShell>;
}