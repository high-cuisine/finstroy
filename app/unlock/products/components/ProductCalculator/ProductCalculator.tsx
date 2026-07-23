import Button from "@/app/shared/componets/ui/Button";
import type { Format, Thickness } from "../../data/productSpec";
import styles from "./ProductCalculator.module.scss";

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Checkmark() {
  return (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
      <path d="M1 5l3.5 3.5L11 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface ProductCalculatorProps {
  formats: Format[];
  thicknesses: Thickness[];
  formatIdx: number;
  setFormatIdx: (i: number) => void;
  thicknessIdx: number;
  setThicknessIdx: (i: number) => void;
  sheets: number;
  setSheets: (n: number) => void;
  reserve: boolean;
  setReserve: (v: boolean) => void;
  area: number;
  volume: number;
  weight: number;
  total: string;
  effectiveSheets: number;
  calculatorUnitPrice: number;
  canAddToCart: boolean;
  cartMutating: boolean;
  productIdLoading: boolean;
  productIdError: string | null;
  cartError: string | null;
  onAddToCart: () => void;
}

export default function ProductCalculator({
  formats,
  thicknesses,
  formatIdx,
  setFormatIdx,
  thicknessIdx,
  setThicknessIdx,
  sheets,
  setSheets,
  reserve,
  setReserve,
  area,
  volume,
  weight,
  total,
  effectiveSheets,
  calculatorUnitPrice,
  canAddToCart,
  cartMutating,
  productIdLoading,
  productIdError,
  cartError,
  onAddToCart,
}: ProductCalculatorProps) {
  return (
    <div className={styles.calcColumn}>
      {/* Format */}
      <div>
        <label className={styles.fieldLabel}>Формат фанеры:</label>
        <div className={styles.selectWrap}>
          <select
            className={`${styles.select} ${formatIdx === -1 ? styles.selectPlaceholder : styles.selectFilled}`}
            value={formatIdx}
            onChange={(e) => setFormatIdx(Number(e.target.value))}
          >
            <option value={-1} disabled>Нажмите для выбора</option>
            {formats.map((f, i) => (
              <option key={i} value={i}>{f.label}</option>
            ))}
          </select>
          <ChevronDown className={styles.selectArrow} />
        </div>
      </div>

      {/* Thickness */}
      <div>
        <label className={styles.fieldLabel}>Толщина листа:</label>
        <div className={styles.selectWrap}>
          <select
            className={`${styles.select} ${thicknessIdx === -1 ? styles.selectPlaceholder : styles.selectFilled}`}
            value={thicknessIdx}
            onChange={(e) => setThicknessIdx(Number(e.target.value))}
          >
            <option value={-1} disabled>Нажмите для выбора</option>
            {thicknesses.map((t, i) => (
              <option key={i} value={i}>{t.label}</option>
            ))}
          </select>
          <ChevronDown className={styles.selectArrow} />
        </div>
      </div>

      {/* Sheets / Area */}
      <div className={styles.inputsRow}>
        <div className={styles.inputGroup}>
          <label className={styles.fieldLabel}>Листов (шт)</label>
          <input
            className={`${styles.input} ${styles.inputEditable}`}
            type="number"
            min={0}
            value={sheets}
            onChange={(e) => setSheets(Math.max(0, Number(e.target.value)))}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.fieldLabel}>Площадь (м²)</label>
          <input className={styles.input} type="number" readOnly value={area} />
        </div>
      </div>

      {/* Volume / Weight */}
      <div className={styles.inputsRow}>
        <div className={styles.inputGroup}>
          <label className={`${styles.fieldLabel} ${styles.fieldLabelGrey}`}>Объем (м³)</label>
          <input className={styles.input} type="number" readOnly value={volume} />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.fieldLabel}>Вес (кг)</label>
          <input className={styles.input} type="number" readOnly value={weight} />
        </div>
      </div>

      {/* Reserve checkbox */}
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          className={styles.checkboxInput}
          checked={reserve}
          onChange={(e) => setReserve(e.target.checked)}
        />
        <span className={`${styles.checkboxBox} ${!reserve ? styles.checkboxBoxOff : ""}`}>
          {reserve && <Checkmark />}
        </span>
        <span className={styles.checkboxLabel}>+ 10% запас для подрезки</span>
      </label>

      {/* Availability + price */}
      <div className={styles.infoRow}>
        <span className={styles.infoText}>Наличие: Отгрузим в течении 3 дней</span>
        <span className={styles.infoText}>Цена: {calculatorUnitPrice.toLocaleString("ru-RU")} ₽ за лист</span>
      </div>

      {/* Total + CTA */}
      <div className={styles.totalRow}>
        <span className={styles.totalText}>Итого: {total} ₽</span>
        <div className={styles.orderActions}>
          <Button
            variant="green"
            size="L"
            type="button"
            disabled={!canAddToCart}
            onClick={onAddToCart}
          >
            {cartMutating ? "Добавляем…" : "Добавить в заказ"}
          </Button>
          {productIdLoading && <span className={styles.orderHint}>Подготовка корзины…</span>}
          {productIdError && <span className={styles.orderError} role="alert">{productIdError}</span>}
          {cartError && <span className={styles.orderError} role="alert">{cartError}</span>}
          {!productIdLoading && !productIdError && effectiveSheets < 1 && (
            <span className={styles.orderHint}>Укажите число листов (от 1), чтобы добавить в корзину</span>
          )}
        </div>
      </div>
    </div>
  );
}
