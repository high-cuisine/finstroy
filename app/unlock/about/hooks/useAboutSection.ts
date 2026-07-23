"use client";

import { useEffect, useState } from "react";

export type AboutSectionKey = "info" | "team" | "clients" | "certs";

export const sections: { key: AboutSectionKey; label: string }[] = [
  { key: "info", label: "Информация" },
  { key: "team", label: "Сотрудники" },
  { key: "clients", label: "Наши клиенты" },
  { key: "certs", label: "Сертификаты" },
];

export function useAboutSection() {
  const [active, setActive] = useState<AboutSectionKey>("info");

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.replace("#", "");
      const section = sections.find((s) => s.key === hash);
      if (section) setActive(section.key);
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  return { active, setActive, sections };
}
