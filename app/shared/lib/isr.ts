/**
 * Общий интервал ревалидации (ISR) для серверных страниц, которые тянут
 * данные из WP через `wpUpstreamPageFetch` (сырой `undici.fetch`, не
 * отслеживается кэшем данных Next.js). Без `export const revalidate` в
 * самой странице такие роуты остаются статическими навсегда — обновляются
 * только при передеплое.
 *
 * Env: `ISR_REVALIDATE_SECONDS` (секунды). По умолчанию 180 (3 мин).
 *
 * В `page.tsx` нужно inline-выражение — Next.js 16 не принимает импортированную
 * константу в segment config:
 * `export const revalidate = Number(process.env.ISR_REVALIDATE_SECONDS ?? 180);`
 */
export const DEFAULT_ISR_REVALIDATE_SECONDS = 180;

function parseIsrRevalidateSeconds(raw: string | undefined): number {
  if (raw == null || raw.trim() === "") return DEFAULT_ISR_REVALIDATE_SECONDS;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 0) return DEFAULT_ISR_REVALIDATE_SECONDS;
  return n;
}

/** Parsed ISR interval for runtime use outside segment config. */
export const CONTENT_REVALIDATE_SECONDS = parseIsrRevalidateSeconds(
  process.env.ISR_REVALIDATE_SECONDS,
);
