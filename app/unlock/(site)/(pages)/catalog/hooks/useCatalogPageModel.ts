import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { sitePath } from '@/app/shared/lib/sitePath';
import {
  useCatalogCategoriesStore,
  useLoadCatalogCategories,
} from '@/app/features/catalogCategories';
import { useCatalogSearchStore, type CatalogSearchStore } from '@/app/features/search';
import {
  fetchProductCatalog,
  fetchProductsByCategoryId,
  getProductCatalogItems,
} from '@/app/features/wp/api/wpProductsApi';
import { applyCatalogQuery } from '../helpers/applyCatalogQuery';
import {
  filterProductsByCategory,
  findCategoryByQuery,
} from '../helpers/categoryFilter';
import type { CatalogItem } from '../helpers/types';
import type { SortKey } from '../helpers/types';

function mapToCatalogItems(
  items: Awaited<ReturnType<typeof getProductCatalogItems>>,
): CatalogItem[] {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    meta: item.meta,
    price: item.price,
    categoryId: item.categoryId,
    imageUrl: item.imageUrl,
  }));
}

export function useCatalogPageModel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useLoadCatalogCategories();

  const [items, setItems] = useState<CatalogItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>('popular');
  const [page, setPage] = useState(1);

  const query = useCatalogSearchStore((s: CatalogSearchStore) => s.query);
  const setQuery = useCatalogSearchStore((s: CatalogSearchStore) => s.setQuery);
  const clearQuery = useCatalogSearchStore((s: CatalogSearchStore) => s.clearQuery);

  const categories = useCatalogCategoriesStore((s) => s.categories);
  const setSelectedCategoryId = useCatalogCategoriesStore((s) => s.setSelectedCategoryId);

  const perPage = 12;
  const trimmedQuery = query.trim();
  const categoryParam = searchParams.get('category')?.trim() ?? '';
  const activeCategoryId = categoryParam || 'all';

  const activeCategory = useMemo(
    () => categories.find((category) => category.id === categoryParam) ?? null,
    [categories, categoryParam],
  );

  useEffect(() => {
    const q = searchParams.get('q')?.trim() ?? '';
    const category = searchParams.get('category')?.trim() ?? '';

    if (category) {
      setQuery('');
      setSelectedCategoryId(category);
      return;
    }

    if (q && categories.length > 0) {
      const matchedCategory = findCategoryByQuery(q, categories);
      if (matchedCategory) {
        router.replace(sitePath(`/catalog?category=${encodeURIComponent(matchedCategory.id)}`));
        return;
      }
    }

    setQuery(q);
  }, [searchParams, setQuery, categories, router, setSelectedCategoryId]);

  useEffect(() => {
    setPage(1);
  }, [trimmedQuery, sort, categoryParam]);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const run = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (categoryParam) {
          const result = await fetchProductsByCategoryId(categoryParam, {
            slug: activeCategory?.slug,
            perPage: 100,
            signal: controller.signal,
          });

          const scoped = filterProductsByCategory(result.items, categoryParam, categories);
          const itemsForCategory =
            scoped.length > 0
              ? scoped
              : filterProductsByCategory(
                  await getProductCatalogItems({ signal: controller.signal }),
                  categoryParam,
                  categories,
                );

          if (cancelled) return;
          setItems(mapToCatalogItems(itemsForCategory));
          setTotalCount(itemsForCategory.length);
          return;
        }

        if (trimmedQuery) {
          const result = await fetchProductCatalog({
            search: trimmedQuery,
            perPage: 100,
            signal: controller.signal,
          });
          if (cancelled) return;
          setItems(mapToCatalogItems(result.items));
          setTotalCount(result.total);
          return;
        }

        const allItems = await getProductCatalogItems({ signal: controller.signal });
        if (cancelled) return;
        setItems(mapToCatalogItems(allItems));
        setTotalCount(allItems.length);
      } catch (err) {
        if (cancelled || controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Не удалось загрузить товары');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    if (trimmedQuery && !categoryParam) {
      const timer = window.setTimeout(run, 300);
      return () => {
        cancelled = true;
        controller.abort();
        window.clearTimeout(timer);
      };
    }

    run();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [trimmedQuery, categoryParam, activeCategory?.slug, categories]);

  const filtered = useMemo(
    () => applyCatalogQuery({ items, sort }),
    [items, sort],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * perPage, safePage * perPage);
  const hasQuery = trimmedQuery.length > 0 && !categoryParam;
  const hasCategoryFilter = categoryParam.length > 0;
  const categoryLabel = activeCategory?.label ?? 'Категория';

  const resetSearch = () => {
    clearQuery();
    setPage(1);
    setSelectedCategoryId('all');
    router.replace(sitePath('/catalog'));
  };

  const setCategory = (id: string) => {
    setPage(1);
    setQuery('');
    setSelectedCategoryId(id);
    if (id === 'all') {
      router.replace(sitePath('/catalog'));
      return;
    }
    router.replace(sitePath(`/catalog?category=${encodeURIComponent(id)}`));
  };

  const goToCatalog = () => {
    setCategory('all');
  };

  const setQueryWithUrl = (next: string) => {
    setQuery(next);
    setPage(1);
    const trimmed = next.trim();
    if (trimmed) {
      setSelectedCategoryId('all');
      router.replace(sitePath(`/catalog?q=${encodeURIComponent(trimmed)}`));
      return;
    }
    if (!categoryParam) {
      router.replace(sitePath('/catalog'));
    }
  };

  return {
    sort,
    setSort,
    page: safePage,
    setPage,
    query,
    setQuery: setQueryWithUrl,
    clearQuery: resetSearch,
    resetSearch,
    items,
    filtered,
    pageItems,
    totalPages,
    totalCount,
    hasQuery,
    hasCategoryFilter,
    categoryLabel,
    categoryId: activeCategoryId,
    setCategory,
    goToCatalog,
    isLoading,
    error,
  };
}
