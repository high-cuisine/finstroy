import styles from '../catalog.module.scss';

export function SearchInfo(props: { query: string; count: number; onReset: () => void }) {
  return (
    <div className={styles.searchInfo} role="status" aria-live="polite">
      <div className={styles.searchInfoText}>
        Результаты по запросу{' '}
        <span className={styles.searchInfoQuery}>«{props.query.trim()}»</span> —{' '}
        <span className={styles.searchInfoCount}>{props.count}</span>
      </div>
      <button type="button" className={styles.searchReset} onClick={props.onReset}>
        Сбросить
      </button>
    </div>
  );
}

