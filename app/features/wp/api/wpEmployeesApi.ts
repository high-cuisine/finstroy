import { WP_JSON_FETCH_BASE } from "./config";

type WpRenderedField = {
  rendered?: string;
};

type WpFeaturedMedia = {
  source_url?: string;
  guid?: WpRenderedField;
  media_details?: {
    sizes?: Record<string, { source_url?: string }>;
  };
};

type WpEmployeeRest = {
  id: number;
  slug?: string;
  title?: WpRenderedField;
  featured_media?: number;
  _embedded?: {
    "wp:featuredmedia"?: WpFeaturedMedia[];
  };
};

export type EmployeeItem = {
  id: number;
  name: string;
  imageSrc: string | null;
};

function stripHtml(input: string): string {
  return input.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function decodeEntities(input: string): string {
  return input
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function featuredImageSrc(item: WpEmployeeRest): string | null {
  const media = item._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return null;

  const url =
    media.source_url ||
    media.media_details?.sizes?.large?.source_url ||
    media.media_details?.sizes?.medium_large?.source_url ||
    media.media_details?.sizes?.medium?.source_url ||
    media.guid?.rendered;

  return url ? decodeEntities(url) : null;
}

export async function fetchEmployees(): Promise<EmployeeItem[]> {
  const url = `${WP_JSON_FETCH_BASE}/wp/v2/sotrugniki?per_page=100&_embed=wp:featuredmedia`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Сотрудники: ${res.status} ${res.statusText}`);
  }

  const payload = (await res.json()) as WpEmployeeRest[];
  if (!Array.isArray(payload)) return [];

  return payload.map((item) => {
    const rawName = item.title?.rendered ?? item.slug ?? `employee-${item.id}`;
    return {
      id: item.id,
      name: decodeEntities(stripHtml(rawName)),
      imageSrc: featuredImageSrc(item),
    };
  });
}
