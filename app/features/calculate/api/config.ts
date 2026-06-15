/** Upstream WordPress REST base (server-side / proxy target). */
export const CUBIC_CALCULATOR_UPSTREAM =
  process.env.CUBIC_CALCULATOR_UPSTREAM ??
  process.env.NEXT_PUBLIC_CUBIC_CALCULATOR_BASE ??
  'https://wp.finstroi.com/wp-json/cubic-calculator/v1';

/**
 * Base URL for client-side fetch. Uses Next.js proxy to avoid CORS.
 * Same-origin: `/api/cubic-calculator` → forwards to `CUBIC_CALCULATOR_UPSTREAM`.
 */
export const CUBIC_CALCULATOR_CLIENT_BASE = '/api/cubic-calculator';
