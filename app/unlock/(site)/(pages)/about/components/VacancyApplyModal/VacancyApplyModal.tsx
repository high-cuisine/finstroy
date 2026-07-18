"use client";

import { useEffect } from "react";
import styles from "./VacancyApplyModal.module.scss";

type VacancyApplyModalProps = {
  isOpen: boolean;
  contact: string;
  vacancyTitle?: string;
  onClose: () => void;
};

function phoneToTelHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return `tel:${phone}`;
  let normalized = digits;
  if (normalized.startsWith("8")) normalized = `7${normalized.slice(1)}`;
  if (!normalized.startsWith("7")) normalized = `7${normalized}`;
  return `tel:+${normalized}`;
}

function formatPhoneDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    const local = digits.slice(1);
    return `8 (${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6, 8)}-${local.slice(8)}`;
  }
  if (digits.length === 10) {
    return `8 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`;
  }
  return raw.trim();
}

function isPhoneContact(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10;
}

export default function VacancyApplyModal({
  isOpen,
  contact,
  vacancyTitle,
  onClose,
}: VacancyApplyModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const phoneLike = isPhoneContact(contact);
  const display = phoneLike ? formatPhoneDisplay(contact) : contact.trim();
  const href = phoneLike
    ? phoneToTelHref(contact)
    : contact.startsWith("@")
      ? `https://t.me/${contact.slice(1)}`
      : contact.startsWith("http")
        ? contact
        : undefined;

  return (
    <div className={styles.overlay} role="presentation">
      <button
        type="button"
        className={styles.backdrop}
        onClick={onClose}
        aria-label="Закрыть"
      />
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vacancy-apply-title"
      >
        <div className={styles.head}>
          <h2 id="vacancy-apply-title" className={styles.title}>
            Отклик на вакансию
          </h2>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        {vacancyTitle ? (
          <p className={styles.vacancyName}>{vacancyTitle}</p>
        ) : null}

        <p className={styles.text}>
          Вы можете позвонить нам на номер:{" "}
          {href ? (
            <a className={styles.phone} href={href}>
              {display || "—"}
            </a>
          ) : (
            <span className={styles.phone}>{display || "—"}</span>
          )}
        </p>
      </div>
    </div>
  );
}
