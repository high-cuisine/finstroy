'use client';

import { Suspense } from 'react';
import Header from '@/app/shared/componets/layout/Header/Header';
import Footer from '@/app/shared/componets/layout/Footer/Footer';
import styles from './catalog.module.scss';
import { CategoriesSidebar } from './components/CategoriesSidebar';
import { CatalogToolbar } from './components/CatalogToolbar';
import { EmptyState } from './components/EmptyState';
import { CatalogGrid } from './components/CatalogGrid';
import { Pagination } from './components/Pagination';
import { SearchInfo } from './components/SearchInfo';
import { CategoryFilterInfo } from './components/CategoryFilterInfo';
import { useCatalogPageModel } from './hooks/useCatalogPageModel';

function CatalogPageContent() {
  const model = useCatalogPageModel();

  return (
    <>
      <main className={styles.main}>
        <div className={styles.contentShell}>
          <header className={styles.pageHead}>
            <h1 className={styles.h1}>Каталог</h1>
            {!model.isLoading ? (
              <span className={styles.count}>
                {model.filtered.length}{" "}
                {model.filtered.length === 1
                  ? "товар"
                  : model.filtered.length >= 2 && model.filtered.length <= 4
                    ? "товара"
                    : "товаров"}
              </span>
            ) : null}
          </header>

          <div className={styles.layout}>
            <CategoriesSidebar
              categoryId={model.categoryId}
              onChangeCategory={model.setCategory}
              onGoToCatalog={model.goToCatalog}
            />

            <section className={styles.content}>
              <CatalogToolbar
                query={model.query}
                hasQuery={model.hasQuery}
                onChangeQuery={model.setQuery}
                onClearQuery={model.resetSearch}
                sort={model.sort}
                onChangeSort={model.setSort}
              />

              {model.hasCategoryFilter ? (
                <CategoryFilterInfo
                  label={model.categoryLabel}
                  count={model.filtered.length}
                  onReset={() => {
                    model.clearQuery();
                    model.setPage(1);
                  }}
                />
              ) : null}

              {model.hasQuery ? (
                <SearchInfo
                  query={model.query}
                  count={model.filtered.length}
                  onReset={() => {
                    model.clearQuery();
                    model.setPage(1);
                  }}
                />
              ) : null}

              {model.isLoading ? (
                <div className={styles.statusText}>Загружаем каталог...</div>
              ) : model.error ? (
                <div className={styles.statusText}>Ошибка загрузки: {model.error}</div>
              ) : model.filtered.length === 0 ? (
                <EmptyState
                  hasQuery={model.hasQuery || model.hasCategoryFilter}
                  onClearQuery={() => {
                    model.clearQuery();
                    model.setPage(1);
                  }}
                />
              ) : (
                <CatalogGrid items={model.pageItems} />
              )}

              <Pagination totalPages={model.totalPages} page={model.page} onChangePage={model.setPage} />
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

export default function CatalogPage() {
  return (
    <div className={styles.page}>
      <Header variant="catalog" />

      <Suspense
        fallback={
          <main className={styles.main}>
            <div className={styles.contentShell}>
              <div className={styles.statusText}>Загружаем каталог...</div>
            </div>
          </main>
        }
      >
        <CatalogPageContent />
      </Suspense>

      <Footer />
    </div>
  );
}
