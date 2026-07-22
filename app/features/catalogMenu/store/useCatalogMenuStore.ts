import { create } from 'zustand';

export type CatalogMenuMode = 'catalog' | 'search';

export type CatalogMenuStoreState = {
  isOpen: boolean;
  mode: CatalogMenuMode;
  history: string[];
};

export type CatalogMenuStoreActions = {
  open: (mode?: CatalogMenuMode) => void;
  close: () => void;
  toggle: (mode?: CatalogMenuMode) => void;
  setMode: (mode: CatalogMenuMode) => void;
  clearHistory: () => void;
  addToHistory: (query: string) => void;
};

export type CatalogMenuStore = CatalogMenuStoreState & CatalogMenuStoreActions;

export const useCatalogMenuStore = create<CatalogMenuStore>((set) => ({
  isOpen: false,
  mode: 'catalog',
  history: [],

  open: (mode = 'catalog') => set({ isOpen: true, mode }),
  close: () => set({ isOpen: false, mode: 'catalog' }),
  toggle: (mode = 'catalog') => set((s) => ({ isOpen: !s.isOpen, mode: s.isOpen ? 'catalog' : mode })),
  setMode: (mode) => set({ mode }),
  clearHistory: () => set({ history: [] }),
  addToHistory: (query) =>
    set((s) => {
      const q = query.trim();
      if (!q) return s;
      const next = [q, ...s.history.filter((x) => x !== q)].slice(0, 6);
      return { history: next };
    }),
}));

