"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppLogo from "@/app/shared/componets/ui/AppLogo/AppLogo";
import { useTheme } from "@/app/shared/context/ThemeContext";
import { UNLOCK_BASE } from "@/app/shared/lib/sitePath";
import authStyles from "@/app/features/user/components/AuthModal.module.scss";
import styles from "./login.module.scss";

export default function UnlockLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, toggle } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const from = searchParams.get("from");
  const redirectTo =
    from && from.startsWith(UNLOCK_BASE) ? from : UNLOCK_BASE;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const res = await fetch("/api/unlock-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Не удалось войти");
        return;
      }

      router.replace(redirectTo);
      router.refresh();
    } catch {
      setError("Не удалось войти. Попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  };

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

      <div className={authStyles.dialog}>
        <div className={styles.logoWrap}>
          <AppLogo priority />
        </div>

        <div className={authStyles.head}>
          <h1 id="unlock-login-title" className={authStyles.title}>
            Вход на сайт
          </h1>
        </div>

        {error && (
          <p className={authStyles.error} role="alert">
            {error}
          </p>
        )}

        <form className={authStyles.form} onSubmit={(e) => void handleSubmit(e)}>
          <div className={authStyles.field}>
            <label className={authStyles.label} htmlFor="unlock-username">
              Логин
            </label>
            <input
              id="unlock-username"
              className={authStyles.input}
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={authStyles.field}>
            <label className={authStyles.label} htmlFor="unlock-password">
              Пароль
            </label>
            <input
              id="unlock-password"
              className={authStyles.input}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={authStyles.submit} disabled={busy}>
            {busy ? "Вход…" : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
