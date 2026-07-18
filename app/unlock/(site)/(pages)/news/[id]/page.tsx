import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/app/shared/componets/layout/Header/Header";
import Footer from "@/app/shared/componets/layout/Footer/Footer";
import { getNewsById } from "@/app/features/wp/api/wpNewsApi";
import { sitePath } from "@/app/shared/lib/sitePath";
import styles from "./article.module.scss";

export const revalidate = 180;

function ArrowLeft({ className }: { className?: string }) {
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
        d="M13 4l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const articleId = Number(id);
  if (!Number.isFinite(articleId)) {
    return notFound();
  }

  const article = await getNewsById(articleId);

  if (!article) return notFound();

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.outer}>
          <article className={styles.card}>
            {/* ── Image with back button ── */}
            <div className={styles.imageWrap}>
              {article.image ? (
                <div className={styles.image}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.image}
                    alt=""
                    className={styles.imageImg}
                  />
                </div>
              ) : null}
              <Link href={sitePath("/news")} className={styles.backBtn}>
                <ArrowLeft className={styles.backIcon} />
                Ко всем новостям
              </Link>
            </div>

            {/* ── Date + Title ── */}
            <div className={styles.titleSection}>
              <span className={styles.date}>{article.date}</span>
              <h1 className={styles.title}>{article.title}</h1>
            </div>

            {/* ── Body ── */}
            <div className={styles.body}>
              {article.body.map((paragraph, i) => (
                <p key={i} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
