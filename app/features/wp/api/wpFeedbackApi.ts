import { WP_PAGES_CLIENT_BASE } from "./config";

type WpRenderedField = {
  rendered?: string;
};

type WpFeedbackItemResponse = {
  id: number;
  slug?: string;
  link?: string;
  title?: WpRenderedField;
  content?: WpRenderedField;
};

export type FeedbackItem = {
  id: number;
  company: string;
  imageUrl: string;
  sourceUrl?: string;
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

function extractImageUrl(contentHtml: string): string | null {
  const srcMatch = contentHtml.match(/<img[^>]*src=["']([^"']+)["']/i);
  if (!srcMatch?.[1]) {
    return null;
  }
  return srcMatch[1].trim();
}

function normalizeImageUrl(url: string): string {
  if (url.startsWith("http://")) {
    return `https://${url.slice("http://".length)}`;
  }
  return url;
}

function toFeedbackItem(raw: WpFeedbackItemResponse): FeedbackItem | null {
  const companyRaw = raw.title?.rendered ?? raw.slug ?? `feedback-${raw.id}`;
  const company = decodeEntities(stripHtml(companyRaw));
  const imageUrl = extractImageUrl(raw.content?.rendered ?? "");

  if (!imageUrl) {
    return null;
  }

  return {
    id: raw.id,
    company,
    imageUrl: normalizeImageUrl(imageUrl),
    sourceUrl: raw.link,
  };
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(text || res.statusText || "Invalid JSON");
  }
}

export async function getFeedbackList(): Promise<FeedbackItem[]> {
  const res = await fetch(`${WP_PAGES_CLIENT_BASE}/wp-json/wp/v2/feedback`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Feedback list: ${res.status} ${res.statusText}`);
  }

  const payload = await parseJson<WpFeedbackItemResponse[]>(res);

  return payload
    .map(toFeedbackItem)
    .filter((item): item is FeedbackItem => Boolean(item));
}
