"use client";

import { useEffect } from "react";
import { fetchProductCategories } from "@/app/features/wp/api/wpProductsApi";
import { useCatalogCategoriesStore } from "../store/useCatalogCategoriesStore";

export function useLoadCatalogCategories() {
  const categories = useCatalogCategoriesStore((s) => s.categories);
  const setCategories = useCatalogCategoriesStore((s) => s.setCategories);
  const setCategoriesLoading = useCatalogCategoriesStore((s) => s.setCategoriesLoading);

  useEffect(() => {
    if (categories.length > 0) return;

    let cancelled = false;
    setCategoriesLoading(true);

    void fetchProductCategories()
      .then((items) => {
        if (!cancelled) setCategories(items);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });

    return () => {
      cancelled = true;
    };
  }, [categories.length, setCategories, setCategoriesLoading]);
}
