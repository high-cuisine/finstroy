"use client";

import Header from "@/app/shared/componets/layout/Header/Header";
import Footer from "@/app/shared/componets/layout/Footer/Footer";
import { useReviews } from "./hooks/useReviews";
import ReviewsGrid from "./components/ReviewsGrid/ReviewsGrid";
import ReviewLightbox from "./components/ReviewLightbox/ReviewLightbox";
import styles from "./reviews.module.scss";

export default function ReviewsPage() {
  const { reviews, isLoading, error, lightboxIndex, openAt, close, goPrev, goNext } = useReviews();

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Отзывы наших клиентов</h1>
            <p className={styles.subtitle}>
              Наши клиенты остаются довольны долгосрочным сотрудничеством с нами. Многие из них делятся
              положительными отзывами о нашем сервисе и качестве работы, что вдохновляет нас продолжать
              развиваться и улучшать наши услуги.
            </p>
          </div>

          <ReviewsGrid
            reviews={reviews}
            loading={isLoading}
            error={error}
            onOpen={openAt}
          />
        </div>
      </main>

      <Footer />

      <ReviewLightbox
        reviews={reviews}
        activeIndex={lightboxIndex}
        onClose={close}
        onPrev={goPrev}
        onNext={goNext}
      />
    </div>
  );
}
