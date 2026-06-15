import styles from "./AuthGate.module.scss";

interface AuthGateProps {
  onLogin: () => void;
}

export default function AuthGate({ onLogin }: AuthGateProps) {
  return (
    <div className={styles.card}>
      <h1 className={styles.cardTitle}>Личный кабинет</h1>
      <p className={styles.emptyText}>
        Для доступа к личному кабинету необходимо войти в аккаунт.
      </p>
      <div>
        <button type="button" className={styles.authGateBtn} onClick={onLogin}>
          Войти
        </button>
      </div>
    </div>
  );
}
