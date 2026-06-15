"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildOfficeCardViewModel,
  type WpContactItem,
} from "@/app/features/wp/api/wpContactsHelpers";
import styles from "./MapSection.module.scss";

function ChevronIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d={direction === "prev" ? "M10 3L5 8L10 13" : "M6 3L11 8L6 13"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function findDefaultIndex(contacts: WpContactItem[]) {
  const spbIndex = contacts.findIndex((contact) =>
    contact.slug.includes("peterburg") || contact.title.toLowerCase().includes("петербург"),
  );

  return spbIndex >= 0 ? spbIndex : 0;
}

export default function OfficeCardSlider({
  contacts,
  controlledIndex,
  onIndexChange,
}: {
  contacts: WpContactItem[];
  controlledIndex?: number;
  onIndexChange?: (i: number) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(() =>
    controlledIndex ?? findDefaultIndex(contacts),
  );

  useEffect(() => {
    if (controlledIndex !== undefined) setActiveIndex(controlledIndex);
  }, [controlledIndex]);

  const cards = useMemo(
    () => contacts.map((contact) => buildOfficeCardViewModel(contact)),
    [contacts],
  );

  if (cards.length === 0) {
    return null;
  }

  const safeIndex = ((activeIndex % cards.length) + cards.length) % cards.length;
  const activeCard = cards[safeIndex];

  const goPrev = () => {
    const next = (activeIndex - 1 + cards.length) % cards.length;
    setActiveIndex(next);
    onIndexChange?.(next);
  };

  const goNext = () => {
    const next = (activeIndex + 1) % cards.length;
    setActiveIndex(next);
    onIndexChange?.(next);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>
            Финстрой <span>{activeCard.cityHeading}</span>
          </h3>
          <span className={styles.cardCompany}>{activeCard.companyName}</span>
        </div>

        <div className={styles.cardNav}>
          <button
            type="button"
            className={styles.cardNavBtn}
            onClick={goPrev}
            aria-label="Предыдущий город"
          >
            <ChevronIcon direction="prev" />
          </button>
          <button
            type="button"
            className={styles.cardNavBtn}
            onClick={goNext}
            aria-label="Следующий город"
          >
            <ChevronIcon direction="next" />
          </button>
        </div>
      </div>

      <div className={styles.cardBody} key={activeCard.slug}>
        {activeCard.fields.map((field) => (
          <div key={`${activeCard.slug}-${field.label}`} className={styles.cardField}>
            <span className={styles.cardFieldLabel}>{field.label}</span>
            {field.href ? (
              <a href={field.href} className={styles.cardFieldValue}>
                {field.value}
              </a>
            ) : (
              <span className={styles.cardFieldValue}>{field.value}</span>
            )}
          </div>
        ))}
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.cardCounter}>
          {safeIndex + 1} / {cards.length}
        </span>
        <span className={styles.cardCityName}>{activeCard.cityTitle}</span>
      </div>
    </div>
  );
}
