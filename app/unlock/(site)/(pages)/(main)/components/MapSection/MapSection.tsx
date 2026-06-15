import type { WpContactItem } from "@/app/features/wp/api/wpContactsHelpers";
import MapSectionInteractive from "./MapSectionInteractive";
import styles from "./MapSection.module.scss";

export default function MapSection(props: {
  subtitle: string;
  contacts: WpContactItem[];
}) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>Представительства компании</h2>
          <p className={styles.subtitle}>{props.subtitle}</p>
        </div>

        <MapSectionInteractive contacts={props.contacts} />
      </div>
    </section>
  );
}
