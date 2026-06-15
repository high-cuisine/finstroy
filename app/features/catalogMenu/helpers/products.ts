export type CatalogProduct = {
  id: string;
  title: string;
  sku: string;
  price: number;
  oldPrice?: number;
};

export const DEMO_PRODUCTS: CatalogProduct[] = [
  { id: 'p1', title: 'Мебельная ручка CONTUR', sku: 'RS069SG.5/224', price: 1318.61, oldPrice: 2870.37 },
  { id: 'p2', title: 'Мебельная ручка CONTUR', sku: 'RS069SG.5/224', price: 739.26, oldPrice: 870.37 },
  { id: 'p3', title: 'Планка NEO HIT с эксцентриком H5130', sku: '', price: 31.67, oldPrice: 70.37 },
  { id: 'p4', title: 'Мебельная ручка STEREO', sku: 'RS360BL.23/64', price: 366.15, oldPrice: 670.37 },
  { id: 'p5', title: 'Планка NEO HIT с эксцентриком H5130', sku: '', price: 31.67, oldPrice: 70.37 },
  { id: 'p6', title: 'Мебельная ручка CONTUR', sku: 'RS069SG.5/224', price: 1318.61, oldPrice: 2870.37 },
  { id: 'p7', title: 'Мебельная ручка CONTUR', sku: 'RS069SG.5/224', price: 739.26, oldPrice: 870.37 },
  { id: 'p8', title: 'Мебельная ручка STEREO', sku: 'RS360BL.23/64', price: 366.15, oldPrice: 670.37 },
];

