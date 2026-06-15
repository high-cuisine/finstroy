import styles from "./StatusMessage.module.scss";

interface StatusMessageProps {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  loadingText?: string;
  emptyText?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function StatusMessage({
  loading,
  error,
  empty,
  loadingText = "Загрузка…",
  emptyText = "Нет данных",
  children,
  className = "",
}: StatusMessageProps) {
  if (loading) {
    return <p className={[styles.msg, className].filter(Boolean).join(" ")}>{loadingText}</p>;
  }
  if (error) {
    return (
      <p className={[styles.msg, styles.error, className].filter(Boolean).join(" ")} role="alert">
        {error}
      </p>
    );
  }
  if (empty) {
    return <p className={[styles.msg, className].filter(Boolean).join(" ")}>{emptyText}</p>;
  }
  return <>{children}</>;
}
