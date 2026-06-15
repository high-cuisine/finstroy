import type { CatalogCategory } from "@/app/features/catalogCategories";
import type { ProductCatalogItem } from "@/app/features/wp/api/wpProductsApi";

export function collectCategoryScopeIds(
  categoryId: string,
  categories: CatalogCategory[],
): Set<string> {
  const ids = new Set<string>([categoryId]);
  let changed = true;

  while (changed) {
    changed = false;
    for (const category of categories) {
      if (category.parentId && ids.has(category.parentId) && !ids.has(category.id)) {
        ids.add(category.id);
        changed = true;
      }
    }
  }

  return ids;
}

export function filterProductsByCategory(
  products: ProductCatalogItem[],
  categoryId: string,
  categories: CatalogCategory[],
): ProductCatalogItem[] {
  const scope = collectCategoryScopeIds(categoryId, categories);
  return products.filter((product) => scope.has(product.categoryId));
}

export function findCategoryByQuery(
  query: string,
  categories: CatalogCategory[],
): CatalogCategory | null {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;

  return (
    categories.find(
      (category) =>
        category.label.trim().toLowerCase() === normalized ||
        category.slug?.trim().toLowerCase() === normalized,
    ) ?? null
  );
}
