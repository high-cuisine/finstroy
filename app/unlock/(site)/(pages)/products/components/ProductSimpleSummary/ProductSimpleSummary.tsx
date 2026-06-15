"use client";

import Button from "@/app/shared/componets/ui/Button";
import styles from "../../products.module.scss";

type Props = {
  unitPrice: number | null;
  loading?: boolean;
  disabled?: boolean;
  mutating?: boolean;
  error?: string | null;
  onAddToCart: () => void;
};

export function ProductSimpleSummary({
  unitPrice,
  loading = false,
  disabled = false,
  mutating = false,
  error = null,
  onAddToCart,
}: Props) {
  const priceLabel =
    unitPrice === null
      ? "Цена по запросу"
      : `${unitPrice.toLocaleString("ru-RU")} ₽`;

  return (
    <div className={styles.productSummary}>
      <p className={styles.productSummaryPrice}>{priceLabel}</p>
      <p className={styles.productSummaryMeta}>Наличие: Отгрузим в течении 3 дней</p>

      <div className={styles.orderActions}>
        <Button
          variant="green"
          size="L"
          type="button"
          disabled={disabled || mutating || loading || unitPrice === null}
          onClick={onAddToCart}
        >
          {mutating ? "Добавляем…" : "В корзину"}
        </Button>
        {error ? (
          <span className={styles.orderError} role="alert">
            {error}
          </span>
        ) : null}
      </div>
    </div>
  );
}
