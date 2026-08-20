import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/account/logout-button";
import { AccountNav } from "@/components/account/account-nav";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/account/login");

  return (
    <div className="bg-carbon-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-race-500">My Account</p>
            <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-carbon-900">
              Welcome, {session.name.split(" ")[0]}
            </h1>
          </div>
          <LogoutButton />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-4">
          <AccountNav />
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}