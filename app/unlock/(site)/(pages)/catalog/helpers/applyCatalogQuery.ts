import type { CatalogItem, SortKey } from './types';

export function applyCatalogQuery(params: {
  items: CatalogItem[];
  sort: SortKey;
}): CatalogItem[] {
  const list = params.items;
  if (params.sort === 'price_asc') return [...list].sort((a, b) => (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER));
  if (params.sort === 'price_desc') return [...list].sort((a, b) => (b.price ?? Number.MIN_SAFE_INTEGER) - (a.price ?? Number.MIN_SAFE_INTEGER));
  if (params.sort === 'new') return [...list].reverse();
  return list;
}

