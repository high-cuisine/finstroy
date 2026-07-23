import AboutMap from "./AboutMap";
import { aboutMapCoverage, aboutMapStats } from "../../data/aboutData";
import styles from "./AboutMapSection.module.scss";

export default function AboutMapSection() {
  return (
    <section className={styles.section} aria-label="География присутствия компании">
      <AboutMap />

      <div className={styles.stats}>
        {aboutMapStats.map((item) => (
          <div key={item.title} className={styles.statItem}>
            <p className={styles.statTitle}>{item.title}</p>
            <p className={styles.statValue}>{item.value}</p>
          </div>
        ))}
      </div>

      <p className={styles.coverage}>{aboutMapCoverage}</p>
    </section>
  );
}
