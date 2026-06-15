import { NextRequest, NextResponse } from "next/server";
import {
  getUnlockGateCredentials,
  getUnlockGateSecret,
  isUnlockGateConfigured,
  signUnlockGateToken,
  UNLOCK_GATE_COOKIE,
} from "@/app/shared/lib/unlockGate";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(request: NextRequest) {
  if (!isUnlockGateConfigured()) {
    return NextResponse.json({ error: "Gate is not configured" }, { status: 503 });
  }

  const body = (await request.json()) as { username?: string; password?: string };
  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";
  const expected = getUnlockGateCredentials();

  if (username !== expected.username || password !== expected.password) {
    return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
  }

  const secret = getUnlockGateSecret();
  const token = await signUnlockGateToken(secret);
  const response = NextResponse.json({ ok: true });

  response.cookies.set(UNLOCK_GATE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(UNLOCK_GATE_COOKIE);
  return response;
}
