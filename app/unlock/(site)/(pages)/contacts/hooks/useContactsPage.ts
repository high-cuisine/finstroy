"use client";

import { useEffect, useMemo, useState } from "react";
import {
  cityHeadingLine,
  fetchContactPosts,
  parseContactLayout,
  resolveCompanyName,
  type WpContactItem,
  DEFAULT_EMAIL,
  DEFAULT_HOURS,
  DEFAULT_PHONE,
  FALLBACK_OFFICE,
  FALLBACK_WAREHOUSE,
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
        if (!cancelled) setError(e instanceof Error ? e.message : "Ошибка загрузки");
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

  /** Fallback только если ACF пустой (у большинства content.rendered = ""). */
  const parsed = useMemo(
    () => (active ? parseContactLayout(active.contentHtml) : null),
    [active],
  );

  const displayPhones = useMemo(() => {
    if (active?.acf.phone) return [active.acf.phone];
    return parsed && parsed.phones.length > 0 ? parsed.phones : [DEFAULT_PHONE];
  }, [active, parsed]);

  const displayEmails = useMemo(() => {
    if (active?.acf.email) return [active.acf.email];
    return parsed && parsed.emails.length > 0 ? parsed.emails : [DEFAULT_EMAIL];
  }, [active, parsed]);

  const hoursLine = useMemo(() => {
    if (active?.acf.workSchedule) return active.acf.workSchedule;
    return parsed?.hoursLine?.trim() || DEFAULT_HOURS;
  }, [active, parsed]);

  const officeAddr = useMemo(() => {
    if (active?.acf.officeAddress) return active.acf.officeAddress;
    return parsed?.officeAddress?.trim() || FALLBACK_OFFICE;
  }, [active, parsed]);

  const warehouseAddr = useMemo(() => {
    if (active?.acf.warehouseAddress) return active.acf.warehouseAddress;
    return parsed?.warehouseAddress?.trim() || FALLBACK_WAREHOUSE;
  }, [active, parsed]);

  const companyName = useMemo(
    () => (active ? resolveCompanyName(active) : ""),
    [active],
  );

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
    companyName,
    headingCity,
    cityLabel,
  };
}
