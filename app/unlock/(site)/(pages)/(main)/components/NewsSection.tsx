"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/app/shared/componets/ui/Button";
import { sitePath } from "@/app/shared/lib/sitePath";
import type { NewsListItem } from "@/app/features/wp/api/wpNewsApi";
import styles from "./NewsSection.module.scss";

export default function NewsSection(props: { items: NewsListItem[] }) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Новости Финстроя</h2>
        <p className={styles.subtitle}>
          Ключевые события в компании за последнее время
        </p>
      </div>

      <div className={styles.grid}>
        {props.items.map((news) => (
          <Link key={news.id} href={sitePath(`/news/${news.id}`)} className={styles.card}>
            <div className={styles.imageWrap}>
              {news.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={news.image}
                  alt={news.title}
                  className={styles.coverImage}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className={styles.imagePlaceholder} aria-hidden="true" />
              )}
            </div>

            <div className={styles.cardBody}>
              <span className={styles.date}>{news.date}</span>
              <h3 className={styles.cardTitle}>{news.title}</h3>
              <span className={styles.cardLink}>
                <span>Подробнее</span>
                <Image
                  src="/icons/arrow-right.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Link href={sitePath("/news")} className={styles.ctaLink}>
        <Button variant="grey" size="L" className={styles.cta}>
          Все новости компании
        </Button>
      </Link>
    </section>
  );
}
