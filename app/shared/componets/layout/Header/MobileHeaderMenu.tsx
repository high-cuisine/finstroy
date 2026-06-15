"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/app/shared/context/ThemeContext";
import { aboutSubLinks, mobileNavItems } from "./headerNav";
import styles from "./Header.module.scss";

type MobileHeaderMenuProps = {
  onClose: () => void;
  aboutOpen: boolean;
  onAboutToggle: () => void;
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`${styles.mobileMenuChevron}${open ? ` ${styles.mobileMenuChevronOpen}` : ""}`}
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ThemeSwitch() {
  const { theme, toggle } = useTheme();

  return (
    <div className={styles.mobileMenuThemeRow}>
      <span className={styles.mobileMenuThemeLabel}>Тема сайта:</span>
      <button
        type="button"
        className={styles.mobileMenuThemeToggle}
        onClick={toggle}
        aria-label={theme === "light" ? "Включить тёмную тему" : "Включить светлую тему"}
      >
        <span className={`${styles.togglePill} ${theme === "dark" ? styles.togglePillDark : ""}`}>
          <span className={`${styles.toggleThumb} ${theme === "dark" ? styles.toggleThumbDark : ""}`}>
            <svg
              className={`${styles.toggleIcon} ${theme === "dark" ? styles.toggleIconHidden : ""}`}
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
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
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#c8cad8" />
            </svg>
          </span>
        </span>
      </button>
    </div>
  );
}

export default function MobileHeaderMenu({
  onClose,
  aboutOpen,
  onAboutToggle,
}: MobileHeaderMenuProps) {
  return (
    <div className={styles.mobileMenuPanel} id="mobile-header-menu">
      <nav className={styles.mobileMenuNav} aria-label="Мобильное меню">
        {mobileNavItems.map((item) => {
          if (item.type === "link") {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={styles.mobileMenuLink}
                onClick={onClose}
              >
                {item.label}
              </Link>
            );
          }

          return (
            <div key="about" className={styles.mobileMenuAboutBlock}>
              <button
                type="button"
                className={styles.mobileMenuAboutToggle}
                onClick={onAboutToggle}
                aria-expanded={aboutOpen}
              >
                <span>{item.label}</span>
                <ChevronIcon open={aboutOpen} />
              </button>

              {aboutOpen ? (
                <div className={styles.mobileMenuAboutList}>
                  {aboutSubLinks.map((subLink) => (
                    <Link
                      key={subLink.href}
                      href={subLink.href}
                      className={styles.mobileMenuSubLink}
                      onClick={onClose}
                    >
                      {subLink.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div className={styles.mobileMenuBottom}>
        <ThemeSwitch />

        <div className={styles.mobileMenuFooter}>
          <button type="button" className={styles.mobileMenuLocation}>
            <Image src="/icons/location.svg" alt="" width={20} height={20} />
            <span>Москва</span>
          </button>
          <a href="tel:+78005500220" className={styles.mobileMenuPhone}>
            +7 800 550 02 20
          </a>
        </div>
      </div>
    </div>
  );
}
