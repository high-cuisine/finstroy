import type { FeedbackItem } from "@/app/features/wp/api/wpFeedbackApi";
import styles from "./ReviewsGrid.module.scss";

interface ReviewsGridProps {
  reviews: FeedbackItem[];
  loading: boolean;
  error: string | null;
  onOpen: (index: number) => void;
}

export default function ReviewsGrid({ reviews, loading, error, onOpen }: ReviewsGridProps) {
  return (
    <div className={styles.grid}>
      {loading && <p className={styles.statusText}>Загружаем отзывы...</p>}
      {!loading && error && <p className={styles.statusText}>Ошибка загрузки: {error}</p>}
      {!loading && !error && reviews.length === 0 && (
        <p className={styles.statusText}>Отзывы пока не опубликованы.</p>
      )}
      {reviews.map((r, index) => (
        <button
          key={r.id}
          type="button"
          className={styles.cardWrap}
          onClick={() => onOpen(index)}
          aria-label={`Открыть отзыв: ${r.company}`}
        >
          <img src={r.imageUrl} alt={r.company} className={styles.reviewImage} loading="lazy" />
          <span className={styles.cardCompany}>{r.company}</span>
        </button>
      ))}
    </div>
  );
}
