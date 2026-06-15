"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/app/shared/componets/ui/Button";
import buttonStyles from "@/app/shared/componets/ui/Button.module.scss";
import AppLogo from "@/app/shared/componets/ui/AppLogo/AppLogo";
import { useTheme } from "@/app/shared/context/ThemeContext";
import { useCatalogMenuStore } from "@/app/features/catalogMenu";
import { useCatalogSearchStore, type CatalogSearchStore } from "@/app/features/search";
import { useCartStore } from "@/app/features/cart";
import { AuthModal, useUserStore } from "@/app/features/user";
import { useLoadCatalogCategories, useCatalogCategoriesStore } from "@/app/features/catalogCategories";
import { sitePath, stripUnlockBase } from "@/app/shared/lib/sitePath";
import MobileHeaderMenu from "./MobileHeaderMenu";
import { aboutSubLinks, desktopNavLinks } from "./headerNav";
import styles from "./Header.module.scss";

type HeaderVariant = "default" | "catalog";

const MOBILE_HEADER_MQ = "(max-width: 1023px)";

function useIsMobileHeader() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_HEADER_MQ);
    const update = () => setIsMobile(mq.matches);

    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}

export default function Header(props: { variant?: HeaderVariant }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [desktopAboutOpen, setDesktopAboutOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);
  useLoadCatalogCategories();
  const categories = useCatalogCategoriesStore((s) => s.categories);
  const selectedCategoryId = useCatalogCategoriesStore((s) => s.selectedCategoryId);
  const setSelectedCategoryId = useCatalogCategoriesStore((s) => s.setSelectedCategoryId);

  const token = useUserStore((s) => s.token);
  const cartQty = useCartStore((s) =>
    s.lines.reduce((acc, line) => acc + line.quantity, 0),
  );
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const isMenuOpen = useCatalogMenuStore((s) => s.isOpen);
  const menuMode = useCatalogMenuStore((s) => s.mode);
  const openMenu = useCatalogMenuStore((s) => s.open);
  const closeMenu = useCatalogMenuStore((s) => s.close);
  const setMenuMode = useCatalogMenuStore((s) => s.setMode);
  const addToHistory = useCatalogMenuStore((s) => s.addToHistory);

  const query = useCatalogSearchStore((s: CatalogSearchStore) => s.query);
  const setQuery = useCatalogSearchStore((s: CatalogSearchStore) => s.setQuery);

  const variant: HeaderVariant = props.variant ?? "default";
  const isMobile = useIsMobileHeader();
  const isCatalog = variant === "catalog" || isMenuOpen;
  const isCatalogLayout = isCatalog && !isMobile;
  const isAboutSection = stripUnlockBase(pathname).startsWith("/about");

  const headerRef = useRef<HTMLElement | null>(null);
  const aboutDropdownRef = useRef<HTMLLIElement | null>(null);
  const headerOffsetVar = useMemo(() => "--header-offset", []);

  const closeMobileMenu = () => {
    setOpen(false);
    setAboutOpen(false);
  };

  const openSearchMode = () => {
    if (!isMenuOpen) openMenu("search");
    else setMenuMode("search");
  };

  const submitSearch = (options?: { mobile?: boolean }) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    addToHistory(trimmed);

    if (isMenuOpen) {
      setMenuMode("catalog");
      return;
    }

    const catalogUrl = sitePath(`/catalog?q=${encodeURIComponent(trimmed)}`);

    if (options?.mobile) {
      if (stripUnlockBase(pathname) !== "/catalog") {
        router.push(catalogUrl);
      } else {
        router.replace(catalogUrl);
      }
      return;
    }

    if (stripUnlockBase(pathname) !== "/catalog") {
      router.push(catalogUrl);
    }
    openSearchMode();
  };

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const root = document.documentElement;
    const setOffset = () => {
      root.style.setProperty(headerOffsetVar, `${el.getBoundingClientRect().height}px`);
    };

    setOffset();
    const ro = new ResizeObserver(() => setOffset());
    ro.observe(el);
    window.addEventListener("resize", setOffset);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setOffset);
    };
  }, [headerOffsetVar, isCatalogLayout, pathname, open, aboutOpen]);

  useEffect(() => {
    closeMobileMenu();
    setDesktopAboutOpen(false);
    setMobileCatalogOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open && !mobileCatalogOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (mobileCatalogOpen) setMobileCatalogOpen(false);
        else closeMobileMenu();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, mobileCatalogOpen]);

  useEffect(() => {
    if (!desktopAboutOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!aboutDropdownRef.current?.contains(event.target as Node)) {
        setDesktopAboutOpen(false);
      }
    };

    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, [desktopAboutOpen]);

  useEffect(() => {
    if (isAboutSection) setAboutOpen(true);
  }, [isAboutSection]);

  return (
    <header
        ref={(node) => {
          headerRef.current = node;
        }}
        data-app-header
        className={`${styles.header}${isCatalogLayout ? ` ${styles.headerCatalog}` : ""}${open ? ` ${styles.headerMobileOpen}` : ""}`}
      >
      <div className={styles.headerInner}>
        <div className={`${styles.topRow}${isCatalogLayout ? ` ${styles.topRowCatalog}` : ""}`}>
          <div className={styles.left}>
            <button className={styles.location}>
              <Image src="/icons/location.svg" alt="" width={20} height={20} />
              <span>Москва</span>
            </button>
            <span className={`${styles.phone}${isCatalogLayout ? ` ${styles.phoneHidden}` : ""}`}>
              +7 800 550 02 20
            </span>
          </div>

          <div className={`${styles.logoWrapper}${isCatalogLayout ? ` ${styles.logoHidden}` : ""}`}>
            <Link href={sitePath("/")} aria-hidden={isCatalogLayout} tabIndex={isCatalogLayout ? -1 : 0} onClick={closeMobileMenu}>
              <AppLogo className={styles.logo} priority />
            </Link>
          </div>

          <div
            className={`${styles.searchDesktop} ${styles.searchDesktopCatalog}${isCatalogLayout ? ` ${styles.searchLongVisible}` : ""}`}
            aria-hidden={!isCatalogLayout}
          >
            <Image src="/icons/search.svg" alt="" width={20} height={20} />
            <input
              className={styles.searchInput}
              placeholder="Найти в каталоге"
              value={query}
              onFocus={openSearchMode}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                submitSearch();
              }}
            />
          </div>

          <div className={styles.right}>
            <div
              className={`${styles.searchDesktop} ${styles.searchDesktopBase}${isCatalogLayout ? ` ${styles.searchBaseHidden}` : ""}`}
              aria-hidden={isCatalogLayout}
            >
              <Image src="/icons/search.svg" alt="" width={20} height={20} />
              <input
                className={styles.searchInput}
                placeholder="Найти в каталоге"
                value={query}
                onFocus={openSearchMode}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  submitSearch();
                }}
              />
            </div>

            <Link
              href={sitePath("/account?tab=cart")}
              className={`${styles.cart}${isCatalogLayout ? ` ${styles.cartCatalog}` : ""}`}
              aria-label="Корзина"
            >
              <Image src="/icons/cart-icon.svg" alt="Корзина" width={20} height={20} />
              {cartQty > 0 ? (
                <span className={styles.cartBadge}>{cartQty > 99 ? "99+" : cartQty}</span>
              ) : null}
            </Link>

            {token ? (
              <Link
                href={sitePath("/account")}
                className={`${buttonStyles.button} ${buttonStyles.black} ${buttonStyles.L} ${styles.login} ${styles.loginLink}`}
              >
                Личный кабинет
              </Link>
            ) : (
              <Button
                variant="black"
                size="L"
                className={`${styles.login} ${styles.loginLink}`}
                type="button"
                onClick={() => setAuthOpen(true)}
              >
                Войти
              </Button>
            )}

            <button
              type="button"
              className={`${styles.burger}${open ? ` ${styles.burgerOpen}` : ""}`}
              onClick={() => {
                setOpen((value) => {
                  const next = !value;
                  if (!next) setAboutOpen(false);
                  return next;
                });
              }}
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={open}
              aria-controls="mobile-header-menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <div
          className={`${styles.searchMobile}${open ? ` ${styles.searchMobileMenuHidden}` : ""}`}
        >
          <Image src="/icons/search.svg" alt="" width={20} height={20} />
          <input
            className={styles.searchInput}
            placeholder="Найти в каталоге"
            value={query}
            onFocus={() => setMobileCatalogOpen(true)}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              setMobileCatalogOpen(false);
              submitSearch({ mobile: true });
            }}
          />
        </div>

        {open ? (
          <MobileHeaderMenu
            onClose={closeMobileMenu}
            aboutOpen={aboutOpen}
            onAboutToggle={() => setAboutOpen((value) => !value)}
          />
        ) : null}

        <nav className={styles.nav}>
          <Button
            type="button"
            variant="green"
            size="M"
            className={`${styles.catalogButton}${isMenuOpen ? ` ${styles.catalogButtonActive}` : ""}`}
            onClick={() => {
              if (isMenuOpen && menuMode === "catalog") {
                closeMenu();
                return;
              }
              openMenu("catalog");
            }}
            aria-expanded={isMenuOpen}
            aria-controls="catalog-menu"
          >
            <Image src="/icons/apps.svg" alt="" width={20} height={20} />
            <span>Каталог</span>
          </Button>

          <ul className={styles.navLinks}>
            {desktopNavLinks.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className={`${styles.navLink} ${pathname === href ? styles.navLinkActive : ""}`}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className={styles.aboutNavItem} ref={aboutDropdownRef}>
              <button
                type="button"
                className={`${styles.navLink} ${styles.navLinkButton}${isAboutSection || desktopAboutOpen ? ` ${styles.navLinkActive}` : ""}`}
                onClick={() => setDesktopAboutOpen((value) => !value)}
                aria-expanded={desktopAboutOpen}
              >
                О компании
              </button>
              {desktopAboutOpen ? (
                <div className={styles.aboutDropdown}>
                  {aboutSubLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={styles.aboutDropdownLink}
                      onClick={() => setDesktopAboutOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </li>
          </ul>

          <button
            className={`${styles.themeToggle}${isCatalogLayout ? ` ${styles.themeToggleCatalog}` : ""}`}
            onClick={toggle}
            aria-label={theme === "light" ? "Включить тёмную тему" : "Включить светлую тему"}
          >
            <span className={`${styles.togglePill} ${theme === "dark" ? styles.togglePillDark : ""}`}>
              <span className={`${styles.toggleThumb} ${theme === "dark" ? styles.toggleThumbDark : ""}`}>
                <svg
                  className={`${styles.toggleIcon} ${theme === "dark" ? styles.toggleIconHidden : ""}`}
                  width="13" height="13" viewBox="0 0 24 24" fill="none"
                >
                  <circle cx="12" cy="12" r="5" fill="#0E0E14" />
                  <line x1="12" y1="1" x2="12" y2="4" stroke="#0E0E14" strokeWidth="2.2" strokeLinecap="round" />
                  <line x1="12" y1="20" x2="12" y2="23" stroke="#0E0E14" strokeWidth="2.2" strokeLinecap="round" />
                  <line x1="1" y1="12" x2="4" y2="12" stroke="#0E0E14" strokeWidth="2.2" strokeLinecap="round" />
                  <line x1="20" y1="12" x2="23" y2="12" stroke="#0E0E14" strokeWidth="2.2" strokeLinecap="round" />
                  <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" stroke="#0E0E14" strokeWidth="2.2" strokeLinecap="round" />
                  <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" stroke="#0E0E14" strokeWidth="2.2" strokeLinecap="round" />
                  <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" stroke="#0E0E14" strokeWidth="2.2" strokeLinecap="round" />
                  <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" stroke="#0E0E14" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
                <svg
                  className={`${styles.toggleIcon} ${theme === "light" ? styles.toggleIconHidden : ""}`}
                  width="12" height="12" viewBox="0 0 24 24" fill="none"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#c8cad8" />
                </svg>
              </span>
            </span>
          </button>
        </nav>
      </div>

      {mobileCatalogOpen && (
        <div className={styles.mobileCatOverlay}>
          <div className={styles.mobileCatHeader}>
            <span className={styles.mobileCatTitle}>Каталог</span>
            <button
              className={styles.mobileCatClose}
              onClick={() => setMobileCatalogOpen(false)}
              aria-label="Закрыть"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="14" y1="2" x2="2" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {categories.length === 0 ? (
            <p className={styles.mobileCatEmpty}>Загрузка…</p>
          ) : (
            <div className={styles.mobileCatList}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`${styles.mobileCatItem} ${selectedCategoryId === cat.id ? styles.mobileCatItemSelected : ""}`}
                  onClick={() => {
                    setSelectedCategoryId(cat.id);
                    setMobileCatalogOpen(false);
                    router.push(sitePath(`/catalog?category=${encodeURIComponent(cat.id)}`));
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
