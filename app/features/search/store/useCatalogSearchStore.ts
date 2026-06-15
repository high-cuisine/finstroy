import { create } from 'zustand';

export type CatalogSearchStoreState = {
  query: string;
};

export type CatalogSearchStoreActions = {
  setQuery: (query: string) => void;
  clearQuery: () => void;
};

export type CatalogSearchStore = CatalogSearchStoreState & CatalogSearchStoreActions;

export const useCatalogSearchStore = create<CatalogSearchStore>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
  clearQuery: () => set({ query: '' }),
}));

