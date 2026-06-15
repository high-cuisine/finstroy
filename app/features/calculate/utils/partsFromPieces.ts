import type { CuttingPart } from '../api/types';

/**
 * Собирает `parts` для POST /cutting из строк правой панели.
 * Одинаковые пары width×height схлопываются в одну запись с суммой quantity.
 */
export function partsFromPieces(
  pieces: { width: number; height: number; quantity?: number }[]
): CuttingPart[] {
  const counts = new Map<string, number>();
  for (const p of pieces) {
    if (p.width <= 0 || p.height <= 0) continue;
    const qRaw = p.quantity != null ? Math.floor(p.quantity) : 1;
    const q = qRaw > 0 ? Math.min(10000, qRaw) : 0;
    if (q <= 0) continue;
    const key = `${p.width}x${p.height}`;
    counts.set(key, (counts.get(key) ?? 0) + q);
  }
  const out: CuttingPart[] = [];
  for (const [key, quantity] of counts) {
    const [w, h] = key.split('x').map(Number);
    out.push({ width: w, height: h, quantity });
  }
  return out;
}
