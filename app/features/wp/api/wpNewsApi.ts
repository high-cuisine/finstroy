import { WP_PAGES_UPSTREAM } from "./config";
import { wpUpstreamPageFetch } from "./wpUpstreamFetch";

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

type WpNewsItemResponse = {
  id: number;
  date?: string;
  slug?: string;
  title?: WpRenderedField;
  excerpt?: WpRenderedField;
  content?: WpRenderedField;
  featured_media?: number;
  _embedded?: {
    "wp:featuredmedia"?: WpFeaturedMedia[];
  };
};

export type NewsListItem = {
  id: number;
  date: string;
  title: string;
  image: string | null;
};

export type NewsDetailItem = NewsListItem & {
  body: string[];
};

function featuredImageSrc(item: WpNewsItemResponse): string | undefined {
  const media = item._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) {
    return undefined;
  }

  return (
    media.source_url ||
    media.media_details?.sizes?.large?.source_url ||
    media.media_details?.sizes?.medium_large?.source_url ||
    media.guid?.rendered
  );
}

function resolveNewsImage(item: WpNewsItemResponse): string | null {
  return featuredImageSrc(item) ?? null;
}

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

function formatDate(dateValue?: string): string {
  if (!dateValue) {
    return "";
  }
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function toParagraphs(contentHtml: string): string[] {
  return contentHtml
    .replace(/<\/p>\s*<p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n\n")
    .map((line) => decodeEntities(line.trim()))
    .filter(Boolean);
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(text || res.statusText || "Invalid JSON");
  }
}

export async function getNewsList(): Promise<NewsListItem[]> {
  const base = WP_PAGES_UPSTREAM.replace(/\/$/, "");
  const url = new URL(`${base}/wp-json/wp/v2/news`);
  url.searchParams.set("_embed", "wp:featuredmedia");

  const res = await wpUpstreamPageFetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`News: ${res.status} ${res.statusText}`);
  }

  const payload = await parseJson<WpNewsItemResponse[]>(res);
  return payload.map((item, index) => ({
    id: item.id,
    date: formatDate(item.date),
    title: decodeEntities(stripHtml(item.title?.rendered ?? item.slug ?? `news-${item.id}`)),
    image: resolveNewsImage(item),
  }));
}

export async function getNewsById(id: number): Promise<NewsDetailItem | null> {
  const base = WP_PAGES_UPSTREAM.replace(/\/$/, "");
  const url = new URL(`${base}/wp-json/wp/v2/news/${id}`);
  url.searchParams.set("_embed", "wp:featuredmedia");

  const res = await wpUpstreamPageFetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`News ${id}: ${res.status} ${res.statusText}`);
  }

  const item = await parseJson<WpNewsItemResponse>(res);
  return {
    id: item.id,
    date: formatDate(item.date),
    title: decodeEntities(stripHtml(item.title?.rendered ?? item.slug ?? `news-${item.id}`)),
    image: resolveNewsImage(item),
    body: toParagraphs(item.content?.rendered ?? item.excerpt?.rendered ?? ""),
  };
}
