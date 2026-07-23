"use client";

import Link from "next/link";
import { useCartStore } from "@/app/features/cart";
import { sitePath } from "@/app/shared/lib/sitePath";
import styles from "../catalog.module.scss";
import type { CatalogItem } from "../helpers/types";

export function CatalogGrid(props: { items: CatalogItem[] }) {
  const addItem = useCartStore((s) => s.addItem);
  const mutating = useCartStore((s) => s.mutating);

  return (
    <div className={styles.grid}>
      {props.items.map((item) => {
        const productId = parseInt(item.id, 10);
        const canAdd = Number.isFinite(productId) && productId > 0;

        return (
          <div key={item.id} className={styles.card}>
            <Link href={sitePath(`/products/${item.id}`)} className={styles.cardLink}>
              <div className={styles.cardThumb}>
                <div className={styles.cardThumbPlaceholder} aria-hidden="true" />
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className={styles.cardThumbImg}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : null}
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardMeta}>{item.meta}</p>
            </Link>
            <div className={styles.cardPriceRow}>
              <div className={styles.price}>
                {item.price === null
                  ? "Цена по запросу"
                  : `${item.price.toLocaleString("ru-RU")} ₽`}
              </div>
              <button
                type="button"
                className={styles.pill}
                disabled={!canAdd || mutating}
                onClick={() => {
                  if (!canAdd) return;
                  void addItem(productId, 1);
                }}
              >
                В корзину
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
