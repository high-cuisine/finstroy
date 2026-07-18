/**
 * Общий интервал ревалидации (ISR) для серверных страниц, которые тянут
 * данные из WP через `wpUpstreamPageFetch` (сырой `undici.fetch`, не
 * отслеживается кэшем данных Next.js). Без `export const revalidate` в
 * самой странице такие роуты остаются статическими навсегда — обновляются
 * только при передеплое.
 *
 * В `page.tsx` нужен литерал: `export const revalidate = 180` — Next.js 16
 * не принимает импортированную константу в segment config.
 */
export const CONTENT_REVALIDATE_SECONDS = 180;
