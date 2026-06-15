"use client";

import { useState } from "react";
import { supportFaq } from "../../data/accountData";
import styles from "./SupportTab.module.scss";

export default function SupportTab() {
  const [openFaq, setOpenFaq] = useState(1);

  return (
    <div className={`${styles.card} ${styles.supportCard}`}>
      <h1 className={styles.cardTitle}>Поддержка Финстрой</h1>

      <div className={styles.supportContacts}>
        <div className={styles.supportContact}>
          <span className={styles.supportContactTitle}>Написать на почту</span>
          <a href="mailto:info@fin-sm.ru" className={styles.supportContactLink}>
            info@fin-sm.ru
          </a>
          <span className={styles.supportHint}>Отвечаем в течение 1 рабочего дня</span>
        </div>

        <div className={styles.supportContact}>
          <span className={styles.supportContactTitle}>Позвонить</span>
          <a href="tel:+78005500220" className={styles.supportContactLink}>
            +7 800 550 02 20
          </a>
        </div>
      </div>

      <div className={styles.faqBlock}>
        <h2 className={styles.faqTitle}>Вопрос — ответ</h2>

        <div className={styles.faqList}>
          {supportFaq.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={item.question}
                className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ""}`}
              >
                <button
                  type="button"
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <span className={styles.faqIcon} aria-hidden>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen ? <p className={styles.faqAnswer}>{item.answer}</p> : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
