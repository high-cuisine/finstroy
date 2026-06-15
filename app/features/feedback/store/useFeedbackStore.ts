import { create } from "zustand";
import { getFeedbackList, type FeedbackItem } from "@/app/features/wp/api/wpFeedbackApi";

interface FeedbackState {
  items: FeedbackItem[];
  loading: boolean;
  error: string | null;
  loaded: boolean;
  fetch: () => Promise<void>;
}

export const useFeedbackStore = create<FeedbackState>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  loaded: false,

  fetch: async () => {
    if (get().loaded) return;
    set({ loading: true, error: null });
    try {
      const items = await getFeedbackList();
      set({ items, loaded: true, error: null });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Ошибка загрузки отзывов" });
    } finally {
      set({ loading: false });
    }
  },
}));
