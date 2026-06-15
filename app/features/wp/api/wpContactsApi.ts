import { WP_JSON_FETCH_BASE } from "./config";
export * from "./wpContactsHelpers";
import {
  normalizeContactPost,
  type WpContactItem,
  type WpContactRest,
} from "./wpContactsHelpers";

export async function fetchContactPosts(): Promise<WpContactItem[]> {
  const url = `${WP_JSON_FETCH_BASE}/wp/v2/contact?per_page=100&orderby=title&order=asc`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Контакты: ${res.status} ${res.statusText}`);
  }
  const payload = (await res.json()) as WpContactRest[];
  if (!Array.isArray(payload)) return [];
  return payload.map(normalizeContactPost);
}
