"use client";

import AppLogo from "@/app/shared/componets/ui/AppLogo/AppLogo";
import { useTheme } from "@/app/shared/context/ThemeContext";
import styles from "./maintenance.module.scss";

export default function MaintenancePage() {
  const { theme, toggle } = useTheme();

  return (
    <div className={styles.page}>
      <button
        type="button"
        className={styles.themeToggle}
        onClick={toggle}
        aria-label={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
      >
        {theme === "dark" ? "☀" : "☾"}
      </button>

      <div className={styles.card}>
        <AppLogo className={styles.logo} priority />
        <h1 className={styles.title}>Проводятся технические работы</h1>
        <p className={styles.subtitle}>
          Сайт временно недоступен. Мы обновляем сервис и скоро вернёмся.
        </p>
      </div>
    </div>
  );
}
