import { WP_JSON_FETCH_BASE } from "@/app/features/wp/api/config";
import { useUserStore } from "@/app/features/user/store/useUserStore";
import {
  getStoredCartToken,
  persistCartTokenFromResponse,
} from "./cartTokenStorage";
import { getWpRestNonce, invalidateWpRestNonceCache } from "./wpRestNonce";

function invalidateNonceFromResponseBody(text: string): void {
  try {
    const j = JSON.parse(text) as { code?: string };
    if (
      j?.code === "woocommerce_rest_missing_nonce" ||
      j?.code === "rest_cookie_invalid_nonce"
    ) {
      invalidateWpRestNonceCache();
    }
  } catch {
    /* ignore */
  }
}

const BASE = `${WP_JSON_FETCH_BASE}/wc/store/v1`;

async function buildCartHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const token = useUserStore.getState().token;
  if (token) headers.Authorization = `Bearer ${token}`;
  const nonce = await getWpRestNonce();
  if (nonce) headers["X-WP-Nonce"] = nonce;
  const cartToken = getStoredCartToken();
  if (cartToken) headers["Cart-Token"] = cartToken;
  return headers;
}

const fetchOpts: Pick<RequestInit, "credentials"> = { credentials: "include" };

/**
 * Один повтор при 401 / неверном nonce: сброс кэша nonce, второй запрос с новым заголовком.
 */
async function storeCartRequestWithNonceRetry(
  doFetch: () => Promise<Response>,
): Promise<Response> {
  let res = await doFetch();
  if (res.ok) return res;
  const firstBody = await res.text();
  invalidateNonceFromResponseBody(firstBody);
  res = await doFetch();
  if (!res.ok) {
    const secondBody = await res.text();
    return new Response(secondBody, {
      status: res.status,
      statusText: res.statusText,
    });
  }
  return res;
}

export async function parseErrorMessage(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const j = JSON.parse(text) as { message?: string; code?: string };
    if (
      j?.code === "woocommerce_rest_missing_nonce" ||
      j?.code === "rest_cookie_invalid_nonce"
    ) {
      invalidateWpRestNonceCache();
    }
    if (typeof j?.message === "string") return j.message;
  } catch {
    /* ignore */
  }
  return text || `HTTP ${res.status}`;
}

export async function fetchStoreCart(): Promise<Response> {
  const headers = await buildCartHeaders();
  const res = await fetch(`${BASE}/cart`, {
    method: "GET",
    headers,
    ...fetchOpts,
  });
  if (res.ok) persistCartTokenFromResponse(res);
  return res;
}

/** Повтор при 401 из‑за nonce: кэш сбрасывается, второй запрос берёт свежий nonce. */
export async function fetchStoreCartWithNonceRetry(): Promise<Response> {
  return storeCartRequestWithNonceRetry(() => fetchStoreCart());
}

export async function addItemToStoreCart(
  productId: number,
  quantity = 1,
): Promise<Response> {
  const res = await storeCartRequestWithNonceRetry(async () => {
    const headers = await buildCartHeaders();
    return fetch(`${BASE}/cart/add-item`, {
      method: "POST",
      headers,
      body: JSON.stringify({ id: productId, quantity: Math.round(quantity) }),
      ...fetchOpts,
    });
  });
  if (res.ok) persistCartTokenFromResponse(res);
  return res;
}

export async function updateStoreCartItem(
  key: string,
  quantity: number,
): Promise<Response> {
  const res = await storeCartRequestWithNonceRetry(async () => {
    const headers = await buildCartHeaders();
    return fetch(`${BASE}/cart/update-item`, {
      method: "POST",
      headers,
      body: JSON.stringify({ key, quantity: Math.round(quantity) }),
      ...fetchOpts,
    });
  });
  if (res.ok) persistCartTokenFromResponse(res);
  return res;
}

export async function removeStoreCartItem(key: string): Promise<Response> {
  const res = await storeCartRequestWithNonceRetry(async () => {
    const headers = await buildCartHeaders();
    return fetch(`${BASE}/cart/remove-item`, {
      method: "POST",
      headers,
      body: JSON.stringify({ key }),
      ...fetchOpts,
    });
  });
  if (res.ok) persistCartTokenFromResponse(res);
  return res;
}

/**
 * POST `/wc/store/v1/checkout` — оформление корзины (Store API).
 * Тело зависит от настроек WooCommerce (адреса, способ оплаты и т.д.).
 */
export async function postStoreCheckout(
  body: Record<string, unknown> = {},
): Promise<Response> {
  const payload = JSON.stringify(body);
  return storeCartRequestWithNonceRetry(async () => {
    const headers = await buildCartHeaders();
    return fetch(`${BASE}/checkout`, {
      method: "POST",
      headers,
      body: payload,
      ...fetchOpts,
    });
  });
}
