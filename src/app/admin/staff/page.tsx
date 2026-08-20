import type { Metadata } from "next";
import { getSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { StaffManager } from "@/components/admin/staff-manager";

export const metadata: Metadata = { title: "Staff — Auto360 Admin" };
export const dynamic = "force-dynamic";

export default async function AdminStaffPage() {
  const session = await getSession();
  const db = await getDb();
  const users = await db.users.find({ role: { $ne: "customer" } } as never, { sort: { createdAt: 1 } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-carbon-900">Staff</h1>
        <p className="text-sm text-carbon-500">Manage the people who can access this admin platform.</p>
      </div>
      <StaffManager users={users} currentUserId={session?.sub ?? ""} />
    </div>
  );
}