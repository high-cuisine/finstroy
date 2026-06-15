import styles from '../catalog.module.scss';

export function EmptyState(props: { hasQuery: boolean; onClearQuery?: () => void }) {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyTitle}>Ничего не нашли</div>
      <div className={styles.emptyText}>
        {props.hasQuery
          ? 'Попробуйте изменить фильтры или сбросить поиск.'
          : 'Попробуйте выбрать другой раздел.'}
      </div>
      {props.hasQuery ? (
        <button type="button" className={styles.emptyBtn} onClick={props.onClearQuery}>
          Сбросить фильтры
        </button>
      ) : null}
    </div>
  );
}

