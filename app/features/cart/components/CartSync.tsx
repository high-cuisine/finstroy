"use client";

import { useEffect } from "react";
import { useUserStore } from "@/app/features/user";
import { useCartStore } from "../store/useCartStore";

/** Первичная загрузка корзины и повтор при смене сессии пользователя. */
export function CartSync() {
  const token = useUserStore((s) => s.token);
  const fetchCart = useCartStore((s) => s.fetchCart);

  useEffect(() => {
    void fetchCart();
  }, [fetchCart, token]);

  return null;
}
