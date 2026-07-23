"use client";

import Button from "@/app/shared/componets/ui/Button";
import { useCartStore } from "@/app/features/cart";
import styles from "./CartTab.module.scss";

function TrashIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3 5h14M8 5V3h4v2M6 5l1 12h6l1-12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckmarkIcon() {
  return (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
      <path
        d="M1 5l3.5 3.5L11 1"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface CartTabProps {
  onCheckout: () => void;
  checkoutBusy: boolean;
  checkoutError: string | null;
  checkoutModalOpen: boolean;
}

export default function CartTab({
  onCheckout,
  checkoutBusy,
  checkoutError,
  checkoutModalOpen,
}: CartTabProps) {
  const cartLines = useCartStore((s) => s.lines);
  const cartLoading = useCartStore((s) => s.loading);
  const cartMutating = useCartStore((s) => s.mutating);
  const cartError = useCartStore((s) => s.error);
  const currencySymbol = useCartStore((s) => s.currencySymbol);
  const isLineSelected = useCartStore((s) => s.isLineSelected);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeLine = useCartStore((s) => s.removeLine);
  const clearCart = useCartStore((s) => s.clearCart);
  const toggleLineSelected = useCartStore((s) => s.toggleLineSelected);
  const setAllSelected = useCartStore((s) => s.setAllSelected);

  const checkedLines = cartLines.filter((l) => isLineSelected(l.key));
  const totalQty = checkedLines.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = checkedLines.reduce((s, i) => s + i.lineTotal, 0);
  const totalWeight = +(totalQty * 0.85).toFixed(1);

  function selectAll() {
    const allOn = cartLines.length > 0 && cartLines.every((l) => isLineSelected(l.key));
    setAllSelected(!allOn);
  }

  return (
    <div className={styles.cartLayout}>
      <div className={styles.cartLeft}>
        {cartMutating && (
          <div className={styles.cartMutatingOverlay} aria-hidden="true">
            <div className={styles.cartSpinner} />
          </div>
        )}

        <div className={styles.cartHeader}>
          <div className={styles.cartTitleRow}>
            <span className={styles.cartTitle}>Корзина</span>
            <span className={styles.cartCount}>{cartLines.length}</span>
          </div>
          <div className={styles.cartControls}>
            <span className={styles.cartSelected}>
              Выбрано: {checkedLines.length} из {cartLines.length} позиций
            </span>
            <label className={styles.cartCheck}>
              <input
                type="checkbox"
                className={styles.checkboxHidden}
                checked={cartLines.length > 0 && cartLines.every((l) => isLineSelected(l.key))}
                onChange={selectAll}
                disabled={cartMutating || cartLines.length === 0}
              />
              <span
                className={`${styles.checkBox} ${
                  cartLines.length > 0 && cartLines.every((l) => isLineSelected(l.key))
                    ? styles.checkBoxOn
                    : ""
                }`}
              >
                {cartLines.length > 0 && cartLines.every((l) => isLineSelected(l.key)) && (
                  <CheckmarkIcon />
                )}
              </span>
              Выбрать все
            </label>
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => void clearCart()}
              disabled={cartMutating || cartLines.length === 0}
            >
              <TrashIcon />
              Очистить корзину
            </button>
          </div>
        </div>

        {cartError ? (
          <p className={styles.emptyText} role="alert">
            {cartError}{" "}
            <button
              type="button"
              className={styles.stubLink}
              onClick={() => void fetchCart()}
            >
              Повторить
            </button>
          </p>
        ) : null}

        <div className={styles.cartItems}>
          {cartLoading && cartLines.length === 0 ? (
            <p className={styles.emptyText}>Загрузка корзины…</p>
          ) : null}
          {!cartLoading && cartLines.length === 0 ? (
            <p className={styles.emptyText}>Корзина пуста</p>
          ) : null}
          {cartLines.map((item) => {
            const selected = isLineSelected(item.key);
            return (
              <div
                key={item.key}
                className={`${styles.cartItem} ${!selected ? styles.cartItemFaded : ""}`}
              >
                <label className={styles.cartItemCheck}>
                  <input
                    type="checkbox"
                    className={styles.checkboxHidden}
                    checked={selected}
                    onChange={() => toggleLineSelected(item.key)}
                    disabled={cartMutating}
                  />
                  <span className={`${styles.checkBox} ${selected ? styles.checkBoxOn : ""}`}>
                    {selected && <CheckmarkIcon />}
                  </span>
                </label>

                <div
                  className={styles.cartItemImg}
                  style={
                    item.imageUrl
                      ? {
                          backgroundImage: `url(${item.imageUrl})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                />

                <div className={styles.cartItemInfo}>
                  <span className={styles.cartItemName}>{item.name}</span>
                  <div className={styles.cartItemPriceRow}>
                    <span className={styles.cartItemPrice}>
                      {item.unitPrice.toLocaleString("ru-RU", { minimumFractionDigits: 2 })}{" "}
                      {currencySymbol}
                    </span>
                    {item.regularPrice != null && item.regularPrice > item.unitPrice ? (
                      <span className={styles.cartItemOldPrice}>
                        {item.regularPrice.toLocaleString("ru-RU", { minimumFractionDigits: 2 })}{" "}
                        {currencySymbol}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className={styles.cartItemRight}>
                  <div className={styles.qtyGroup}>
                    <div className={styles.qtyCounter}>
                      <button
                        type="button"
                        className={styles.qtyBtn}
                        disabled={cartMutating}
                        onClick={() => void updateQuantity(item.key, item.quantity - 1)}
                      >
                        <MinusIcon />
                      </button>
                      <span className={styles.qtyVal}>{item.quantity}</span>
                      <button
                        type="button"
                        className={styles.qtyBtn}
                        disabled={cartMutating}
                        onClick={() => void updateQuantity(item.key, item.quantity + 1)}
                      >
                        <PlusIcon />
                      </button>
                    </div>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      disabled={cartMutating}
                      onClick={() => void removeLine(item.key)}
                    >
                      Удалить товар
                    </button>
                  </div>
                  <span className={styles.cartItemTotal}>
                    {item.lineTotal.toLocaleString("ru-RU", { minimumFractionDigits: 2 })}{" "}
                    {currencySymbol}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.cartSummary}>
        <div className={styles.summaryLines}>
          <div className={styles.summaryLine}>
            <span className={styles.summaryKey}>Вес заказа (оценка)</span>
            <span className={styles.summaryVal}>~ {totalWeight} кг</span>
          </div>
          <div className={styles.summaryLine}>
            <span className={styles.summaryKey}>Товары ({totalQty})</span>
            <span className={styles.summaryVal}>
              {totalPrice.toLocaleString("ru-RU", { minimumFractionDigits: 2 })}{" "}
              {currencySymbol}
            </span>
          </div>
        </div>

        <div className={styles.summaryTotal}>
          <span className={styles.summaryTotalLabel}>Итого:</span>
          <span className={styles.summaryTotalVal}>
            {totalPrice.toLocaleString("ru-RU", { minimumFractionDigits: 2 })}{" "}
            {currencySymbol}
          </span>
        </div>

        {checkoutError && !checkoutModalOpen ? (
          <p className={styles.emptyText} role="alert">
            {checkoutError}
          </p>
        ) : null}

        <Button
          variant="green"
          size="L"
          className={styles.btnFull}
          disabled={totalQty === 0 || cartMutating || checkoutBusy}
          onClick={onCheckout}
        >
          Оформить заказ
        </Button>
      </div>
    </div>
  );
}
