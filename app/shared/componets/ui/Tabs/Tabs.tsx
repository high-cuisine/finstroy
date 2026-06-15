"use client";

import styles from "./Tabs.module.scss";

export interface TabItem<T extends string = string> {
  key: T;
  label: string;
  muted?: boolean;
}

interface TabsProps<T extends string = string> {
  items: TabItem<T>[];
  active: T;
  onChange: (key: T) => void;
  className?: string;
  variant?: "pill" | "underline";
}

export default function Tabs<T extends string = string>({
  items,
  active,
  onChange,
  className = "",
  variant = "pill",
}: TabsProps<T>) {
  return (
    <div
      className={[
        styles.tabs,
        variant === "underline" ? styles.underline : styles.pill,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="tablist"
    >
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          role="tab"
          aria-selected={active === item.key}
          className={[
            styles.tab,
            active === item.key ? styles.tabActive : "",
            item.muted ? styles.tabMuted : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => onChange(item.key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
