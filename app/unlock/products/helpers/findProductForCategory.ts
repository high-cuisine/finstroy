import type { CatalogCategory } from "@/app/features/catalogCategories";
import type { ProductCatalogItem } from "@/app/features/wp/api/wpProductsApi";
import type { ProductCatalogNavItem } from "../constants/productCatalogNav";

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function resolveCategoryLabel(
  categoryId: string,
  categories: CatalogCategory[],
  navItems: ProductCatalogNavItem[],
): string {
  return (
    categories.find((category) => category.id === categoryId)?.label ??
    navItems.find((item) => item.id === categoryId)?.label ??
    ""
  );
}

export function findProductForCategory(
  categoryId: string,
  categoryLabel: string,
  products: ProductCatalogItem[],
  categories: CatalogCategory[],
  navItems: ProductCatalogNavItem[],
): ProductCatalogItem | null {
  if (products.length === 0) return null;

  const byCategoryId = products.find((product) => product.categoryId === categoryId);
  if (byCategoryId) return byCategoryId;

  const label = normalize(categoryLabel || resolveCategoryLabel(categoryId, categories, navItems));
  if (!label) return null;

  const byCategoryName = products.find((product) => {
    const productCategoryLabel = resolveCategoryLabel(product.categoryId, categories, navItems);
    const normalizedProductCategory = normalize(productCategoryLabel);
    return (
      normalizedProductCategory === label ||
      normalizedProductCategory.includes(label) ||
      label.includes(normalizedProductCategory)
    );
  });
  if (byCategoryName) return byCategoryName;

  const byTitle = products.find((product) => normalize(product.title).includes(label));
  if (byTitle) return byTitle;

  if (categoryId === "sveza") {
    const svezaChildIds = new Set(navItems.slice(1, 6).map((item) => item.id));
    return (
      products.find((product) => svezaChildIds.has(product.categoryId)) ??
      products.find((product) => normalize(product.title).includes("фанера")) ??
      null
    );
  }

  return null;
}

export function pickProductIdForCategory(
  categoryId: string,
  categoryLabel: string,
  products: ProductCatalogItem[],
  categories: CatalogCategory[],
  navItems: ProductCatalogNavItem[],
): number | null {
  const product = findProductForCategory(
    categoryId,
    categoryLabel,
    products,
    categories,
    navItems,
  );
  if (!product) return null;

  const id = parseInt(product.id, 10);
  return Number.isFinite(id) && id > 0 ? id : null;
}
