"use client";

import { useMemo } from "react";
import {
  buildFlatCatalogNav,
  useCatalogCategoriesStore,
  useLoadCatalogCategories,
} from "@/app/features/catalogCategories";
import styles from "../catalog.module.scss";

export function CategoriesSidebar({
  categoryId,
  onChangeCategory,
  onGoToCatalog,
}: {
  categoryId: string;
  onChangeCategory: (id: string) => void;
  onGoToCatalog: () => void;
}) {
  useLoadCatalogCategories();

  const storeCategories = useCatalogCategoriesStore((state) => state.categories);
  const categoriesLoading = useCatalogCategoriesStore((state) => state.categoriesLoading);
  const items = useMemo(() => buildFlatCatalogNav(storeCategories), [storeCategories]);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sideHeader}>
        <button type="button" className={styles.sideHeaderTitle} onClick={onGoToCatalog}>
          Каталог
        </button>
        <div className={styles.sideHeaderLabel}>Категория</div>
      </div>
      <div className={styles.sideDivider} aria-hidden />

      {categoriesLoading && items.length === 0 ? (
        <div className={styles.sideLoading}>
          {[70, 55, 80, 60, 75, 50].map((w) => (
            <div key={w} className={styles.sideLoadingBar} style={{ width: `${w}%` }} />
          ))}
        </div>
      ) : (
        <nav className={styles.sideGroup} aria-label="Категории каталога">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.sideItem}${categoryId === item.id ? ` ${styles.sideItemActive}` : ""}`}
              onClick={() => onChangeCategory(item.id)}
            >
              <span className={styles.sideItemLabel}>{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </aside>
  );
}
