import { WP_JSON_FETCH_BASE } from "@/app/features/wp/api/config";
import { authFetch } from "./authFetch";
import type { WpRestCurrentUser } from "./types";

export async function fetchWpCurrentUser(): Promise<WpRestCurrentUser | null> {
  const res = await authFetch(`${WP_JSON_FETCH_BASE}/wp/v2/users/me?context=edit`);
  if (res.status === 401) return null;
  if (!res.ok) return null;
  try {
    return (await res.json()) as WpRestCurrentUser;
  } catch {
    return null;
  }
}
