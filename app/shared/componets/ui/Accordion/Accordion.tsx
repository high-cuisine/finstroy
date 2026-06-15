"use client";

import { useState } from "react";
import styles from "./Accordion.module.scss";

export interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  openIndex?: number;
  onToggle?: (index: number) => void;
  className?: string;
}

export default function Accordion({ items, openIndex, onToggle, className = "" }: AccordionProps) {
  const [internalOpen, setInternalOpen] = useState<number>(-1);

  const controlled = openIndex !== undefined && onToggle !== undefined;
  const activeIndex = controlled ? openIndex : internalOpen;

  function toggle(index: number) {
    if (controlled) {
      onToggle!(activeIndex === index ? -1 : index);
    } else {
      setInternalOpen((prev) => (prev === index ? -1 : index));
    }
  }

  return (
    <div className={[styles.accordion, className].filter(Boolean).join(" ")}>
      {items.map((item, index) => {
        const isOpen = activeIndex === index;
        return (
          <div
            key={item.question}
            className={[styles.item, isOpen ? styles.itemOpen : ""].filter(Boolean).join(" ")}
          >
            <button
              type="button"
              className={styles.question}
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <span className={styles.icon} aria-hidden>
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && <p className={styles.answer}>{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
