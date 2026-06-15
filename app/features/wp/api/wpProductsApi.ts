import { WP_JSON_FETCH_BASE } from "./config";

// ── Store API types ───────────────────────────────────────────────────────────

type WcStorePrices = {
  price?: string;
  regular_price?: string;
  currency_minor_unit?: number;
};

type WcStoreImage = {
  id?: number;
  src?: string;
  thumbnail?: string;
  srcset?: string;
  sizes?: string;
  name?: string;
  alt?: string;
};

type WcStoreCategory = {
  id?: number;
  name?: string;
  slug?: string;
  parent?: number;
};

type WcStoreProduct = {
  id: number;
  name?: string;
  slug?: string;
  short_description?: string;
  description?: string;
  prices?: WcStorePrices;
  images?: WcStoreImage[];
  categories?: WcStoreCategory[];
};

// ── Public types ──────────────────────────────────────────────────────────────

export type ProductImage = {
  id: number;
  src: string;
  thumbnail: string;
  srcset?: string;
  sizes?: string;
  alt: string;
};

export type ProductCatalogItem = {
  id: string;
  title: string;
  meta: string;
  description: string;
  price: number | null;
  categoryId: string;
  imageUrl: string | null;
  images: ProductImage[];
};

export type ProductCatalogQuery = {
  search?: string;
  page?: number;
  perPage?: number;
  categorySlug?: string;
  categoryId?: string;
  signal?: AbortSignal;
};

export type ProductCatalogResult = {
  items: ProductCatalogItem[];
  total: number;
  totalPages: number;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function parseStorePrice(prices: WcStorePrices | undefined): number | null {
  if (!prices?.price) return null;
  const minor = prices.currency_minor_unit ?? 2;
  const raw = parseFloat(prices.price);
  if (!isFinite(raw)) return null;
  return raw / Math.pow(10, minor);
}

function mapStoreImages(images: WcStoreImage[] | undefined): ProductImage[] {
  if (!Array.isArray(images)) return [];

  const result: ProductImage[] = [];
  images.forEach((image, index) => {
    const src = image.src?.trim() ?? "";
    if (!src) return;
    result.push({
      id: image.id ?? index,
      src,
      thumbnail: image.thumbnail?.trim() || src,
      srcset: image.srcset,
      sizes: image.sizes,
      alt: decodeEntities(image.alt ?? image.name ?? ""),
    });
  });
  return result;
}

function mapStoreProduct(item: WcStoreProduct): ProductCatalogItem {
  const title = decodeEntities(item.name ?? item.slug ?? `product-${item.id}`);
  const meta = decodeEntities(stripHtml(item.short_description ?? "В наличии")) || "В наличии";
  const images = mapStoreImages(item.images);
  const categoryId = item.categories?.[0]?.id ? String(item.categories[0].id) : "all";

  return {
    id: String(item.id),
    title,
    meta,
    description: item.description ?? "",
    price: parseStorePrice(item.prices),
    categoryId,
    imageUrl: images[0]?.src ?? null,
    images,
  };
}

function buildStoreUrl(query: ProductCatalogQuery): string {
  const url = new URL(`${WP_JSON_FETCH_BASE}/wc/store/v1/products`, "http://local");
  url.searchParams.set("per_page", String(query.perPage ?? 100));
  url.searchParams.set("page", String(query.page ?? 1));
  const search = query.search?.trim();
  if (search) url.searchParams.set("search", search);
  if (query.categorySlug) {
    url.searchParams.set("category", query.categorySlug);
  } else if (query.categoryId) {
    url.searchParams.set("category", query.categoryId);
  }
  return `${url.pathname}${url.search}`;
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function fetchProductCategories(): Promise<
  { id: string; label: string; slug?: string; parentId?: string }[]
> {
  const url = new URL(`${WP_JSON_FETCH_BASE}/wc/store/v1/products/categories`, "http://local");
  url.searchParams.set("per_page", "100");
  const res = await fetch(`${url.pathname}${url.search}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Категории: ${res.status}`);
  const payload = await parseJson<WcStoreCategory[]>(res);
  return payload.map((cat) => ({
    id: String(cat.id),
    label: decodeEntities(cat.name ?? cat.slug ?? String(cat.id)),
    slug: cat.slug,
    parentId: cat.parent && cat.parent > 0 ? String(cat.parent) : undefined,
  }));
}

// ── Products ──────────────────────────────────────────────────────────────────

export async function fetchProductCatalog(
  query: ProductCatalogQuery = {},
): Promise<ProductCatalogResult> {
  const res = await fetch(buildStoreUrl(query), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: query.signal,
  });

  if (!res.ok) {
    throw new Error(`Products: ${res.status} ${res.statusText}`);
  }

  const payload = await parseJson<WcStoreProduct[]>(res);
  const total = Number(res.headers.get("X-WP-Total") ?? payload.length);
  const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? 1);

  return {
    items: payload.map(mapStoreProduct),
    total,
    totalPages,
  };
}

