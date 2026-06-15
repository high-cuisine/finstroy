export const UNLOCK_GATE_COOKIE = "unlock_gate";

const GATE_PAYLOAD = "unlock_gate";

export function getUnlockGateSecret(): string {
  return process.env.UNLOCK_GATE_SECRET ?? "";
}

export function getUnlockGateCredentials(): { username: string; password: string } {
  return {
    username: process.env.UNLOCK_GATE_USERNAME ?? "",
    password: process.env.UNLOCK_GATE_PASSWORD ?? "",
  };
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqualStrings(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

export async function signUnlockGateToken(secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(GATE_PAYLOAD));
  return bytesToHex(new Uint8Array(signature));
}

export async function isValidUnlockGateToken(
  token: string | undefined,
  secret: string,
): Promise<boolean> {
  if (!token || !secret) return false;
  try {
    const expected = await signUnlockGateToken(secret);
    return timingSafeEqualStrings(token, expected);
  } catch {
    return false;
  }
}

export function isUnlockGateConfigured(): boolean {
  const secret = getUnlockGateSecret();
  const { username, password } = getUnlockGateCredentials();
  return Boolean(secret && username && password);
}
