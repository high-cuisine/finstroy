"use client";

import { useEffect } from "react";
import type { FeedbackItem } from "@/app/features/wp/api/wpFeedbackApi";
import styles from "./ReviewLightbox.module.scss";

interface ReviewLightboxProps {
  reviews: FeedbackItem[];
  activeIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function ReviewLightbox({
  reviews,
  activeIndex,
  onClose,
  onPrev,
  onNext,
}: ReviewLightboxProps) {
  useEffect(() => {
    if (activeIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeIndex, onClose, onPrev, onNext]);

  if (activeIndex === null) return null;
  const current = reviews[activeIndex];
  if (!current) return null;

  return (
    <div
      className={styles.lightbox}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
    >
      <button
        type="button"
        className={styles.lightboxBackdrop}
        onClick={onClose}
        aria-label="Закрыть"
      />

      <div className={styles.lightboxContent}>
        <h2 id="lightbox-title" className={styles.srOnly}>
          {current.company}
        </h2>

        <button
          type="button"
          className={`${styles.lightboxNav} ${styles.lightboxNavPrev}`}
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label="Предыдущий отзыв"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className={styles.lightboxDocWrap} onClick={(e) => e.stopPropagation()}>
          <img src={current.imageUrl} alt={current.company} className={styles.reviewImageModal} />
        </div>

        <button
          type="button"
          className={`${styles.lightboxNav} ${styles.lightboxNavNext}`}
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label="Следующий отзыв"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <button
        type="button"
        className={styles.lightboxClose}
        onClick={onClose}
        aria-label="Закрыть"
      >
        ×
      </button>
    </div>
  );
}
