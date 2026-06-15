/**
 * Кэш одноразового кода WordPress REST (`X-WP-Nonce`) для WooCommerce Store API.
 * Берётся через `/api/wc/nonce` (сервер парсит HTML upstream).
 */
let cache: { value: string; at: number } | null = null;

const TTL_MS = 10 * 60 * 1000;

export async function getWpRestNonce(): Promise<string | null> {
  if (cache && Date.now() - cache.at < TTL_MS) {
    return cache.value;
  }
  try {
    const res = await fetch("/api/wc/nonce", { credentials: "omit" });
    if (!res.ok) return null;
    const data = (await res.json()) as { nonce?: string };
    if (typeof data.nonce === "string" && data.nonce.length >= 8) {
      cache = { value: data.nonce, at: Date.now() };
      return data.nonce;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function invalidateWpRestNonceCache(): void {
  cache = null;
}
