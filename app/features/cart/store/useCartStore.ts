import { create } from "zustand";
import {
  addItemToStoreCart,
  fetchStoreCartWithNonceRetry,
  parseErrorMessage,
  removeStoreCartItem,
  updateStoreCartItem,
} from "../api/cartApi";
import { normalizeStoreCart } from "../api/parseCart";
import type { NormalizedCartLine } from "../api/types";
import {
  fetchStoreProductImageMap,
  fetchStoreProductFirstVariationId,
} from "@/app/features/wp/api/wpProductsApi";

async function enrichCartLinesWithImages(
  lines: NormalizedCartLine[],
): Promise<NormalizedCartLine[]> {
  const missingIds = lines.filter((line) => !line.imageUrl).map((line) => line.productId);
  if (missingIds.length === 0) {
    return lines;
  }

  const imageMap = await fetchStoreProductImageMap(missingIds);
  if (Object.keys(imageMap).length === 0) {
    return lines;
  }

  return lines.map((line) => ({
    ...line,
    imageUrl: line.imageUrl ?? imageMap[line.productId] ?? null,
  }));
}

function mergeSelection(
  prev: Record<string, boolean>,
  lines: NormalizedCartLine[],
): Record<string, boolean> {
  const next: Record<string, boolean> = {};
  for (const l of lines) {
    next[l.key] = prev[l.key] ?? true;
  }
  return next;
}

type CartStore = {
  lines: NormalizedCartLine[];
  currencySymbol: string;
  loading: boolean;
  mutating: boolean;
  error: string | null;
  selectedKeys: Record<string, boolean>;
  raw: unknown | null;

  isLineSelected: (key: string) => boolean;
  fetchCart: (opts?: { quiet?: boolean }) => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (key: string, quantity: number) => Promise<void>;
  removeLine: (key: string) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleLineSelected: (key: string) => void;
  setAllSelected: (value: boolean) => void;
};

export const useCartStore = create<CartStore>((set, get) => ({
  lines: [],
  currencySymbol: "₽",
  loading: false,
  mutating: false,
  error: null,
  selectedKeys: {},
  raw: null,

  isLineSelected: (key) => get().selectedKeys[key] !== false,

  fetchCart: async (opts) => {
    const quiet = opts?.quiet ?? false;
    if (!quiet) set({ loading: true, error: null });
    try {
      const res = await fetchStoreCartWithNonceRetry();
      if (!res.ok) throw new Error(await parseErrorMessage(res));
      const json: unknown = await res.json();
      let { lines, currencySymbol } = normalizeStoreCart(json);
      lines = await enrichCartLinesWithImages(lines);
      set((s) => ({
        raw: json,
        lines,
        currencySymbol,
        selectedKeys: mergeSelection(s.selectedKeys, lines),
      }));
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Не удалось загрузить корзину",
      });
    } finally {
      if (!quiet) set({ loading: false });
    }
  },

  addItem: async (productId, quantity = 1) => {
    set({ mutating: true, error: null });
    try {
      let res = await addItemToStoreCart(productId, quantity);
      if (!res.ok) {
        const bodyText = await res.text();
        let parsed: { code?: string; message?: string } | null = null;
        try { parsed = JSON.parse(bodyText); } catch { /* ignore */ }

        if (parsed?.code === "woocommerce_rest_missing_attributes") {
          const variationId = await fetchStoreProductFirstVariationId(productId);
          if (variationId) {
            res = await addItemToStoreCart(variationId, quantity);
            if (!res.ok) throw new Error(await parseErrorMessage(res));
          } else {
            throw new Error(parsed.message ?? (bodyText || `HTTP ${res.status}`));
          }
        } else {
          throw new Error(parsed?.message ?? (bodyText || `HTTP ${res.status}`));
        }
      }
      await get().fetchCart({ quiet: true });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Ошибка добавления в корзину",
      });
    } finally {
      set({ mutating: false });
    }
  },

  updateQuantity: async (key, quantity) => {
    if (quantity < 1) {
      await get().removeLine(key);
      return;
    }
    set({ mutating: true, error: null });
    try {
      const res = await updateStoreCartItem(key, quantity);
      if (!res.ok) throw new Error(await parseErrorMessage(res));
      await get().fetchCart({ quiet: true });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Ошибка изменения количества",
      });
    } finally {
      set({ mutating: false });
    }
  },

  removeLine: async (key) => {
    set({ mutating: true, error: null });
    try {
      const res = await removeStoreCartItem(key);
      if (!res.ok) throw new Error(await parseErrorMessage(res));
      await get().fetchCart({ quiet: true });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Ошибка удаления",
      });
    } finally {
      set({ mutating: false });
    }
  },

  clearCart: async () => {
    const { lines } = get();
    if (lines.length === 0) return;
    set({ mutating: true, error: null });
    try {
      for (const l of lines) {
        const res = await removeStoreCartItem(l.key);
        if (!res.ok) throw new Error(await parseErrorMessage(res));
      }
      await get().fetchCart({ quiet: true });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Ошибка очистки корзины",
      });
    } finally {
      set({ mutating: false });
    }
  },

  toggleLineSelected: (key) =>
    set((s) => {
      const cur = s.selectedKeys[key] !== false;
      return { selectedKeys: { ...s.selectedKeys, [key]: !cur } };
    }),

  setAllSelected: (value) =>
    set((s) => {
      const next: Record<string, boolean> = {};
      for (const l of s.lines) next[l.key] = value;
      return { selectedKeys: next };
    }),
}));
