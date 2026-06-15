import { WP_PAGES_CLIENT_BASE } from "./config";

type WpRenderedField = {
  rendered?: string;
};

type WpOurClientItemResponse = {
  id: number;
  slug?: string;
  title?: WpRenderedField;
};

export type OurClientItem = {
  id: number;
  name: string;
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

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(text || res.statusText || "Invalid JSON");
  }
}

export async function getOurClientList(): Promise<OurClientItem[]> {
  const res = await fetch(`${WP_PAGES_CLIENT_BASE}/wp-json/wp/v2/our_client`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Our clients: ${res.status} ${res.statusText}`);
  }

  const payload = await parseJson<WpOurClientItemResponse[]>(res);
  return payload.map((item) => {
    const rawName = item.title?.rendered ?? item.slug ?? `client-${item.id}`;
    return {
      id: item.id,
      name: decodeEntities(stripHtml(rawName)),
    };
  });
}
