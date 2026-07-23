"use client";

import { formatOrderDate, formatOrderStatus } from "@/app/features/orders";
import type { useOrdersTab } from "../../hooks/useOrdersTab";
import styles from "./OrdersTab.module.scss";

function wcStatusToUi(s: string | undefined): "delivered" | "processing" | "cancelled" {
  if (!s) return "processing";
  if (s === "completed") return "delivered";
  if (["cancelled", "failed", "refunded"].includes(s)) return "cancelled";
  return "processing";
}

type OrdersData = ReturnType<typeof useOrdersTab>;

interface OrdersTabProps {
  orders: OrdersData;
}

export default function OrdersTab({ orders }: OrdersTabProps) {
  const {
    apiOrders,
    ordersLoading,
    ordersError,
    openOrderId,
    orderDetail,
    detailLoading,
    detailError,
    toggleOrderDetail,
  } = orders;

  return (
    <div className={styles.card}>
      <h1 className={styles.cardTitle}>Заказы</h1>

      {ordersLoading ? (
        <p className={styles.emptyText}>Загрузка…</p>
      ) : ordersError ? (
        <p className={styles.emptyText} role="alert">
          {ordersError}
        </p>
      ) : apiOrders.length === 0 ? (
        <p className={styles.emptyText}>У вас пока нет заказов</p>
      ) : (
        <div className={styles.ordersList}>
          {apiOrders.map((order) => {
            const id = typeof order.id === "number" ? order.id : 0;
            const ui = wcStatusToUi(order.status);
            const lines = order.line_items ?? [];
            const title =
              typeof order.number === "string" && order.number.length > 0
                ? `№ ${order.number}`
                : `№ ${id}`;
            const totalStr =
              order.total != null
                ? `${order.total} ${order.currency_symbol ?? "₽"}`
                : "—";
            const expanded = openOrderId === id;

            return (
              <div key={id || title} className={styles.orderCard}>
                <div className={styles.orderTop}>
                  <div className={styles.orderMeta}>
                    <span className={styles.orderId}>{title}</span>
                    <span className={styles.orderDate}>
                      {formatOrderDate(order.date_created)}
                    </span>
                  </div>
                  <span
                    className={`${styles.orderStatus} ${styles[`orderStatus_${ui}`]}`}
                  >
                    {formatOrderStatus(order.status)}
                  </span>
                </div>

                <div className={styles.orderItems}>
                  {lines.slice(0, 4).map((li, i) => (
                    <span key={li.id ?? i} className={styles.orderItem}>
                      {typeof li.name === "string" ? li.name : "Позиция"}
                      {typeof li.quantity === "number" ? ` × ${li.quantity}` : ""}
                    </span>
                  ))}
                  {lines.length > 4 ? (
                    <span className={styles.orderItem}>и ещё {lines.length - 4}…</span>
                  ) : null}
                </div>

                <div className={styles.orderBottom}>
                  <span className={styles.orderTotal}>{totalStr}</span>
                  <button
                    type="button"
                    className={styles.orderDetailsBtn}
                    onClick={() => void toggleOrderDetail(id)}
                  >
                    {expanded ? "Свернуть" : "Подробнее"}
                  </button>
                </div>

                {expanded ? (
                  <div className={styles.orderDetail}>
                    {detailLoading ? (
                      <p className={styles.emptyText}>Загрузка…</p>
                    ) : detailError ? (
                      <p className={styles.emptyText} role="alert">
                        {detailError}
                      </p>
                    ) : orderDetail && orderDetail.id === id ? (
                      <ul className={styles.orderDetailList}>
                        {(orderDetail.line_items ?? []).map((li, i) => (
                          <li key={li.id ?? i}>
                            {li.name ?? "—"} × {li.quantity ?? "—"}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
