import styles from '../catalog.module.scss';

export function Pagination(props: {
  totalPages: number;
  page: number;
  onChangePage: (next: number) => void;
}) {
  if (props.totalPages <= 1) return null;

  return (
    <div className={styles.pagination} aria-label="Пагинация">
      {Array.from({ length: props.totalPages })
        .slice(0, 7)
        .map((_, idx) => {
          const p = idx + 1;
          return (
            <button
              key={p}
              type="button"
              className={`${styles.pageBtn}${p === props.page ? ` ${styles.pageBtnActive}` : ''}`}
              onClick={() => props.onChangePage(p)}
              aria-current={p === props.page ? 'page' : undefined}
            >
              {p}
            </button>
          );
        })}
    </div>
  );
}

