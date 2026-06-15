import { WP_PAGES_UPSTREAM } from "./config";
import {
  normalizeContactPost,
  type WpContactItem,
  type WpContactRest,
} from "./wpContactsHelpers";
import { wpUpstreamPageFetch } from "./wpUpstreamFetch";

export async function fetchContactPostsServer(): Promise<WpContactItem[]> {
  const base = WP_PAGES_UPSTREAM.replace(/\/$/, "");
  const url = `${base}/wp-json/wp/v2/contact?per_page=100&orderby=title&order=asc`;
  const res = await wpUpstreamPageFetch(url, {
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
