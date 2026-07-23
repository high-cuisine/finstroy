import Image from "next/image";
import styles from "../catalog.module.scss";
import type { SortKey } from "../helpers/types";

const SORT_LABELS: Record<SortKey, string> = {
  popular: "Популярное",
  new: "Сначала новые",
  price_asc: "Цена ↑",
  price_desc: "Цена ↓",
};

function FiltersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3 5h14M6 10h8M8.5 15h3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CatalogToolbar(props: {
  query: string;
  hasQuery: boolean;
  onChangeQuery: (next: string) => void;
  onClearQuery: () => void;
  sort: SortKey;
  onChangeSort: (next: SortKey) => void;
}) {
  return (
    <>
    <div className={styles.tools}>
      <div className={styles.search}>
        <Image src="/icons/search.svg" alt="" width={20} height={20} />
        <input
          className={styles.searchInput}
          placeholder="Найти в каталоге"
          value={props.query}
          onChange={(e) => props.onChangeQuery(e.target.value)}
        />
        {props.hasQuery ? (
          <button
            type="button"
            className={styles.searchClear}
            onClick={props.onClearQuery}
            aria-label="Очистить поиск"
            title="Очистить"
          >
            ×
          </button>
        ) : null}
      </div>

      <select
        className={styles.select}
        value={props.sort}
        onChange={(e) => props.onChangeSort(e.target.value as SortKey)}
        aria-label="Сортировка"
      >
        <option value="popular">Популярное</option>
        <option value="new">Сначала новые</option>
        <option value="price_asc">Цена: по возрастанию</option>
        <option value="price_desc">Цена: по убыванию</option>
      </select>

      <button type="button" className={styles.pill} aria-label="Фильтры">
        Фильтры
      </button>
    </div>

    <div className={styles.mobileToolbar} role="toolbar" aria-label="Сортировка и фильтры">
      <label className={styles.mobileSortChip}>
        <span className={styles.mobileSortChipLabel}>{SORT_LABELS[props.sort]}</span>
        <ChevronDownIcon />
        <select
          className={styles.mobileSortSelect}
          value={props.sort}
          onChange={(e) => props.onChangeSort(e.target.value as SortKey)}
          aria-label="Сортировка"
        >
          <option value="popular">Популярное</option>
          <option value="new">Сначала новые</option>
          <option value="price_asc">Цена: по возрастанию</option>
          <option value="price_desc">Цена: по убыванию</option>
        </select>
      </label>

      <button type="button" className={styles.mobileFilterChip} aria-label="Фильтры">
        <FiltersIcon />
      </button>
    </div>
    </>
  );
}

