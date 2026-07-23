"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  fetchMyOrders,
  formatOrderDate,
  normalizeWcOrderList,
  type WcOrderJson,
} from "@/app/features/orders";
import { parseErrorMessage } from "@/app/features/cart";
import { useUserStore } from "@/app/features/user";
import { sitePath } from "@/app/shared/lib/sitePath";
import styles from "./projects.module.scss";

function wcStatusToUi(
  s: string | undefined,
): "delivered" | "processing" | "cancelled" {
  if (!s) return "processing";
  if (s === "completed") return "delivered";
  if (["cancelled", "failed", "refunded"].includes(s)) return "cancelled";
  return "processing";
}

const statusLabel: Record<"delivered" | "processing" | "cancelled", string> = {
  delivered: "Выполнен",
  processing: "В обработке",
  cancelled: "Отменён",
};

export function ProjectsOrdersCta() {
  const token = useUserStore((s) => s.token);
  const [orders, setOrders] = useState<WcOrderJson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setOrders([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    void fetchMyOrders()
      .then(async (res) => {
        if (cancelled) return;
        if (!res.ok) {
          setError(await parseErrorMessage(res));
          setOrders([]);
          return;
        }
        const json: unknown = await res.json();
        setOrders(normalizeWcOrderList(json).slice(0, 3));
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Ошибка");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!token) {
    return (
      <section className={styles.ordersCta} aria-labelledby="projects-orders-heading">
        <h2 id="projects-orders-heading" className={styles.ordersCtaTitle}>
          Заказы
        </h2>
        <p className={styles.ordersCtaText}>
          Войдите в аккаунт, чтобы видеть историю заказов или оформить новый.
        </p>
        <Link href={sitePath("/account?tab=orders")} className={styles.ordersCtaLink}>
          Личный кабинет
        </Link>
      </section>
    );
  }

  return (
    <section className={styles.ordersCta} aria-labelledby="projects-orders-heading">
      <div className={styles.ordersCtaHead}>
        <h2 id="projects-orders-heading" className={styles.ordersCtaTitle}>
          Последние заказы
        </h2>
        <Link href={sitePath("/account?tab=orders")} className={styles.ordersCtaLink}>
          Все заказы
        </Link>
      </div>

      {loading ? (
        <p className={styles.ordersCtaMuted}>Загрузка…</p>
      ) : error ? (
        <p className={styles.ordersCtaMuted}>{error}</p>
      ) : orders.length === 0 ? (
        <p className={styles.ordersCtaMuted}>Пока нет заказов</p>
      ) : (
        <ul className={styles.ordersCtaList}>
          {orders.map((o) => {
            const id = typeof o.id === "number" ? o.id : 0;
            const ui = wcStatusToUi(o.status);
            return (
              <li key={id || o.number} className={styles.ordersCtaRow}>
                <span className={styles.ordersCtaMeta}>
                  № {o.number ?? id}
                  <span className={styles.ordersCtaDate}>
                    {formatOrderDate(o.date_created)}
                  </span>
                </span>
                <span className={`${styles.ordersCtaBadge} ${styles[`ordersCtaBadge_${ui}`]}`}>
                  {statusLabel[ui]}
                </span>
                <span className={styles.ordersCtaTotal}>
                  {o.total != null ? `${o.total} ${o.currency_symbol ?? "₽"}` : "—"}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
