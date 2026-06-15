import { WP_PAGES_CLIENT_BASE } from "./config";
import { WP_PAGES_UPSTREAM } from "./config";
import { wpUpstreamPageFetch } from "./wpUpstreamFetch";
import type { GlavnayaAcf, WpPageEnvelope } from "./types";

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(text || res.statusText || "Invalid JSON");
  }
}

export async function getGlavnayaPage(): Promise<WpPageEnvelope<GlavnayaAcf>> {
  const res = await fetch(`${WP_PAGES_CLIENT_BASE}/glavnaya/`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Главная: ${res.status} ${res.statusText}`);
  }
  return parseJson<WpPageEnvelope<GlavnayaAcf>>(res);
}

export async function getGlavnayaPageServer(): Promise<WpPageEnvelope<GlavnayaAcf>> {
  const base = WP_PAGES_UPSTREAM.replace(/\/$/, "");
  const res = await wpUpstreamPageFetch(`${base}/glavnaya/`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Главная: ${res.status} ${res.statusText}`);
  }
  return parseJson<WpPageEnvelope<GlavnayaAcf>>(res);
}

async function getWpPage<TAcf extends Record<string, unknown> = Record<string, unknown>>(
  path: string,
): Promise<WpPageEnvelope<TAcf>> {
  const safePath = path.startsWith("/") ? path.slice(1) : path;
  const url = `${WP_PAGES_CLIENT_BASE}/${safePath}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`${path}: ${res.status} ${res.statusText}`);
  }
  const contentType = res.headers.get("Content-Type") ?? "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    throw new Error(`${path}: expected JSON, got ${contentType}. Head: ${text.slice(0, 120)}`);
  }
  return parseJson<WpPageEnvelope<TAcf>>(res);
}

export function getArticle(slug: string) {
  return getWpPage(`article/${slug}`);
}

export function getNewsBySlug(slug: string) {
  return getWpPage(`news/${slug}`);
}

export function getContactBySlug(slug: string) {
  return getWpPage(`contact/${slug}`);
}

export function getShop() {
  return getWpPage("shop");
}

export function getProductBySlug(slug: string) {
  return getWpPage(`product/${slug}`);
}

export function getAboutUsBySlug(slug: string) {
  return getWpPage(`about-us/${slug}`);
}

export function getQuestionAnswerBySlug(slug: string) {
  return getWpPage(`question-answer/${slug}`);
}

export function getOurClientBySlug(slug: string) {
  return getWpPage(`our_client/${slug}`);
}

export function getFeedbackBySlug(slug: string) {
  return getWpPage(`feedback/${slug}`);
}

export function getToSuppliersBySlug(slug: string) {
  return getWpPage(`to-suppliers/${slug}`);
}

export function getCompanyOfficeBySlug(slug: string) {
  return getWpPage(`company-office/${slug}`);
}

export function getProjectBySlug(slug: string) {
  return getWpPage(`project/${slug}`);
}

