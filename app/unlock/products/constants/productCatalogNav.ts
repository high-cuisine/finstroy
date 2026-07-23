export type ProductCatalogNavItem = {
  id: string;
  label: string;
};

/** Дочерние категории группы SVEZA (как в макете). */
export const SVEZA_CHILDREN: ProductCatalogNavItem[] = [
  { id: "fanera-fk", label: "Фанера ФК" },
  { id: "fanera-lf", label: "Фанера ЛФ" },
  { id: "fanera-fsf", label: "Фанера ФСФ" },
  { id: "fanera-fsf-hv", label: "Фанера ФСФ хвойная" },
  { id: "fanera-avia", label: "Авиационная фанера" },
];

export const OTHER_CATALOG_CATEGORIES: ProductCatalogNavItem[] = [
  { id: "mdf", label: "МДФ" },
  { id: "evogloss", label: "EVOGLOSS, ACRYLIC" },
  { id: "hdf", label: "ХДФ" },
  { id: "dsp", label: "ДСП, ЛДСП" },
  { id: "osb", label: "OSB" },
  { id: "dsp-sh", label: "ДСП шпунтованная" },
  { id: "dvp", label: "ДВП" },
  { id: "stoleshnicy", label: "Столешницы" },
  { id: "opalubka", label: "Опалубка" },
  { id: "boyard", label: "Фурнитура Boyard" },
];

/** Плоский список категорий для бокового меню (как в макете). */
export const FLAT_CATALOG_NAV: ProductCatalogNavItem[] = [
  { id: "sveza", label: "Продукция SVEZA" },
  ...SVEZA_CHILDREN,
  ...OTHER_CATALOG_CATEGORIES,
];
