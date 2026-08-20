import { NextResponse } from "next/server";
import { getSession, STAFF_ROLES, MANAGER_ROLES, type SessionPayload } from "./session";
import type { Role } from "@/types";

export async function requireStaff(): Promise<{ session: SessionPayload } | NextResponse> {
  const session = await getSession();
  if (!session || !STAFF_ROLES.includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return { session };
}

export async function requireManager(): Promise<{ session: SessionPayload } | NextResponse> {
  const session = await getSession();
  if (!session || !MANAGER_ROLES.includes(session.role)) {
    return NextResponse.json({ error: "Manager access required." }, { status: 403 });
  }
  return { session };
}

export function isManager(session: Pick<SessionPayload, "role">): boolean {
  return MANAGER_ROLES.includes(session.role as Role);
}