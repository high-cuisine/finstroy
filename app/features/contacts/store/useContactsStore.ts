import { create } from "zustand";
import { fetchContactPosts, type WpContactItem } from "@/app/features/wp/api/wpContactsApi";

interface ContactsState {
  items: WpContactItem[];
  loading: boolean;
  error: string | null;
  loaded: boolean;
  fetch: () => Promise<void>;
}

export const useContactsStore = create<ContactsState>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  loaded: false,

  fetch: async () => {
    if (get().loaded) return;
    set({ loading: true, error: null });
    try {
      const items = await fetchContactPosts();
      set({ items, loaded: true, error: null });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Ошибка загрузки контактов" });
    } finally {
      set({ loading: false });
    }
  },
}));
