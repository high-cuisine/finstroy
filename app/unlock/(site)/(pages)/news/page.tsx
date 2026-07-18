import Link from "next/link";
import Header from "@/app/shared/componets/layout/Header/Header";
import Footer from "@/app/shared/componets/layout/Footer/Footer";
import { getNewsList } from "@/app/features/wp/api/wpNewsApi";
import { sitePath } from "@/app/shared/lib/sitePath";
import { CONTENT_REVALIDATE_SECONDS } from "@/app/shared/lib/isr";
import styles from "./news.module.scss";

export const revalidate = CONTENT_REVALIDATE_SECONDS;

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 4l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function NewsPage() {
  const newsItems = await getNewsList();

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <span className={styles.breadcrumbTitle}>Новости</span>
          </div>

          <div className={styles.grid}>
            {newsItems.length === 0 && (
              <p className={styles.statusText}>Список новостей пока пуст.</p>
            )}
            {newsItems.map((item) => (
              <Link
                key={item.id}
                href={sitePath(`/news/${item.id}`)}
                className={styles.card}
              >
                <div className={styles.cardImage}>
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt=""
                      className={styles.cardImageImg}
                    />
                  ) : (
                    <div className={styles.cardImagePlaceholder} aria-hidden="true" />
                  )}
                </div>

                <div className={styles.cardBody}>
                  <span className={styles.cardDate}>{item.date}</span>
                  <h2 className={styles.cardTitle}>{item.title}</h2>
                  <span className={styles.cardLink}>
                    Подробнее
                    <ArrowRight className={styles.cardLinkIcon} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
