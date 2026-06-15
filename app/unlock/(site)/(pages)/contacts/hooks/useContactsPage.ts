"use client";

import { useEffect, useMemo, useState } from "react";
import {
  cityHeadingLine,
  fetchContactPosts,
  parseContactLayout,
  type WpContactItem,
} from "@/app/features/wp/api/wpContactsApi";

const FALLBACK_PHONE = "8 (800) 550-02-20";
const FALLBACK_EMAIL = "info@finstroy.ru";
const FALLBACK_HOURS = "Пн – Пт с 8:00 до 18:00";

export function useContactsPage() {
  const [items, setItems] = useState<WpContactItem[]>([]);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchContactPosts()
      .then((list) => {
        if (!cancelled) {
          setItems(list);
          setError(null);
          if (list.length > 0) setActiveSlug(list[0].slug);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Ошибка загрузки");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const active = useMemo(
    () => items.find((c) => c.slug === activeSlug) ?? items[0] ?? null,
    [items, activeSlug],
  );

  const parsed = useMemo(
    () => (active ? parseContactLayout(active.contentHtml) : null),
    [active],
  );

  const displayPhones = useMemo(() => {
    if (active?.acf.phone) return [active.acf.phone];
    return parsed && parsed.phones.length > 0 ? parsed.phones : [FALLBACK_PHONE];
  }, [active, parsed]);

  const displayEmails = useMemo(() => {
    if (active?.acf.email) return [active.acf.email];
    return parsed && parsed.emails.length > 0 ? parsed.emails : [FALLBACK_EMAIL];
  }, [active, parsed]);

  const hoursLine = parsed?.hoursLine?.trim() || FALLBACK_HOURS;

  const officeAddr = useMemo(() => {
    if (active?.acf.officeAddress) return active.acf.officeAddress;
    return parsed?.officeAddress?.trim() || "Адрес офиса уточняйте у менеджеров.";
  }, [active, parsed]);

  const warehouseAddr = useMemo(() => {
    return parsed?.warehouseAddress?.trim() || "Уточняйте адрес склада в карточке города или у менеджеров.";
  }, [parsed]);

  const headingCity = active ? cityHeadingLine(active.slug, active.title) : "";
  const cityLabel = active?.title ?? "Финстрой";

  return {
    items,
    activeSlug,
    setActiveSlug,
    active,
    loading,
    error,
    parsed,
    displayPhones,
    displayEmails,
    hoursLine,
    officeAddr,
    warehouseAddr,
    headingCity,
    cityLabel,
  };
}
