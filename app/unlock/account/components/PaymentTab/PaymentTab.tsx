"use client";

import { useState } from "react";
import { savedCards, type Card } from "../../data/accountData";
import styles from "./PaymentTab.module.scss";

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

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CreditCardIcon({ type }: { type: Card["type"] }) {
  if (type === "sber") {
    return (
      <span className={`${styles.bankLogo} ${styles.bankLogoSber}`} aria-label="Сбер">
        <span className={styles.sberMark} aria-hidden />
        <span>СБЕР</span>
      </span>
    );
  }

  if (type === "tbank") {
    return (
      <span className={`${styles.bankLogo} ${styles.bankLogoTbank}`} aria-label="Т-Банк">
        <span className={styles.tbankMark} aria-hidden>T</span>
        <span>БАНК</span>
      </span>
    );
  }

  return (
    <span className={`${styles.bankLogo} ${styles.bankLogoAlfa}`} aria-label="Альфа-Банк">
      АЛЬФА
    </span>
  );
}

export default function PaymentTab() {
  const [cards, setCards] = useState<Card[]>(savedCards);

  function removeCard(id: number) {
    setCards((cs) => cs.filter((c) => c.id !== id));
  }

  return (
    <div className={`${styles.card} ${styles.paymentCard}`}>
      <h1 className={styles.cardTitle}>Способы оплаты</h1>

      <div className={styles.paymentMethodsGrid}>
        {cards.map((card) => (
          <div key={card.id} className={styles.payMethodCard}>
            <CreditCardIcon type={card.type} />
            <span className={styles.payMethodLabel}>
              {card.label} **{card.last4}
            </span>

            <div className={styles.payMethodOverlay}>
              <button
                className={styles.payMethodRemove}
                onClick={() => removeCard(card.id)}
                aria-label={`Удалить ${card.label}`}
              >
                <TrashIcon />
                <span>Удалить</span>
              </button>
            </div>
          </div>
        ))}

        <button className={styles.addPaymentMethodBtn} type="button">
          <PlusIcon />
          <span>Добавить способ</span>
        </button>
      </div>
    </div>
  );
}
