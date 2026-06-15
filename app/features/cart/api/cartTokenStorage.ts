const STORAGE_KEY = "finstroy_wc_store_cart_token";

export function getStoredCartToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v && v.length > 0 ? v : null;
  } catch {
    return null;
  }
}

export function setStoredCartToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token && token.length > 0) localStorage.setItem(STORAGE_KEY, token);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* quota / private mode */
  }
}

/** Сохраняет `Cart-Token` из заголовков ответа WooCommerce Store API. */
export function persistCartTokenFromResponse(res: Response): void {
  const raw = res.headers.get("Cart-Token") ?? res.headers.get("cart-token");
  if (raw && raw.length > 0) setStoredCartToken(raw.trim());
}
