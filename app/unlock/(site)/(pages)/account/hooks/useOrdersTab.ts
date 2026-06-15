"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/app/features/user";
import {
  fetchMyOrders,
  fetchWcOrder,
  normalizeWcOrderList,
  type WcOrderJson,
} from "@/app/features/orders";
import { parseErrorMessage } from "@/app/features/cart";

export function useOrdersTab(active: boolean) {
  const token = useUserStore((s) => s.token);

  const [apiOrders, setApiOrders] = useState<WcOrderJson[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [openOrderId, setOpenOrderId] = useState<number | null>(null);
  const [orderDetail, setOrderDetail] = useState<WcOrderJson | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    if (!active || !token) {
      setApiOrders([]);
      setOrdersError(null);
      return;
    }
    let cancelled = false;
    setOrdersLoading(true);
    setOrdersError(null);
    void fetchMyOrders()
      .then(async (res) => {
        if (cancelled) return;
        if (!res.ok) {
          setOrdersError(await parseErrorMessage(res));
          setApiOrders([]);
          return;
        }
        const json: unknown = await res.json();
        setApiOrders(normalizeWcOrderList(json));
      })
      .catch((e) => {
        if (!cancelled) setOrdersError(e instanceof Error ? e.message : "Ошибка загрузки заказов");
      })
      .finally(() => {
        if (!cancelled) setOrdersLoading(false);
      });
    return () => { cancelled = true; };
  }, [active, token]);

  async function toggleOrderDetail(orderId: number) {
    if (openOrderId === orderId) {
      setOpenOrderId(null);
      setOrderDetail(null);
      setDetailError(null);
      return;
    }
    setOpenOrderId(orderId);
    setOrderDetail(null);
    setDetailError(null);
    setDetailLoading(true);
    try {
      const res = await fetchWcOrder(orderId);
      if (!res.ok) throw new Error(await parseErrorMessage(res));
      const json = (await res.json()) as WcOrderJson;
      setOrderDetail(json);
    } catch (e) {
      setDetailError(e instanceof Error ? e.message : "Не удалось загрузить заказ");
    } finally {
      setDetailLoading(false);
    }
  }

  return {
    apiOrders,
    ordersLoading,
    ordersError,
    openOrderId,
    orderDetail,
    detailLoading,
    detailError,
    toggleOrderDetail,
  };
}
