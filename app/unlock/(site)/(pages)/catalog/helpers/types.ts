export type Category = { id: string; label: string };

export type CatalogItem = {
  id: string;
  title: string;
  meta: string;
  price: number | null;
  categoryId: string;
  imageUrl: string | null;
};

export type SortKey = 'popular' | 'price_asc' | 'price_desc' | 'new';

