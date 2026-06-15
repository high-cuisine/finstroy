import { create } from "zustand";

export type CatalogCategory = { id: string; label: string; slug?: string; parentId?: string };

export const CATALOG_CATEGORIES: CatalogCategory[] = [];

type CatalogCategoriesStoreState = {
  selectedCategoryId: string;
  categories: CatalogCategory[];
  categoriesLoading: boolean;
};

type CatalogCategoriesStoreActions = {
  setSelectedCategoryId: (id: string) => void;
  setCategories: (categories: CatalogCategory[]) => void;
  setCategoriesLoading: (loading: boolean) => void;
};

export type CatalogCategoriesStore = CatalogCategoriesStoreState & CatalogCategoriesStoreActions;

export const useCatalogCategoriesStore = create<CatalogCategoriesStore>((set) => ({
  selectedCategoryId: "all",
  categories: [],
  categoriesLoading: true,
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
  setCategories: (categories) => set({ categories, categoriesLoading: false }),
  setCategoriesLoading: (loading) => set({ categoriesLoading: loading }),
}));
