"use client";

import { useCallback, useState } from "react";

export function useLightbox(count: number) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openAt = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const close = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => {
      if (i === null || count === 0) return null;
      return (i - 1 + count) % count;
    });
  }, [count]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => {
      if (i === null || count === 0) return null;
      return (i + 1) % count;
    });
  }, [count]);

  return { lightboxIndex, openAt, close, goPrev, goNext };
}
