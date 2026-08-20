import type { Metadata } from "next";
import { PosTerminal } from "@/components/admin/pos-terminal";

export const metadata: Metadata = { title: "Point of Sale — Auto360 Admin" };
export const dynamic = "force-dynamic";

export default function AdminPosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-carbon-900">Point of Sale</h1>
        <p className="text-sm text-carbon-500">Ring up in-store sales, print receipts and update inventory instantly.</p>
      </div>
      <PosTerminal />
    </div>
  );
}