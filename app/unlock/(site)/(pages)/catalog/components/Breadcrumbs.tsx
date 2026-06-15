import Link from 'next/link';
import { sitePath } from '@/app/shared/lib/sitePath';
import styles from '../catalog.module.scss';

export function Breadcrumbs() {
  return (
    <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
      <Link href={sitePath("/")} className={styles.crumbLink}>
        Главная
      </Link>
      <span className={styles.crumbSep}>/</span>
      <span>Каталог</span>
    </nav>
  );
}

