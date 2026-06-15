import Image from "next/image";
import Link from "next/link";
import { sitePath } from "@/app/shared/lib/sitePath";
import styles from "./ClientsSection.module.scss";

export default function ClientsSection(props: { subtitle: string }) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>Наши клиенты</h2>
          <p className={styles.subtitle}>{props.subtitle}</p>
        </div>

        <div className={styles.logos}>
          <Image
            src="/icons/clients-logos.svg"
            alt="Логотипы клиентов"
            width={1376}
            height={231}
            className={styles.logosImage}
          />
        </div>

        <div className={styles.buttons}>
          <Link href={sitePath("/about#clients")} className={`${styles.buttonLink} ${styles.buttonGreen}`}>
            Наши клиенты
          </Link>
          <Link href={sitePath("/reviews")} className={`${styles.buttonLink} ${styles.buttonGrey}`}>
            Отзывы о нас
          </Link>
        </div>
      </div>
    </section>
  );
}
