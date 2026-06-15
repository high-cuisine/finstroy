/** Фрагмент ответа WooCommerce Store API (корзина). */
export type WcStoreCartJson = {
  items?: WcStoreCartLineJson[];
  currency_symbol?: string;
  totals?: {
    total_items?: string;
    total_items_tax?: string;
    currency_code?: string;
    currency_symbol?: string;
    currency_minor_unit?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export type WcStoreCartLineJson = {
  key?: string;
  id?: number | string;
  quantity?: number;
  name?: string;
  images?: { src?: string; thumbnail?: string; url?: string }[];
  image?: { src?: string; thumbnail?: string; url?: string };
  prices?: {
    price?: string;
    regular_price?: string;
    sale_price?: string;
    currency_minor_unit?: number;
    currency_symbol?: string;
    [key: string]: unknown;
  };
  totals?: {
    line_subtotal?: string;
    line_total?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export type NormalizedCartLine = {
  key: string;
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  regularPrice: number | null;
  imageUrl: string | null;
};
