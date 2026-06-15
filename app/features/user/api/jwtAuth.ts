import { WP_JSON_FETCH_BASE } from "@/app/features/wp/api/config";
import type { JwtTokenResponse, JwtValidateResponse } from "./types";

function asErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Неизвестная ошибка";
}

async function parseJsonOrThrow<T>(res: Response): Promise<T> {
  const text = await res.text();
  let payload: unknown;
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = text;
  }

  if (!res.ok) {
    const maybeMessage =
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof (payload as { message?: unknown }).message === "string"
        ? (payload as { message: string }).message
        : undefined;
    throw new Error(maybeMessage || `HTTP ${res.status}`);
  }

  return payload as T;
}

export async function jwtLogin(params: {
  username: string;
  password: string;
}): Promise<JwtTokenResponse> {
  try {
    const res = await fetch(`${WP_JSON_FETCH_BASE}/jwt-auth/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: params.username,
        password: params.password,
      }),
    });
    return await parseJsonOrThrow<JwtTokenResponse>(res);
  } catch (e) {
    throw new Error(asErrorMessage(e));
  }
}

export async function jwtValidate(token: string): Promise<JwtValidateResponse> {
  try {
    const res = await fetch(`${WP_JSON_FETCH_BASE}/jwt-auth/v1/token/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });
    return await parseJsonOrThrow<JwtValidateResponse>(res);
  } catch (e) {
    throw new Error(asErrorMessage(e));
  }
}
