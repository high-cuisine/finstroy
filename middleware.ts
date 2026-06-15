import { NextRequest, NextResponse } from "next/server";
import {
  getUnlockGateSecret,
  isUnlockGateConfigured,
  isValidUnlockGateToken,
  UNLOCK_GATE_COOKIE,
} from "@/app/shared/lib/unlockGate";
import { UNLOCK_BASE } from "@/app/shared/lib/sitePath";

const LOGIN_PATH = `${UNLOCK_BASE}/login`;

function isPublicAsset(pathname: string): boolean {
  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return true;
  }

  return /\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|woff2?)$/i.test(pathname);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/" || isPublicAsset(pathname)) {
    return NextResponse.next();
  }

  if (!pathname.startsWith(UNLOCK_BASE)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isUnlockGateConfigured()) {
    return NextResponse.next();
  }

  const secret = getUnlockGateSecret();
  const token = request.cookies.get(UNLOCK_GATE_COOKIE)?.value;
  const isAuthenticated = await isValidUnlockGateToken(token, secret);
  const isLoginPage = pathname === LOGIN_PATH;

  if (!isAuthenticated && !isLoginPage) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL(UNLOCK_BASE, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
