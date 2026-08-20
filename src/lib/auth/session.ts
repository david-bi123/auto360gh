import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { Role, SafeUser } from "@/types";
import { ROLE_HIERARCHY } from "@/config/constants";

export const SESSION_COOKIE = "a360_session";
const MAX_AGE = 60 * 60 * 24 * 7;

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: Role;
  phone?: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET || "auto360_dev_secret_change_me";
  return new TextEncoder().encode(secret);
}

export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || !payload.role) return null;
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

export function createSessionCookie(token: string): string {
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}`;
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export function safeUser(user: { _id: string; name: string; email: string; role: Role; phone?: string; avatar?: string }): SafeUser {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
  };
}

export function hasRole(role: Role, required: Role[]): boolean {
  const roleRank = ROLE_HIERARCHY.indexOf(role);
  if (roleRank === -1) return false;
  return required.some((r) => roleRank <= ROLE_HIERARCHY.indexOf(r));
}

export const STAFF_ROLES: Role[] = ["super_admin", "admin", "manager", "cashier", "staff"];
export const POS_ROLES: Role[] = ["super_admin", "admin", "manager", "cashier"];
export const MANAGER_ROLES: Role[] = ["super_admin", "admin", "manager"];
export const ADMIN_ROLES: Role[] = ["super_admin", "admin"];