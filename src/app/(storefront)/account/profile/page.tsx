import type { Metadata } from "next";
import { getSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangePasswordForm } from "@/components/account/change-password-form";

export const metadata: Metadata = { title: "My Profile — Auto360 Gh" };

export default async function ProfilePage() {
  const session = await getSession();
  const db = await getDb();
  const user = session ? await db.users.findById(session.sub) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Profile details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-carbon-100 pb-2">
              <dt className="text-carbon-500">Name</dt>
              <dd className="font-semibold text-carbon-900">{user?.name}</dd>
            </div>
            <div className="flex justify-between border-b border-carbon-100 pb-2">
              <dt className="text-carbon-500">Email</dt>
              <dd className="font-semibold text-carbon-900">{user?.email}</dd>
            </div>
            <div className="flex justify-between border-b border-carbon-100 pb-2">
              <dt className="text-carbon-500">Phone</dt>
              <dd className="font-semibold text-carbon-900">{user?.phone || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-carbon-500">Account type</dt>
              <dd className="font-semibold text-carbon-900">{user?.role === "customer" ? "Customer" : user?.role}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}