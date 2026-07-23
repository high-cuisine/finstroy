"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./FaqSection.module.scss";

const faqItems = [
  {
    question: "Как различаются сорта фанеры и где они находят применение?",
    answer:
      "Фанера классифицируется по сортам от I до IV. Первый сорт — практически без дефектов, используется для финишной отделки и мебели. Второй допускает незначительные сучки и подходит для внутренней обшивки. Третий и четвёртый сорта применяются в строительстве, опалубке и упаковке.",
  },
  {
    question: "Какой клей предпочтительнее — ФК или ФСФ?",
    answer:
      "Универсальная листовая фанера — это строительный материал, состоящий из трех или пяти склеенных слоев древесины (шпонов). Существуют также многослойные варианты. Каждый шпон соединен с соседним с помощью специального клеящего вещества, а для повышения прочности волокна древесины располагаются перпендикулярно друг другу.",
  },
  {
    question: "В чем различия между хвойной и березовой фанерой?",
    answer:
      "Хвойная фанера производится из сосны или ели, она легче и дешевле, устойчива к влаге благодаря смолам. Берёзовая фанера прочнее и плотнее, обладает лучшими механическими характеристиками. Хвойная чаще используется в кровельных работах, берёзовая — в мебельном производстве и ответственных конструкциях.",
  },
  {
    question:
      "Какова оборачиваемость ламинированной фанеры у различных производителей?",
    answer:
      "Оборачиваемость ламинированной фанеры зависит от качества покрытия и условий эксплуатации. Продукция ведущих производителей выдерживает от 50 до 100 циклов заливки бетона. Ключевые факторы — плотность плёнки, качество проклейки торцов и соблюдение условий хранения.",
  },
  {
    question: "Какова роль антискользящей поверхности?",
    answer:
      "Антискользящее покрытие (сетчатое тиснение) обеспечивает безопасность при работе на высоте и наклонных поверхностях. Такая фанера применяется для настилов строительных лесов, полов транспортных средств и спортивных площадок. Покрытие наносится на одну или обе стороны листа.",
  },
  {
    question: "Как шлифовка фанеры влияет на допуски по толщине?",
    answer:
      "Шлифованная фанера (Ш1, Ш2) имеет более точные допуски по толщине — до ±0,5 мм, тогда как нешлифованная (НШ) допускает отклонения до ±1,0 мм. Шлифовка также улучшает адгезию клеев и лакокрасочных материалов, что важно для отделочных работ.",
  },
];

type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqSection(props: { items?: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number>(1);
  const items = props.items?.length ? props.items : faqItems;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Вопрос – ответ</h2>
        <p className={styles.subtitle}>
          Этими вопросами чаще всего задавались при выборе наши клиенты.
        </p>
      </div>

      <div className={styles.list}>
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className={styles.itemHeader}
              >
                <span className={styles.question}>{item.question}</span>
                <span className={styles.iconBtn}>
                  <Image
                    src={
                      isOpen ? "/images/btn-minus.svg" : "/images/btn-plus.svg"
                    }
                    alt={isOpen ? "Свернуть" : "Развернуть"}
                    width={28}
                    height={28}
                    className={styles.faqIcon}
                  />
                </span>
              </button>

              {item.answer && (
                <div
                  className={`${styles.answerWrapper} ${isOpen ? styles.answerWrapperOpen : ""}`}
                >
                  <div className={styles.answerInner}>
                    <p className={styles.answer}>{item.answer}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
