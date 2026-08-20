import type { Metadata } from "next";
import { getSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui/card";
import { ProfileForm } from "@/components/admin/profile-form";
import { ROLE_LABELS } from "@/config/constants";

export const metadata: Metadata = { title: "My Profile — Auto360 Admin" };
export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const session = await getSession();
  const db = await getDb();
  const user = session ? await db.users.findById(session.sub) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-carbon-100 pb-2">
                <dt className="text-carbon-500">Name</dt>
                <dd className="font-semibold text-carbon-900">{user?.name}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-carbon-100 pb-2">
                <dt className="text-carbon-500">Email</dt>
                <dd className="font-semibold text-carbon-900">{user?.email}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-carbon-100 pb-2">
                <dt className="text-carbon-500">Role</dt>
                <dd>{user && <Badge tone="race">{ROLE_LABELS[user.role]}</Badge>}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit profile & password</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} />
        </CardContent>
      </Card>
    </div>
  );
}