"use client";

import { useCallback, useEffect, useId, useState } from "react";
import authStyles from "@/app/features/user/components/AuthModal.module.scss";
import styles from "./CheckoutBillingModal.module.scss";

export type CheckoutBillingAddress = {
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  country: string;
  postcode: string;
  email: string;
};

type CheckoutBillingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string | null;
  busy: boolean;
  error: string | null;
  onSubmit: (billing: CheckoutBillingAddress) => void | Promise<void>;
};

const emptyBilling: CheckoutBillingAddress = {
  first_name: "",
  last_name: "",
  address_1: "",
  city: "",
  country: "RU",
  postcode: "",
  email: "",
};

export function CheckoutBillingModal({
  isOpen,
  onClose,
  defaultEmail,
  busy,
  error,
  onSubmit,
}: CheckoutBillingModalProps) {
  const titleId = useId();
  const [form, setForm] = useState<CheckoutBillingAddress>(emptyBilling);

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      ...emptyBilling,
      country: "RU",
      email: (defaultEmail ?? "").trim(),
    });
  }, [isOpen, defaultEmail]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, busy, onClose]);

  const setField = useCallback(
    <K extends keyof CheckoutBillingAddress>(key: K, value: CheckoutBillingAddress[K]) => {
      setForm((s) => ({ ...s, [key]: value }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmed: CheckoutBillingAddress = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        address_1: form.address_1.trim(),
        city: form.city.trim(),
        country: (form.country || "RU").trim().toUpperCase() || "RU",
        postcode: form.postcode.trim(),
        email: form.email.trim(),
      };
      if (
        !trimmed.first_name ||
        !trimmed.last_name ||
        !trimmed.address_1 ||
        !trimmed.city ||
        !trimmed.postcode ||
        !trimmed.email
      ) {
        return;
      }
      await onSubmit(trimmed);
    },
    [form, onSubmit],
  );

  if (!isOpen) return null;

  return (
    <div
      className={authStyles.overlay}
      role="presentation"
      onMouseDown={(ev) => {
        if (busy) return;
        if (ev.target === ev.currentTarget) onClose();
      }}
    >
      <div
        className={`${authStyles.dialog} ${styles.dialogWide}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={authStyles.head}>
          <h2 id={titleId} className={authStyles.title}>
            Данные для заказа
          </h2>
          <button
            type="button"
            className={authStyles.close}
            onClick={onClose}
            disabled={busy}
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <p className={styles.hint}>
          Укажите адрес доставки и контакт — они будут переданы в заказ.
        </p>

        {error ? (
          <p className={authStyles.error} role="alert">
            {error}
          </p>
        ) : null}

        <form className={authStyles.form} onSubmit={(e) => void handleSubmit(e)}>
          <div className={styles.row}>
            <div className={authStyles.field}>
              <label className={authStyles.label} htmlFor="bill-first">
                Имя
              </label>
              <input
                id="bill-first"
                className={authStyles.input}
                autoComplete="given-name"
                required
                value={form.first_name}
                onChange={(e) => setField("first_name", e.target.value)}
                disabled={busy}
              />
            </div>
            <div className={authStyles.field}>
              <label className={authStyles.label} htmlFor="bill-last">
                Фамилия
              </label>
              <input
                id="bill-last"
                className={authStyles.input}
                autoComplete="family-name"
                required
                value={form.last_name}
                onChange={(e) => setField("last_name", e.target.value)}
                disabled={busy}
              />
            </div>
          </div>

          <div className={authStyles.field}>
            <label className={authStyles.label} htmlFor="bill-address">
              Улица, дом
            </label>
            <input
              id="bill-address"
              className={authStyles.input}
              autoComplete="street-address"
              required
              value={form.address_1}
              onChange={(e) => setField("address_1", e.target.value)}
              disabled={busy}
            />
          </div>

          <div className={styles.row}>
            <div className={authStyles.field}>
              <label className={authStyles.label} htmlFor="bill-city">
                Город
              </label>
              <input
                id="bill-city"
                className={authStyles.input}
                autoComplete="address-level2"
                required
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                disabled={busy}
              />
            </div>
            <div className={authStyles.field}>
              <label className={authStyles.label} htmlFor="bill-postcode">
                Индекс
              </label>
              <input
                id="bill-postcode"
                className={authStyles.input}
                autoComplete="postal-code"
                required
                inputMode="numeric"
                value={form.postcode}
                onChange={(e) => setField("postcode", e.target.value)}
                disabled={busy}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={authStyles.field}>
              <label className={authStyles.label} htmlFor="bill-country">
                Страна (код)
              </label>
              <input
                id="bill-country"
                className={authStyles.input}
                autoComplete="country"
                required
                maxLength={2}
                value={form.country}
                onChange={(e) => setField("country", e.target.value.toUpperCase())}
                disabled={busy}
              />
            </div>
            <div className={authStyles.field}>
              <label className={authStyles.label} htmlFor="bill-email">
                E-mail
              </label>
              <input
                id="bill-email"
                type="email"
                className={authStyles.input}
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                disabled={busy}
              />
            </div>
          </div>

          <button type="submit" className={authStyles.submit} disabled={busy}>
            {busy ? "Оформление…" : "Подтвердить и оформить"}
          </button>
        </form>
      </div>
    </div>
  );
}
