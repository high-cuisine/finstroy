import { NextRequest, NextResponse } from "next/server";
import {
  getUnlockGateSecret,
  isUnlockGateConfigured,
  isValidUnlockGateToken,
  UNLOCK_GATE_COOKIE,
} from "@/app/shared/lib/unlockGate";
import {
  isMaintenanceModeServer,
  PHYSICAL_PREFIX,
} from "@/app/shared/lib/maintenanceMode";

const LOGIN_PATH = `${PHYSICAL_PREFIX}/login`;

function isPublicAsset(pathname: string): boolean {
  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return true;
  }

  return /\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|woff2?)$/i.test(pathname);
}

function rewriteToPhysical(request: NextRequest, pathname: string): NextResponse {
  const target =
    pathname === "/" ? PHYSICAL_PREFIX : `${PHYSICAL_PREFIX}${pathname}`;
  return NextResponse.rewrite(new URL(target, request.url));
}

async function handleUnlockGate(
  request: NextRequest,
  pathname: string,
): Promise<NextResponse | null> {
  if (!isUnlockGateConfigured()) {
    return null;
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
    return NextResponse.redirect(new URL(PHYSICAL_PREFIX, request.url));
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicAsset(pathname)) {
    return NextResponse.next();
  }

  if (isMaintenanceModeServer()) {
    if (pathname === "/") {
      return NextResponse.next();
    }

    if (!pathname.startsWith(PHYSICAL_PREFIX)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const gateResponse = await handleUnlockGate(request, pathname);
    return gateResponse ?? NextResponse.next();
  }

  if (pathname.startsWith(PHYSICAL_PREFIX)) {
    const stripped =
      pathname === PHYSICAL_PREFIX ? "/" : pathname.slice(PHYSICAL_PREFIX.length);
    return NextResponse.redirect(new URL(stripped || "/", request.url));
  }

  return rewriteToPhysical(request, pathname);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
