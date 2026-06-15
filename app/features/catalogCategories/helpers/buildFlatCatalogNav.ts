import { FLAT_CATALOG_NAV, type ProductCatalogNavItem } from "@/app/unlock/(site)/(pages)/products/constants/productCatalogNav";
import type { CatalogCategory } from "../store/useCatalogCategoriesStore";

export function buildFlatCatalogNav(categories: CatalogCategory[]): ProductCatalogNavItem[] {
  if (categories.length === 0) return FLAT_CATALOG_NAV;

  const idSet = new Set(categories.map((category) => category.id));
  const childrenMap = new Map<string, CatalogCategory[]>();
  const roots: CatalogCategory[] = [];

  for (const category of categories) {
    if (category.parentId && idSet.has(category.parentId)) {
      if (!childrenMap.has(category.parentId)) childrenMap.set(category.parentId, []);
      childrenMap.get(category.parentId)!.push(category);
    } else {
      roots.push(category);
    }
  }

  const flat: ProductCatalogNavItem[] = [];
  for (const root of roots) {
    flat.push({ id: root.id, label: root.label });
    for (const child of childrenMap.get(root.id) ?? []) {
      flat.push({ id: child.id, label: child.label });
    }
  }

  return flat.length > 0 ? flat : FLAT_CATALOG_NAV;
}
