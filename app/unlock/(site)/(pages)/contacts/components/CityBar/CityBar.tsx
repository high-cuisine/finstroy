import {
  resolveDisplayCityName,
  type WpContactItem,
} from "@/app/features/wp/api/wpContactsApi";
import styles from "./CityBar.module.scss";

interface CityBarProps {
  items: WpContactItem[];
  activeSlug: string | null;
  loading: boolean;
  error: string | null;
  onChange: (slug: string) => void;
}

export default function CityBar({ items, activeSlug, loading, error, onChange }: CityBarProps) {
  return (
    <div className={styles.cityBar}>
      <div className={styles.cityBarInner}>
        {loading ? (
          <span className={styles.cityTabMuted}>Загрузка городов…</span>
        ) : error ? (
          <span className={styles.cityTabError}>{error}</span>
        ) : (
          items.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`${styles.cityTab}${activeSlug === c.slug ? ` ${styles.cityTabActive}` : ""}`}
              onClick={() => onChange(c.slug)}
            >
              {resolveDisplayCityName(c)}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
