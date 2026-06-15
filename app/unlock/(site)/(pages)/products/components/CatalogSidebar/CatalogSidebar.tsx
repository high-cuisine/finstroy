"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  buildFlatCatalogNav,
  useCatalogCategoriesStore,
  useLoadCatalogCategories,
} from "@/app/features/catalogCategories";
import { useCatalogSearchStore } from "@/app/features/search";
import { sitePath } from "@/app/shared/lib/sitePath";
import { type ProductCatalogNavItem } from "../../constants/productCatalogNav";
import styles from "../../products.module.scss";

function SidebarNav({
  items,
  loading,
  selectedCategoryId,
  onSelectCategory,
  onGoToCatalog,
}: {
  items: ProductCatalogNavItem[];
  loading: boolean;
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  onGoToCatalog: () => void;
}) {
  return (
    <>
      <div className={styles.sidebarHead}>
        <button type="button" className={styles.sidebarTitle} onClick={onGoToCatalog}>
          Каталог
        </button>
        <span className={styles.sidebarLabel}>Категория</span>
      </div>

      <nav className={styles.sidebarNav} aria-label="Категории каталога">
        {loading && items.length === 0 ? (
          <span className={styles.sidebarLoading}>Загрузка…</span>
        ) : null}

        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.catItem} ${
              selectedCategoryId === item.id ? styles.catItemSelected : ""
            }`}
            onClick={() => onSelectCategory(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
}

export function CatalogSidebarMobileButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className={styles.mobileCatBtn}
      onClick={onClick}
      aria-label="Категории каталога"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <line x1="3" y1="6" x2="17" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="3" y1="14" x2="17" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}

export function CatalogSidebar({
  mobileOpen,
  onMobileOpenChange,
}: {
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  useLoadCatalogCategories();

  const storeCategories = useCatalogCategoriesStore((state) => state.categories);
  const categoriesLoading = useCatalogCategoriesStore((state) => state.categoriesLoading);
  const selectedCategoryId = useCatalogCategoriesStore((state) => state.selectedCategoryId);
  const setSelectedCategoryId = useCatalogCategoriesStore((state) => state.setSelectedCategoryId);
  const setSearchQuery = useCatalogSearchStore((state) => state.setQuery);

  const items = useMemo(() => buildFlatCatalogNav(storeCategories), [storeCategories]);

  const handleGoToCatalog = () => {
    setSelectedCategoryId("all");
    setSearchQuery("");
    onMobileOpenChange(false);
    router.push(sitePath("/catalog"));
  };

  const handleSelectCategory = (id: string) => {
    setSelectedCategoryId(id);
    setSearchQuery('');
    onMobileOpenChange(false);
    router.push(sitePath(`/catalog?category=${encodeURIComponent(id)}`));
  };

  return (
    <>
      <aside className={styles.sidebar}>
        <SidebarNav
          items={items}
          loading={categoriesLoading}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
          onGoToCatalog={handleGoToCatalog}
        />
      </aside>

      {mobileOpen ? (
        <div
          className={styles.catModalBackdrop}
          onClick={() => onMobileOpenChange(false)}
        >
          <div
            className={styles.catModalPanel}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.catModalHeader}>
              <span className={styles.catModalTitle}>Каталог</span>
              <button
                type="button"
                className={styles.catModalClose}
                onClick={() => onMobileOpenChange(false)}
                aria-label="Закрыть"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="14" y1="2" x2="2" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <SidebarNav
              items={items}
              loading={categoriesLoading}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={handleSelectCategory}
              onGoToCatalog={handleGoToCatalog}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
