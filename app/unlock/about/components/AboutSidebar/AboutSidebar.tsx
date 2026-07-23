import styles from "./AboutSidebar.module.scss";

interface SectionItem {
  key: string;
  label: string;
}

interface AboutSidebarProps {
  sections: SectionItem[];
  active: string;
  onChange: (key: string) => void;
}

export default function AboutSidebar({ sections, active, onChange }: AboutSidebarProps) {
  return (
    <aside className={styles.sidebar} aria-label="Разделы о компании">
      <div className={styles.sidebarTitle}>О компании</div>
      <nav className={styles.sidebarNav}>
        {sections.map((s) => (
          <button
            key={s.key}
            type="button"
            className={`${styles.sidebarLink}${active === s.key ? ` ${styles.sidebarLinkActive}` : ""}`}
            onClick={() => onChange(s.key)}
          >
            {s.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
