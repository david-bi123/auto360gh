import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/session";
import { MANAGER_ROLES, POS_ROLES, STAFF_ROLES } from "@/lib/auth/session";
import type { Role } from "@/types";

const ADMIN_PREFIX = "/admin";
const POS_PREFIX = "/pos";
const ACCOUNT_PREFIX = "/account";
const LOGIN = "/account/login";
const REGISTER = "/account/register";

function hasRole(role: Role | undefined, allowed: Role[]): boolean {
  return !!role && allowed.includes(role);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("a360_session")?.value;
  const session = token ? await verifyToken(token) : null;
  const role = session?.role;

  const isAdminArea = pathname.startsWith(ADMIN_PREFIX);
  const isPosArea = pathname.startsWith(POS_PREFIX);
  const isAccountArea = pathname.startsWith(ACCOUNT_PREFIX);

  if (!isAdminArea && !isPosArea && !isAccountArea) {
    return NextResponse.next();
  }

  if (!session) {
    if (pathname === LOGIN || pathname === REGISTER) return NextResponse.next();
    const url = new URL(LOGIN, request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (isAccountArea && pathname === LOGIN) {
    return NextResponse.next();
  }

  if (isAdminArea) {
    if (!hasRole(role, STAFF_ROLES)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    const sensitive = ["settings", "staff", "profile", "reports", "customers"];
    if (sensitive.some((s) => pathname.startsWith(`${ADMIN_PREFIX}/${s}`))) {
      if (!hasRole(role, MANAGER_ROLES)) {
        return NextResponse.redirect(new URL(`${ADMIN_PREFIX}?forbidden=1`, request.url));
      }
    }
    return NextResponse.next();
  }

  if (isPosArea) {
    if (!hasRole(role, POS_ROLES)) {
      return NextResponse.redirect(new URL(`${ADMIN_PREFIX}?forbidden=1`, request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/pos/:path*", "/account/:path*"],
};