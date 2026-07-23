"use client";

import { useCatalogCategoriesStore } from "@/app/features/catalogCategories";
import styles from "../catalog.module.scss";

export function MobileCategoryBar(props: {
  categoryId: string;
  onChangeCategory: (id: string) => void;
}) {
  const categories = useCatalogCategoriesStore((s) => s.categories);

  return (
    <div className={styles.mobileCategories} aria-label="Категории каталога">
      <div className={styles.mobileCategoriesTrack}>
        <button
          type="button"
          className={`${styles.mobileCategoryChip}${props.categoryId === "all" ? ` ${styles.mobileCategoryChipActive}` : ""}`}
          onClick={() => props.onChangeCategory("all")}
        >
          Все товары
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`${styles.mobileCategoryChip}${props.categoryId === category.id ? ` ${styles.mobileCategoryChipActive}` : ""}`}
            onClick={() => props.onChangeCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
