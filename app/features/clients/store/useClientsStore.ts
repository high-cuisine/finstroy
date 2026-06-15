import { create } from "zustand";
import { getOurClientList, type OurClientItem } from "@/app/features/wp/api/wpOurClientApi";

interface ClientsState {
  items: OurClientItem[];
  loading: boolean;
  error: string | null;
  loaded: boolean;
  fetch: () => Promise<void>;
}

export const useClientsStore = create<ClientsState>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  loaded: false,

  fetch: async () => {
    if (get().loaded) return;
    set({ loading: true, error: null });
    try {
      const items = await getOurClientList();
      set({ items, loaded: true, error: null });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Ошибка загрузки клиентов" });
    } finally {
      set({ loading: false });
    }
  },
}));
