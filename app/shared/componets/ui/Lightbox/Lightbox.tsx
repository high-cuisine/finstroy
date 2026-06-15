"use client";

import { useEffect } from "react";
import styles from "./Lightbox.module.scss";

export interface LightboxItem {
  src: string;
  alt?: string;
}

interface LightboxProps {
  items: LightboxItem[];
  activeIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({ items, activeIndex, onClose, onPrev, onNext }: LightboxProps) {
  useEffect(() => {
    if (activeIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [activeIndex, onClose, onPrev, onNext]);

  if (activeIndex === null) return null;
  const current = items[activeIndex];
  if (!current) return null;

  return (
    <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label={current.alt ?? "Просмотр"}>
      <button
        type="button"
        className={styles.backdrop}
        onClick={onClose}
        aria-label="Закрыть"
      />

      <div className={styles.content}>
        <button
          type="button"
          className={`${styles.nav} ${styles.navPrev}`}
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label="Предыдущий"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className={styles.imageWrap} onClick={(e) => e.stopPropagation()}>
          <img src={current.src} alt={current.alt ?? ""} className={styles.image} />
        </div>

        <button
          type="button"
          className={`${styles.nav} ${styles.navNext}`}
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label="Следующий"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <button
        type="button"
        className={styles.close}
        onClick={onClose}
        aria-label="Закрыть"
      >
        ×
      </button>
    </div>
  );
}
