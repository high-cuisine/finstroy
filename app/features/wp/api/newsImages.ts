export const NEWS_FALLBACK_IMAGES = [
  "/images/news-1.png",
  "/images/news-2.png",
  "/images/news-3.png",
  "/images/news-4.png",
] as const;

export function newsFallbackImage(index: number): string {
  return NEWS_FALLBACK_IMAGES[index % NEWS_FALLBACK_IMAGES.length]!;
}
