"use client";

import { useCartStore } from "@/app/features/cart";
import { useUserStore } from "@/app/features/user";
import { navItems, type Tab } from "../../data/accountData";
import styles from "./AccountSidebar.module.scss";

interface AccountSidebarProps {
  tab: Tab;
  onTabChange: (tab: Tab, onAuthRequired: () => void) => void;
  onAuthRequired: () => void;
  onLogout: () => void;
}

export default function AccountSidebar({
  tab,
  onTabChange,
  onAuthRequired,
  onLogout,
}: AccountSidebarProps) {
  const cartLines = useCartStore((s) => s.lines);
  const token = useUserStore((s) => s.token);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeading}>Личный кабинет</div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <button
            key={item.tab}
            type="button"
            className={`${styles.navItem} ${tab === item.tab && token ? styles.navItemActive : ""}`}
            onClick={() => onTabChange(item.tab, onAuthRequired)}
          >
            {item.label}
            {item.tab === "cart" && cartLines.length > 0 ? ` (${cartLines.length})` : ""}
          </button>
        ))}

        <div className={styles.navDivider} />

        <button type="button" className={styles.navItem} onClick={onLogout}>
          Выйти
        </button>
      </nav>
    </aside>
  );
}
