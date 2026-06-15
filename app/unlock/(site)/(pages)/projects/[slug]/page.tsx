import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/app/shared/componets/layout/Header/Header";
import Footer from "@/app/shared/componets/layout/Footer/Footer";
import { getProjectBySlugFromPage } from "@/app/features/wp/api/wpProjectsApi";
import { sitePath } from "@/app/shared/lib/sitePath";
import styles from "./project.module.scss";

function ArrowLeft({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12.5 4.5L7 10l5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlugFromPage(slug);
  if (!project) return notFound();

  const contentParagraphs = project.content
    .replace(/<\/p>\s*<p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <article className={styles.projectCard}>
            <div className={styles.cover} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.imageSrc}
                alt=""
                className={styles.coverImg}
              />
              <Link href={sitePath("/projects")} className={styles.backLink}>
                <ArrowLeft className={styles.backLinkIcon} />
                Ко всем проектам
              </Link>
            </div>

            <header className={styles.header}>
              <div className={styles.date}>{project.date}</div>
              <h1 className={styles.h1}>{project.title}</h1>
              <p className={styles.lead}>{project.description}</p>
            </header>

            <section className={styles.content} aria-label="Описание проекта">
              {contentParagraphs.map((t, idx) => (
                <p key={idx} className={styles.p}>
                  {t}
                </p>
              ))}
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}

