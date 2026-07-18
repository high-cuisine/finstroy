import { WP_JSON_FETCH_BASE } from "./config";

type WpRenderedField = {
  rendered?: string;
};

type WpVacancyAcf = {
  otdel?: string;
  gorod?: string;
  type_of_zanyatostb?: string;
  kontakt?: string;
};

type WpVacancyRest = {
  id: number;
  slug?: string;
  title?: WpRenderedField;
  acf?: WpVacancyAcf | null;
};

export type VacancyItem = {
  id: number;
  title: string;
  dept: string;
  city: string;
  employmentType: string;
  contact: string;
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

function cleanText(value: unknown): string {
  if (typeof value !== "string") return "";
  return decodeEntities(stripHtml(value));
}

export async function fetchVacancies(): Promise<VacancyItem[]> {
  const url = `${WP_JSON_FETCH_BASE}/wp/v2/vacansii?per_page=100`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Вакансии: ${res.status} ${res.statusText}`);
  }

  const payload = (await res.json()) as WpVacancyRest[];
  if (!Array.isArray(payload)) return [];

  return payload.map((item) => {
    const acf = item.acf ?? {};
    const rawTitle = item.title?.rendered ?? item.slug ?? `vacancy-${item.id}`;
    return {
      id: item.id,
      title: cleanText(rawTitle),
      dept: cleanText(acf.otdel),
      city: cleanText(acf.gorod),
      employmentType: cleanText(acf.type_of_zanyatostb),
      contact: cleanText(acf.kontakt),
    };
  });
}