/** Загружает товары категории: сначала через API (slug/id), затем фильтрация по categoryId в JSON. */
export async function fetchProductsByCategoryId(
  categoryId: string,
  query: ProductCatalogQuery & { slug?: string } = {},
): Promise<ProductCatalogResult> {
  const { slug, ...rest } = query;
  const attempts: ProductCatalogQuery[] = [];

  if (slug) attempts.push({ ...rest, categorySlug: slug });
  attempts.push({ ...rest, categoryId });

  for (const attempt of attempts) {
    try {
      const result = await fetchProductCatalog(attempt);
      const filtered = result.items.filter((item) => item.categoryId === categoryId);
      if (filtered.length > 0) {
        return {
          items: filtered,
          total: filtered.length,
          totalPages: 1,
        };
      }
      if (result.items.length > 0) {
        return {
          items: result.items,
          total: result.total,
          totalPages: result.totalPages,
        };
      }
    } catch {
      // try next strategy
    }
  }

  const all = await getProductCatalogItems(rest);
  const filtered = all.filter((item) => item.categoryId === categoryId);
  return {
    items: filtered,
    total: filtered.length,
    totalPages: 1,
  };
}

export async function getProductCatalogItems(
  query: ProductCatalogQuery = {},
): Promise<ProductCatalogItem[]> {
  const perPage = query.perPage ?? 100;
  const firstPage = await fetchProductCatalog({ ...query, perPage, page: 1 });

  if (firstPage.totalPages <= 1) {
    return firstPage.items;
  }

  const restPages = await Promise.all(
    Array.from({ length: firstPage.totalPages - 1 }, (_, i) =>
      fetchProductCatalog({ ...query, perPage, page: i + 2, signal: query.signal }),
    ),
  );

  return [...firstPage.items, ...restPages.flatMap((p) => p.items)];
}

export async function fetchProductById(id: number): Promise<ProductCatalogItem | null> {
  const url = new URL(`${WP_JSON_FETCH_BASE}/wc/store/v1/products`, "http://local");
  url.searchParams.set("include", String(id));
  url.searchParams.set("per_page", "1");
  const res = await fetch(`${url.pathname}${url.search}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const payload = await parseJson<WcStoreProduct[]>(res);
  const item = payload[0];
  return item ? mapStoreProduct(item) : null;
}

type WpRestProduct = {
  id: number;
  acf?: {
    dobavit_kalkulyator?: boolean | string | number;
  };
};

/** Returns IDs of all products that have ACF dobavit_kalkulyator === true. */
export async function fetchCalculatorProductIds(): Promise<Set<number>> {
  const url = new URL(`${WP_JSON_FETCH_BASE}/wp/v2/product`, "http://local");
  url.searchParams.set("per_page", "100");
  url.searchParams.set("_fields", "id,acf");
  url.searchParams.set("acf_format", "standard");

  const res = await fetch(`${url.pathname}${url.search}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return new Set();

  const payload = await parseJson<WpRestProduct[]>(res);
  const ids = new Set<number>();
  for (const p of payload) {
    if (
      p.acf?.dobavit_kalkulyator === true ||
      p.acf?.dobavit_kalkulyator === 1 ||
      p.acf?.dobavit_kalkulyator === "1"
    ) {
      ids.add(p.id);
    }
  }
  return ids;
}

/** Находит первый WooCommerce-товар с ACF полем dobavit_kalkulyator === true. */
export async function fetchCalculatorProductId(): Promise<number | null> {
  const url = new URL(
    `${WP_JSON_FETCH_BASE}/wp/v2/product`,
    "http://local",
  );
  url.searchParams.set("per_page", "100");
  url.searchParams.set("_fields", "id,acf");
  url.searchParams.set("acf_format", "standard");

  const res = await fetch(`${url.pathname}${url.search}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return null;

  const payload = await parseJson<WpRestProduct[]>(res);
  const match = payload.find(
    (p) => p.acf?.dobavit_kalkulyator === true ||
           p.acf?.dobavit_kalkulyator === 1 ||
           p.acf?.dobavit_kalkulyator === "1",
  );
  return match?.id ?? null;
}

type WcStoreProductDetail = {
  id: number;
  type?: string;
  variations?: number[];
};

/** Returns the first variation ID for a variable product, or null if simple/not found. */
export async function fetchStoreProductFirstVariationId(
  productId: number,
): Promise<number | null> {
  const url = new URL(
    `${WP_JSON_FETCH_BASE}/wc/store/v1/products/${productId}`,
    "http://local",
  );
  const res = await fetch(`${url.pathname}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await parseJson<WcStoreProductDetail>(res);
  if (data.type === "variable" && Array.isArray(data.variations) && data.variations.length > 0) {
    return data.variations[0];
  }
  return null;
}

export async function fetchStoreProductImageMap(
  productIds: number[],
): Promise<Record<number, string>> {
  const uniqueIds = [...new Set(productIds.filter((id) => Number.isFinite(id) && id > 0))];
  if (uniqueIds.length === 0) return {};

  const url = new URL(`${WP_JSON_FETCH_BASE}/wc/store/v1/products`, "http://local");
  url.searchParams.set("include", uniqueIds.join(","));
  url.searchParams.set("per_page", String(uniqueIds.length));

  const res = await fetch(`${url.pathname}${url.search}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) return {};

  const payload = await parseJson<WcStoreProduct[]>(res);
  const map: Record<number, string> = {};
  for (const product of payload) {
    const image = product.images?.[0];
    const src = image?.src ?? image?.thumbnail;
    if (product.id > 0 && src) {
      map[product.id] = src;
    }
  }
  return map;
}
