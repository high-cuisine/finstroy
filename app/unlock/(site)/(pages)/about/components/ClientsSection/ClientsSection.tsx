"use client";

import { useEffect } from "react";
import { useClientsStore } from "@/app/features/clients";
import styles from "./ClientsSection.module.scss";

export default function ClientsSection() {
  const items = useClientsStore((s) => s.items);
  const loading = useClientsStore((s) => s.loading);
  const error = useClientsStore((s) => s.error);
  const fetch = useClientsStore((s) => s.fetch);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return (
    <div className={`${styles.section} ${styles.clientsSection}`}>
      <h1 className={styles.clientsTitle}>Наши клиенты</h1>

      <p className={styles.clientsLead}>
        На протяжении лет «ФИНСТРОЙ» выполняет свои задачи в работе с крупными заказчиками на высоком
        уровне. Мы всегда открыты к сотрудничеству.
      </p>

      <section className={styles.clientsGrid} aria-label="Клиенты компании">
        {loading && <p className={styles.clientsStatus}>Загружаем клиентов...</p>}
        {!loading && error && <p className={styles.clientsStatus}>Ошибка загрузки: {error}</p>}
        {!loading && !error && items.length === 0 && (
          <p className={styles.clientsStatus}>Список клиентов пока пуст.</p>
        )}
        {items.map((client, idx) => (
          <div
            key={client.id}
            className={`${styles.clientCard}${idx === 0 ? ` ${styles.clientCardActive}` : ""}`}
          >
            <span className={styles.clientLabel}>{client.name}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
