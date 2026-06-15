"use client";

import { useCallback, useEffect } from "react";
import { useFeedbackStore } from "@/app/features/feedback";
import { useLightbox } from "./useLightbox";

export function useReviews() {
  const items = useFeedbackStore((s) => s.items);
  const loading = useFeedbackStore((s) => s.loading);
  const error = useFeedbackStore((s) => s.error);
  const fetch = useFeedbackStore((s) => s.fetch);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  const lightbox = useLightbox(items.length);

  return {
    reviews: items,
    isLoading: loading,
    error,
    ...lightbox,
  };
}
