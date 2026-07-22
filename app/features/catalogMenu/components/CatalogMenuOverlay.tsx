"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCatalogSearchStore, type CatalogSearchStore } from "@/app/features/search";
import {
  buildFlatCatalogNav,
  useCatalogCategoriesStore,
  useLoadCatalogCategories,
} from "@/app/features/catalogCategories";
import {
  fetchProductCatalog,
  getProductCatalogItems,
  type ProductCatalogItem,
} from "@/app/features/wp/api/wpProductsApi";
import { useCatalogMenuStore } from "../store/useCatalogMenuStore";
import { sitePath } from "@/app/shared/lib/sitePath";
import styles from "./CatalogMenuOverlay.module.scss";

const OVERLAY_SEARCH_LIMIT = 100;
const CLOSE_MS = 240;

export function CatalogMenuOverlay() {
  const router = useRouter();
  const pathname = usePathname();
  const isOpen = useCatalogMenuStore((s) => s.isOpen);
  const mode = useCatalogMenuStore((s) => s.mode);
  const close = useCatalogMenuStore((s) => s.close);
  const history = useCatalogMenuStore((s) => s.history);
  const clearHistory = useCatalogMenuStore((s) => s.clearHistory);
  const addToHistory = useCatalogMenuStore((s) => s.addToHistory);

  const setQuery = useCatalogSearchStore((s: CatalogSearchStore) => s.setQuery);
  const query = useCatalogSearchStore((s: CatalogSearchStore) => s.query);

  useLoadCatalogCategories();
  const storeCategories = useCatalogCategoriesStore((s) => s.categories);
  const categoriesLoading = useCatalogCategoriesStore((s) => s.categoriesLoading);
  const selectedCategoryId = useCatalogCategoriesStore((s) => s.selectedCategoryId);
  const setSelectedCategoryId = useCatalogCategoriesStore((s) => s.setSelectedCategoryId);

  const flatCategories = useMemo(
    () => buildFlatCatalogNav(storeCategories),
    [storeCategories],
  );

  const [render, setRender] = useState(false);
  const [closing, setClosing] = useState(false);
  const [products, setProducts] = useState<ProductCatalogItem[]>([]);
  const [productsTotal, setProductsTotal] = useState(0);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  const leftPanelRef = useRef<HTMLElement | null>(null);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);

  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const showRightPanel = isOpen && !closing && mode === "search" && hasQuery;
  const showCategories = mode === "catalog";

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      setClosing(false);
      return;
    }

    if (!render) return;

    setClosing(true);
    const timer = window.setTimeout(() => {
      setRender(false);
      setClosing(false);
    }, CLOSE_MS);

    return () => window.clearTimeout(timer);
  }, [isOpen, render]);

  useEffect(() => {
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!render) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [render]);

  useEffect(() => {
    if (!render) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [render, close]);

  useEffect(() => {
    if (!render || !showRightPanel) return;

    const controller = new AbortController();
    let cancelled = false;

    const run = async () => {
      try {
        setProductsLoading(true);
        setProductsError(null);
        const result = await fetchProductCatalog({
          search: trimmedQuery,
          perPage: OVERLAY_SEARCH_LIMIT,
          signal: controller.signal,
        });
        if (cancelled) return;
        setProducts(result.items);
        setProductsTotal(result.total);
      } catch (err) {
        if (cancelled || controller.signal.aborted) return;
        setProductsError(err instanceof Error ? err.message : "Ошибка загрузки");
        setProducts([]);
        setProductsTotal(0);
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    };

    const timer = window.setTimeout(run, 300);
    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [render, showRightPanel, trimmedQuery]);

  useEffect(() => {
    if (!render) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;

      const headerEl = document.querySelector("[data-app-header]");
      if (headerEl?.contains(target)) return;
      if (shellRef.current?.contains(target)) return;

      close();
    };

    document.addEventListener("pointerdown", onPointerDown, { capture: true });
    return () => document.removeEventListener("pointerdown", onPointerDown, { capture: true });
  }, [render, close]);

  const handleCategoryClick = (id: string) => {
    setSelectedCategoryId(id);
    setQuery("");
    close();
    router.push(sitePath(`/catalog?category=${encodeURIComponent(id)}`));
  };

  if (!render) return null;

  return (
    <>
      <button
        type="button"
        className={styles.backdrop}
        onClick={close}
        aria-label="Закрыть каталог"
      />

      <div
        ref={shellRef}
        className={`${styles.shell} ${closing ? styles.overlayClosing : styles.overlayOpen}`}
      >
        <div className={`${styles.shellInner} ${!showRightPanel ? styles.shellInnerCompact : ""}`}>
          <aside
            ref={(node) => {
              leftPanelRef.current = node;
            }}
            className={styles.panel}
            aria-label="Каталог"
            id="catalog-menu"
          >
            {showCategories ? (
              <>
                <div className={styles.header}>
                  <div className={styles.title}>Каталог</div>
                  <div className={styles.label}>Категория</div>
                </div>
                <div className={styles.divider} aria-hidden />

                {categoriesLoading && flatCategories.length === 0 ? (
                  <div className={styles.loadingList} aria-hidden>
                    {[60, 80, 55, 70, 65, 50, 75].map((w) => (
                      <div key={w} className={styles.loadingBar} style={{ width: `${w}%` }} />
                    ))}
                  </div>
                ) : (
                  <nav className={styles.list} aria-label="Категории каталога">
                    {flatCategories.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`${styles.item} ${
                          selectedCategoryId === item.id ? styles.itemHighlighted : ""
                        }`}
                        onClick={() => handleCategoryClick(item.id)}
                      >
                        <span className={styles.itemLabel}>{item.label}</span>
                        <span className={styles.chevron} aria-hidden>
                          ›
                        </span>
                      </button>
                    ))}
                  </nav>
                )}
              </>
            ) : mode === "search" && !hasQuery ? (
              <>
                {history.length > 0 && (
                  <>
                    <div className={styles.header}>
                      <div className={styles.headerRow}>
                        <div className={styles.title}>История</div>
                        <button type="button" className={styles.clearBtn} onClick={clearHistory}>
                          Очистить
                        </button>
                      </div>
                    </div>

                    <div className={styles.section}>
                      <div className={styles.searchList} aria-label="История поиска">
                        {history.slice(0, 3).map((q, idx) => (
                          <button
                            key={`${q}-${idx}`}
                            type="button"
                            className={`${styles.searchRow}${idx === 0 ? ` ${styles.searchRowActive}` : ""}`}
                            onClick={() => {
                              setQuery(q);
                              addToHistory(q);
                            }}
                          >
                            <Image
                              src="/icons/history.svg"
                              alt=""
                              width={22}
                              height={22}
                              className={styles.rowIcon}
                            />
                            <span className={styles.rowText}>{q}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div className={styles.header}>
                  <div className={styles.title}>Поиск</div>
                  <div className={styles.label}>Товары</div>
                </div>
                <div className={styles.divider} aria-hidden />

                {productsLoading ? (
                  <div className={styles.loadingList} aria-hidden>
                    {[70, 55, 80, 60, 75, 50, 65].map((w) => (
                      <div key={w} className={styles.loadingBar} style={{ width: `${w}%` }} />
                    ))}
                  </div>
                ) : productsError ? (
                  <div className={styles.listStatus}>{productsError}</div>
                ) : (
                  <nav className={styles.list} aria-label="Результаты поиска">
                    {products.map((product) => (
                      <Link
                        key={product.id}
                        href={sitePath(`/products/${product.id}`)}
                        className={styles.item}
                        onClick={close}
                      >
                        <span className={styles.itemLabel}>{product.title}</span>
                        <span className={styles.chevron} aria-hidden>
                          ›
                        </span>
                      </Link>
                    ))}
                  </nav>
                )}
              </>
            )}
          </aside>

          {showRightPanel ? (
            <div
              ref={(node) => {
                rightPanelRef.current = node;
              }}
              className={styles.rightPanel}
              aria-label="Результаты"
            >
              <div className={styles.resultsTopRow}>
                <div>
                  По запросу <span className={styles.queryHighlight}>{trimmedQuery}</span>{" "}
                  {productsLoading
                    ? "ищем..."
                    : `найдено ${productsTotal} ${productsTotal === 1 ? "товар" : productsTotal >= 2 && productsTotal <= 4 ? "товара" : "товаров"}`}
                </div>
                <Link
                  href={sitePath(`/catalog?q=${encodeURIComponent(trimmedQuery)}`)}
                  className={styles.resultsLink}
                  onClick={close}
                >
                  <span>Все результаты</span>
                  <Image src="/icons/arrow-right.svg" alt="" width={16} height={16} />
                </Link>
              </div>

              <div className={styles.productsGrid}>
                {productsLoading ? (
                  <div className={styles.resultsStatus}>Загружаем товары...</div>
                ) : productsError ? (
                  <div className={styles.resultsStatus}>{productsError}</div>
                ) : products.length === 0 ? (
                  <div className={styles.resultsStatus}>Ничего не найдено</div>
                ) : (
                  products.map((product) => (
                    <Link
                      key={product.id}
                      href={sitePath(`/products/${product.id}`)}
                      className={styles.productCard}
                      onClick={close}
                      aria-label={product.title}
                    >
                      <div className={styles.productThumb}>
                        {product.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.imageUrl}
                            alt=""
                            className={styles.productThumbImg}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : null}
                      </div>
                      <div className={styles.productTitle}>{product.title}</div>
                      {product.meta ? <div className={styles.productSku}>{product.meta}</div> : null}
                      <div className={styles.priceRow}>
                        <div className={styles.price}>
                          {product.price === null
                            ? "Цена по запросу"
                            : `${product.price.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽`}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
