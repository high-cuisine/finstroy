import Link from "next/link";
import AppLogo from "@/app/shared/componets/ui/AppLogo/AppLogo";
import { sitePath } from "@/app/shared/lib/sitePath";
import {
  footerAboutLinks,
  footerContacts,
  footerMainLinks,
} from "./footerNav";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerGrid}>
          <div className={styles.brandCol}>
            <div className={styles.logoRow}>
              <Link href={sitePath("/")} className={styles.logoLink} aria-label="На главную">
                <AppLogo className={styles.logo} />
              </Link>
              <span className={styles.copyright}>© 1995 – 2026</span>
            </div>

            <div className={styles.contacts}>
              <a href={footerContacts.phoneHref} className={styles.contactLink}>
                {footerContacts.phone}
              </a>
              <a href={footerContacts.emailHref} className={styles.contactLink}>
                {footerContacts.email}
              </a>
              <p className={styles.address}>{footerContacts.address}</p>
            </div>
          </div>

          <nav className={styles.navCol} aria-label="Навигация по сайту">
            {footerMainLinks.map((link) => (
              <Link key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={styles.aboutCol}>
            <p className={styles.sectionTitle}>О компании</p>
            <nav className={styles.navCol} aria-label="О компании">
              {footerAboutLinks.map((link) => (
                <Link key={link.href} href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
