"use client";

import Link from "next/link";
import { sitePath } from "@/app/shared/lib/sitePath";
import type { CatalogItem } from "../helpers/types";
import styles from "../catalog.module.scss";

export function ProductsSidebar({ items, loading }: { items: CatalogItem[]; loading: boolean }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sideHeader}>
        <div className={styles.sideHeaderTitle}>Каталог</div>
        <div className={styles.sideHeaderLabel}>Товары</div>
      </div>
      <div className={styles.sideDivider} aria-hidden />

      {loading ? (
        <div className={styles.sideLoading}>
          {[70, 55, 80, 60, 75, 50, 65].map((w) => (
            <div key={w} className={styles.sideLoadingBar} style={{ width: `${w}%` }} />
          ))}
        </div>
      ) : (
        <nav className={styles.sideGroup} aria-label="Список товаров">
          {items.map((item) => (
            <Link
              key={item.id}
              href={sitePath(`/products/${item.id}`)}
              className={styles.sideItem}
            >
              <span className={styles.sideItemLabel}>{item.title}</span>
              <span className={styles.sideItemChevron} aria-hidden>›</span>
            </Link>
          ))}
        </nav>
      )}
    </aside>
  );
}
