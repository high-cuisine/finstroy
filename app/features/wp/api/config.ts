/**
 * Upstream WordPress-like JSON endpoint base (server-side / proxy target).
 * Optional env: `WP_UPSTREAM_CONNECT_TIMEOUT_MS` — connect timeout for `/api/wp` proxy (default 45000).
 */
export const WP_PAGES_UPSTREAM =
  process.env.WP_PAGES_UPSTREAM ??
  process.env.NEXT_PUBLIC_WP_PAGES_UPSTREAM ??
  "https://wp.finstroi.com";

/**
 * Base URL for client-side fetch. Uses Next.js proxy to avoid CORS.
 * Same-origin: `/api/wp` → forwards to `WP_PAGES_UPSTREAM`.
 */
export const WP_PAGES_CLIENT_BASE = "/api/wp";

/**
 * REST WordPress через тот же прокси, что и страницы/каталог товаров:
 * `GET /api/wp/wp-json/wp/v2/product` → upstream `…/wp-json/wp/v2/product`.
 *
 * База для путей вида `/wc/store/v1/cart`, `/jwt-auth/v1/token`, …
 */
export const WP_JSON_FETCH_BASE = `${WP_PAGES_CLIENT_BASE}/wp-json`;

/** Устаревший отдельный прокси `/api/wp-json` — см. `app/api/wp-json/[...path]`. */
export const WP_JSON_CLIENT_BASE = "/api/wp-json";
