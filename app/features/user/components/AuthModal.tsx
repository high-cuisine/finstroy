"use client";

import { useCallback, useEffect, useState } from "react";
import { jwtLogin } from "../api/jwtAuth";
import { refreshUserProfile } from "../api/refreshProfile";
import { registerHeadlessUser } from "../api/register";
import { useUserStore } from "../store/useUserStore";
import styles from "./AuthModal.module.scss";

type Tab = "login" | "register";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<Tab>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyJwtLogin = useUserStore((s) => s.applyJwtLogin);
  const applyHeadlessRegister = useUserStore((s) => s.applyHeadlessRegister);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleLogin = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      const fd = new FormData(e.currentTarget);
      const username = String(fd.get("email") || "").trim();
      const password = String(fd.get("password") || "");
      if (!username || !password) return;

      setLoading(true);
      try {
        const resp = await jwtLogin({ username, password });
        applyJwtLogin(resp);
        await refreshUserProfile();
        onClose();
        e.currentTarget.reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка входа");
      } finally {
        setLoading(false);
      }
    },
    [applyJwtLogin, onClose],
  );

  const handleRegister = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      const fd = new FormData(e.currentTarget);
      const username = String(fd.get("username") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const password = String(fd.get("password") || "");
      const password2 = String(fd.get("password2") || "");
      const name = String(fd.get("name") || "").trim();

      if (!username || !email || !password) {
        setError("Заполните обязательные поля");
        return;
      }
      if (password !== password2) {
        setError("Пароли не совпадают");
        return;
      }

      setLoading(true);
      try {
        const body = await registerHeadlessUser({
          username,
          email,
          password,
          ...(name ? { name } : {}),
        });
        applyHeadlessRegister(body);
        await refreshUserProfile();
        onClose();
        e.currentTarget.reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка регистрации");
      } finally {
        setLoading(false);
      }
    },
    [applyHeadlessRegister, onClose],
  );

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onMouseDown={(ev) => {
        if (ev.target === ev.currentTarget) onClose();
      }}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <div className={styles.head}>
          <h2 id="auth-modal-title" className={styles.title}>
            {tab === "login" ? "Вход" : "Регистрация"}
          </h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${tab === "login" ? styles.tabActive : ""}`}
            onClick={() => {
              setTab("login");
              setError(null);
            }}
          >
            Вход
          </button>
          <button
            type="button"
            className={`${styles.tab} ${tab === "register" ? styles.tabActive : ""}`}
            onClick={() => {
              setTab("register");
              setError(null);
            }}
          >
            Регистрация
          </button>
        </div>

        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}

        {tab === "login" ? (
          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="auth-email">
                E-mail или логин
              </label>
              <input
                id="auth-email"
                name="email"
                className={styles.input}
                autoComplete="username"
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="auth-password">
                Пароль
              </label>
              <input
                id="auth-password"
                name="password"
                type="password"
                className={styles.input}
                autoComplete="current-password"
                required
              />
            </div>
            <button type="submit" className={styles.submit} disabled={loading}>
              {loading ? "Входим…" : "Войти"}
            </button>
          </form>
        ) : (
          <form className={styles.form} onSubmit={handleRegister}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="reg-username">
                Логин
              </label>
              <input
                id="reg-username"
                name="username"
                className={styles.input}
                autoComplete="username"
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="reg-email">
                E-mail
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                className={styles.input}
                autoComplete="email"
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="reg-name">
                Имя (необязательно)
              </label>
              <input id="reg-name" name="name" className={styles.input} autoComplete="name" />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="reg-password">
                Пароль
              </label>
              <input
                id="reg-password"
                name="password"
                type="password"
                className={styles.input}
                autoComplete="new-password"
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="reg-password2">
                Повтор пароля
              </label>
              <input
                id="reg-password2"
                name="password2"
                type="password"
                className={styles.input}
                autoComplete="new-password"
                required
              />
            </div>
            <button type="submit" className={styles.submit} disabled={loading}>
              {loading ? "Отправка…" : "Зарегистрироваться"}
            </button>
          </form>
        )}

        <p className={styles.switchHint}>
          {tab === "login" ? (
            <>
              Нет аккаунта?
              <button
                type="button"
                className={styles.switchBtn}
                onClick={() => {
                  setTab("register");
                  setError(null);
                }}
              >
                Регистрация
              </button>
            </>
          ) : (
            <>
              Уже есть аккаунт?
              <button
                type="button"
                className={styles.switchBtn}
                onClick={() => {
                  setTab("login");
                  setError(null);
                }}
              >
                Войти
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
