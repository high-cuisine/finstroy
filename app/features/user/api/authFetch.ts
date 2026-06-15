import { useUserStore } from "../store/useUserStore";

/**
 * Fetch к `/wp-json` с Bearer из Zustand. При 401 сессия сбрасывается.
 */
export async function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const token = useUserStore.getState().token;
  const headers = new Headers(init?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(input, { ...init, headers });
  if (res.status === 401) {
    useUserStore.getState().logout();
  }
  return res;
}
