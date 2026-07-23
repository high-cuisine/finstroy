"use client";

import { useState } from "react";
import { useUserStore } from "@/app/features/user";
import { postStoreCheckout, parseErrorMessage, useCartStore } from "@/app/features/cart";
import type { CheckoutBillingAddress } from "../CheckoutBillingModal";

export function useCheckout(onSuccess: () => void) {
  const token = useUserStore((s) => s.token);
  const fetchCart = useCartStore((s) => s.fetchCart);

  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  function openCheckoutModal() {
    if (!token || checkoutBusy) return;
    setCheckoutError(null);
    setCheckoutModalOpen(true);
  }

  async function submitCheckout(billing: CheckoutBillingAddress) {
    if (!token) return;
    setCheckoutBusy(true);
    setCheckoutError(null);
    try {
      const res = await postStoreCheckout({
        billing_address: billing,
        payment_method: "cheque",
        payment_result: { payment_status: "", payment_details: [], redirect_url: "" },
      });
      if (!res.ok) throw new Error(await parseErrorMessage(res));
      await fetchCart({ quiet: true });
      setCheckoutModalOpen(false);
      onSuccess();
    } catch (e) {
      setCheckoutError(e instanceof Error ? e.message : "Не удалось оформить заказ");
    } finally {
      setCheckoutBusy(false);
    }
  }

  return {
    checkoutBusy,
    checkoutError,
    checkoutModalOpen,
    setCheckoutModalOpen,
    openCheckoutModal,
    submitCheckout,
  };
}
