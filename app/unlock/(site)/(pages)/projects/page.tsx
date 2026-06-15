import Link from "next/link";
import Header from "@/app/shared/componets/layout/Header/Header";
import Footer from "@/app/shared/componets/layout/Footer/Footer";
import { getProjectList } from "@/app/features/wp/api/wpProjectsApi";
import { sitePath } from "@/app/shared/lib/sitePath";
import { ProjectsOrdersCta } from "./ProjectsOrdersCta";
import styles from "./projects.module.scss";

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

export default async function ProjectsPage() {
  const projects = await getProjectList();

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.hero}>
            <h1 className={styles.title}>Проекты</h1>
            <p className={styles.subtitle}>
              На протяжении лет «ФИНСТРОЙ» выполняет свои задачи в работе с крупными заказчиками на
              высоком уровне. Мы всегда открыты к сотрудничеству.
            </p>
          </header>

          <section className={styles.grid} aria-label="Проекты">
            {projects.length === 0 && (
              <p className={styles.statusText}>Список проектов пока пуст.</p>
            )}
            {projects.map((p) => (
              <Link key={p.id} href={sitePath(`/projects/${p.slug}`)} className={styles.card}>
                <div className={styles.cardMedia} aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.imageSrc}
                    alt=""
                    className={styles.cardImg}
                  />
                </div>

                <div className={styles.cardBody}>
                  <span className={styles.cardDate}>{p.date}</span>
                  <h2 className={styles.cardTitle}>{p.title}</h2>
                  {p.description && <p className={styles.cardDescription}>{p.description}</p>}
                  <span className={styles.cardLink}>
                    Подробнее <ArrowRight className={styles.cardLinkIcon} />
                  </span>
                </div>
              </Link>
            ))}
          </section>

          <ProjectsOrdersCta />
        </div>
      </main>

      <Footer />
    </div>
  );
}

