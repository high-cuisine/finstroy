import styles from "../catalog.module.scss";

export function CategoryFilterInfo(props: {
  label: string;
  count: number;
  onReset: () => void;
}) {
  return (
    <div className={styles.searchInfo} role="status" aria-live="polite">
      <div className={styles.searchInfoText}>
        Категория{" "}
        <span className={styles.searchInfoQuery}>«{props.label}»</span> —{" "}
        <span className={styles.searchInfoCount}>{props.count}</span>
      </div>
      <button type="button" className={styles.searchReset} onClick={props.onReset}>
        Сбросить
      </button>
    </div>
  );
}
