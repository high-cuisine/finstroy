import Image from "next/image";
import styles from "./AppLogo.module.scss";

type AppLogoProps = {
  className?: string;
  priority?: boolean;
};

export default function AppLogo({ className, priority }: AppLogoProps) {
  const rootClassName = className ? `${styles.root} ${className}` : styles.root;

  return (
    <span className={rootClassName}>
      <Image
        src="/icons/logo.svg"
        alt="Финстрой"
        width={213}
        height={43}
        className={`${styles.logo} ${styles.logoLight}`}
        priority={priority}
      />
      <Image
        src="/icons/logo-dark.svg"
        alt=""
        width={213}
        height={43}
        className={`${styles.logo} ${styles.logoDark}`}
        priority={priority}
        aria-hidden
      />
    </span>
  );
}
