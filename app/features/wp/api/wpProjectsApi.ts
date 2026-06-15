import { WP_PAGES_UPSTREAM } from "./config";
import type { WpPageEnvelope } from "./types";

type WpRenderedField = {
  rendered?: string;
};

type WpProjectItemResponse = {
  id: number;
  slug: string;
  date?: string;
  title?: WpRenderedField;
  content?: WpRenderedField;
};

export type ProjectListItem = {
  id: string;
  slug: string;
  date: string;
  title: string;
  imageSrc: string;
  description: string;
};

export type ProjectDetailItem = {
  slug: string;
  date: string;
  title: string;
  description: string;
  content: string;
  imageSrc: string;
};

const projectPlaceholderSvg = encodeURIComponent(`
<svg width="1200" height="800" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#15161B"/>
      <stop offset="0.55" stop-color="#0F1014"/>
      <stop offset="1" stop-color="#15161B"/>
    </linearGradient>
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(860 210) rotate(135) scale(520 420)">
      <stop stop-color="#006F3D" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#006F3D" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#bg)"/>
  <rect width="1200" height="800" fill="url(#glow)"/>
  <text x="120" y="180" fill="rgba(255,255,255,0.55)" font-family="Inter, system-ui, -apple-system" font-size="30" font-weight="600">Проект</text>
</svg>
`).trim();

const projectPlaceholderDataUri = `data:image/svg+xml,${projectPlaceholderSvg}`;

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

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(text || res.statusText || "Invalid JSON");
  }
}

export async function getProjectList(): Promise<ProjectListItem[]> {
  const base = WP_PAGES_UPSTREAM.replace(/\/$/, "");
  const res = await fetch(`${base}/wp-json/wp/v2/project`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Projects: ${res.status} ${res.statusText}`);
  }

  const payload = await parseJson<WpProjectItemResponse[]>(res);

  return payload.map((item) => {
    const title = decodeEntities(stripHtml(item.title?.rendered ?? item.slug));
    const description = decodeEntities(stripHtml(item.content?.rendered ?? ""));

    return {
      id: String(item.id),
      slug: item.slug,
      date: formatDate(item.date),
      title,
      imageSrc: projectPlaceholderDataUri,
      description,
    };
  });
}

export async function getProjectBySlugFromPage(slug: string): Promise<ProjectDetailItem | null> {
  const base = WP_PAGES_UPSTREAM.replace(/\/$/, "");
  const res = await fetch(`${base}/project/${slug}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`Project ${slug}: ${res.status} ${res.statusText}`);
  }

  const contentType = res.headers.get("Content-Type") ?? "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    throw new Error(`Project ${slug}: expected JSON, got ${contentType}. Head: ${text.slice(0, 120)}`);
  }

  const payload = await parseJson<WpPageEnvelope<Record<string, unknown>>>(res);
  const entity = payload.data?.entity;
  if (!entity) {
    return null;
  }

  return {
    slug: entity.slug,
    date: formatDate(entity.date_gmt),
    title: decodeEntities(stripHtml(entity.title || slug)),
    description: decodeEntities(stripHtml(entity.excerpt || "")),
    content: entity.content || "",
    imageSrc: projectPlaceholderDataUri,
  };
}
