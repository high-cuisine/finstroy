import Image from "next/image";
import styles from "./HeroSection.module.scss";

export default function HeroSection(props: {
  title: string;
  videoLabel: string;
  stats: Array<{ value: string; label: string }>;
}) {
  return (
    <section className={styles.hero}>
      {/* Левая часть: 4 колонки */}
      <div className={styles.left}>
        <h1 className={styles.title}>
          {props.title}
        </h1>

        <div className={styles.divider} />

        <div className={styles.stats}>
          {props.stats.map((s) => (
            <div key={s.value} className={styles.statItem}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Правая часть: 8 колонок */}
      <div className={styles.right}>
        <video
          className={styles.video}
          src="/video/banner.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <button className={styles.videoBadge} type="button">
          <Image src="/icons/play.svg" alt="" width={24} height={24} />
          <span>{props.videoLabel}</span>
        </button>
      </div>
    </section>
  );
}