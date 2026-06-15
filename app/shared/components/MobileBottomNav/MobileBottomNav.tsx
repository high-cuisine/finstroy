"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useCatalogMenuStore } from "@/app/features/catalogMenu";
import { useCartStore } from "@/app/features/cart";
import { sitePath, stripUnlockBase, UNLOCK_BASE } from "@/app/shared/lib/sitePath";
import styles from "./MobileBottomNav.module.scss";

type NavItemId = "home" | "catalog" | "cart" | "profile";

function HomeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 10.2 12 4l8 6.2V19a1.5 1.5 0 0 1-1.5 1.5H15v-5.5h-6V20.5H5.5A1.5 1.5 0 0 1 4 19V10.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 20.5V13.5h5v7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CatalogIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {[
        [7, 7],
        [12, 7],
        [17, 7],
        [7, 12],
        [12, 12],
        [17, 12],
        [7, 17],
        [12, 17],
        [17, 17],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.75" fill="currentColor" />
      ))}
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5h1.2l1.4 9.2c.08.52.52.9 1.05.9h9.7c.53 0 .97-.38 1.05-.9L18.8 8H7.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="19" r="1.4" fill="currentColor" />
      <circle cx="16.5" cy="19" r="1.4" fill="currentColor" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.2" fill="currentColor" />
      <path
        d="M6.5 19.5c.9-2.8 3-4.5 5.5-4.5s4.6 1.7 5.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function resolveActiveItem(
  pathname: string,
  tab: string | null,
): NavItemId | null {
  const path = stripUnlockBase(pathname);
  if (path === "/") return "home";
  if (path.startsWith("/catalog") || path.startsWith("/products")) return "catalog";

  if (path === "/account") {
    if (tab === "cart") return "cart";
    return "profile";
  }

  return null;
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const isMenuOpen = useCatalogMenuStore((state) => state.isOpen);
  const closeMenu = useCatalogMenuStore((state) => state.close);

  const cartQty = useCartStore((state) =>
    state.lines.reduce((acc, line) => acc + line.quantity, 0),
  );

  const activeItem = useMemo(
    () => resolveActiveItem(pathname, tab),
    [pathname, tab],
  );

  const handleHomeClick = () => {
    closeMenu();
    if (pathname !== UNLOCK_BASE) {
      router.push(sitePath("/"));
    }
  };

  const handleNavClick = () => {
    if (isMenuOpen) closeMenu();
  };

  return (
    <nav className={styles.nav} aria-label="Мобильная навигация">
      <div className={styles.inner}>
        <button
          type="button"
          className={`${styles.item}${activeItem === "home" ? ` ${styles.itemActive}` : ""}`}
          onClick={handleHomeClick}
          aria-current={activeItem === "home" ? "page" : undefined}
        >
          <span className={styles.iconWrap}>
            <HomeIcon />
          </span>
          <span className={styles.label}>Главная</span>
        </button>

        <Link
          href={sitePath("/catalog")}
          className={`${styles.item}${activeItem === "catalog" ? ` ${styles.itemActive}` : ""}`}
          onClick={handleNavClick}
          aria-current={activeItem === "catalog" ? "page" : undefined}
        >
          <span className={styles.iconWrap}>
            <CatalogIcon />
          </span>
          <span className={styles.label}>Каталог</span>
        </Link>

        <Link
          href={sitePath("/account?tab=cart")}
          className={`${styles.item}${activeItem === "cart" ? ` ${styles.itemActive}` : ""}`}
          onClick={handleNavClick}
          aria-current={activeItem === "cart" ? "page" : undefined}
        >
          <span className={styles.iconWrap}>
            <CartIcon />
            {cartQty > 0 ? (
              <span className={styles.badge}>{cartQty > 99 ? "99+" : cartQty}</span>
            ) : null}
          </span>
          <span className={styles.label}>Корзина</span>
        </Link>

        <Link
          href={sitePath("/account?tab=profile")}
          className={`${styles.item}${activeItem === "profile" ? ` ${styles.itemActive}` : ""}`}
          onClick={handleNavClick}
          aria-current={activeItem === "profile" ? "page" : undefined}
        >
          <span className={styles.iconWrap}>
            <ProfileIcon />
          </span>
          <span className={styles.label}>Профиль</span>
        </Link>
      </div>
    </nav>
  );
}
