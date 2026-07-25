"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchContactPosts,
  parseContactLayout,
  resolveCityHeading,
  resolveCompanyName,
  resolveDisplayCityName,
  type WpContactItem,
} from "@/app/features/wp/api/wpContactsApi";

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
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Ошибка загрузки");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const active = useMemo(
    () => items.find((c) => c.slug === activeSlug) ?? items[0] ?? null,
    [items, activeSlug],
  );

  /** Разбор content HTML используется только если соответствующий ACF пуст. */
  const parsed = useMemo(
    () => (active ? parseContactLayout(active.contentHtml) : null),
    [active],
  );

  const displayPhones = useMemo(() => {
    if (active?.acf.phone) return [active.acf.phone];
    return parsed?.phones ?? [];
  }, [active, parsed]);

  const displayEmails = useMemo(() => {
    if (active?.acf.email) return [active.acf.email];
    return parsed?.emails ?? [];
  }, [active, parsed]);

  const hoursLine = useMemo(() => {
    if (active?.acf.workSchedule) return active.acf.workSchedule;
    return parsed?.hoursLine?.trim() ?? "";
  }, [active, parsed]);

  const officeAddr = useMemo(() => {
    if (active?.acf.officeAddress) return active.acf.officeAddress;
    return parsed?.officeAddress?.trim() ?? "";
  }, [active, parsed]);

  const warehouseAddr = useMemo(() => {
    // 1) ACF «Адрес склада»
    if (active?.acf.warehouseAddress) return active.acf.warehouseAddress;
    // 2) content HTML
    if (parsed?.warehouseAddress?.trim()) return parsed.warehouseAddress.trim();
    // 3) тот же адрес, что у офиса (часто офис = склад)
    if (active?.acf.officeAddress) return active.acf.officeAddress;
    return "";
  }, [active, parsed]);

  const companyName = useMemo(
    () => (active ? resolveCompanyName(active) : ""),
    [active],
  );

  const headingCity = active ? resolveCityHeading(active) : "";
  const cityLabel = active ? resolveDisplayCityName(active) : "Финстрой";

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
    companyName,
    headingCity,
    cityLabel,
  };
}
