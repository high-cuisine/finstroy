"use client";

import Button from "@/app/shared/componets/ui/Button";
import type { useProfile } from "../../hooks/useProfile";
import styles from "./ProfileTab.module.scss";

function TrashIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3 5h14M8 5V3h4v2M6 5l1 12h6l1-12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type ProfileData = ReturnType<typeof useProfile>;

interface ProfileTabProps {
  profile: ProfileData;
}

export default function ProfileTab({ profile }: ProfileTabProps) {
  const {
    jwtData,
    profileLoading,
    firstName, setFirstName,
    lastName, setLastName,
    phone, setPhone,
    email, setEmail,
    password, setPassword,
    newPassword, setNewPassword,
  } = profile;

  return (
    <div className={styles.card}>
      <h1 className={styles.cardTitle}>Личные данные</h1>

      {jwtData ? (
        <div className={styles.profileInfo}>
          <span className={styles.profileInfoItem}>
            <span className={styles.profileInfoKey}>ID:</span> {jwtData.ID}
          </span>
          <span className={styles.profileInfoItem}>
            <span className={styles.profileInfoKey}>Логин:</span> {jwtData.user_login}
          </span>
          <span className={styles.profileInfoItem}>
            <span className={styles.profileInfoKey}>Email:</span> {jwtData.user_email}
          </span>
          <span className={styles.profileInfoItem}>
            <span className={styles.profileInfoKey}>Имя:</span> {jwtData.display_name}
          </span>
          <span className={styles.profileInfoItem}>
            <span className={styles.profileInfoKey}>Роль:</span>{" "}
            {jwtData.roles.join(", ")}
          </span>
        </div>
      ) : profileLoading ? (
        <p className={styles.emptyText}>Загрузка данных…</p>
      ) : null}

      <div className={styles.formSection}>
        <div className={styles.formRow}>
          <input
            className={styles.input}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Имя"
          />
          <input
            className={styles.input}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Фамилия"
          />
        </div>

        <div className={styles.formRow}>
          <input
            className={styles.input}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Телефон"
            type="tel"
            autoComplete="tel"
          />
          <input
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
          />
        </div>
      </div>

      <div className={styles.formSection}>
        <span className={styles.formLabel}>Изменить пароль:</span>
        <div className={styles.formRow}>
          <input
            className={`${styles.input} ${styles.inputPlaceholder}`}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
          />
          <input
            className={`${styles.input} ${styles.inputPlaceholder}`}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Новый пароль"
          />
        </div>
      </div>

      <div className={styles.profileActions}>
        <Button variant="green" size="L" className={styles.profileSaveBtn}>
          Сохранить изменения
        </Button>
        <button className={styles.deleteBtn}>
          <TrashIcon />
          Удалить аккаунт
        </button>
      </div>
    </div>
  );
}
