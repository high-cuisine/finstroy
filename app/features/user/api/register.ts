import { WP_JSON_FETCH_BASE } from "@/app/features/wp/api/config";

export type HeadlessRegisterPayload = {
  username: string;
  email: string;
  password: string;
  name?: string;
};

function parseJson(text: string): unknown {
  if (!text) return {};
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return {};
  }
}

/**
 * POST `jwt-auth/v1/register` — в ответе JWT в `token` или `token_response.token`.
 */
export async function registerHeadlessUser(
  payload: HeadlessRegisterPayload,
): Promise<unknown> {
  const response = await fetch(`${WP_JSON_FETCH_BASE}/jwt-auth/v1/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const bodyText = await response.text();
  const parsed = parseJson(bodyText);

  if (!response.ok) {
    const msg =
      typeof parsed === "object" &&
      parsed !== null &&
      "message" in parsed &&
      typeof (parsed as { message?: unknown }).message === "string"
        ? (parsed as { message: string }).message
        : `HTTP ${response.status}`;
    throw new Error(msg);
  }

  return parsed;
}
