"use client";

import dynamic from "next/dynamic";
import type { WpContactCoords } from "@/app/features/wp/api/wpContactsApi";
import styles from "./LocationBlock.module.scss";

const ContactMap = dynamic(
  () => import("../../components/ContactMap/ContactMap"),
  { ssr: false },
);

function PinIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 2C11.03 2 7 6.03 7 11c0 7.25 9 19 9 19s9-11.75 9-19c0-4.97-4.03-9-9-9z"
        fill="#006f3d"
        stroke="#fff"
        strokeWidth="1.5"
      />
      <circle cx="16" cy="11" r="3" fill="#fff" />
    </svg>
  );
}

interface LocationBlockProps {
  title: string;
  address: string;
  coords: WpContactCoords | undefined;
  label: string;
}

export default function LocationBlock({ title, address, coords, label }: LocationBlockProps) {
  return (
    <div className={styles.locationBlock}>
      <h2 className={styles.locationTitle}>{title}</h2>
      <p className={styles.locationAddress}>{address}</p>

      <div className={styles.mapWrap}>
        {coords ? (
          <ContactMap key={coords.join(",")} coords={coords} label={label} />
        ) : (
          <div className={styles.mapScene}>
            <div className={styles.mapGrid} aria-hidden="true" />
            <div className={styles.mapPin}>
              <PinIcon />
              <span className={styles.mapLabel}>{label}</span>
            </div>
            <div className={styles.mapControls} aria-hidden="true">
              <button type="button" className={styles.mapBtn}>+</button>
              <button type="button" className={styles.mapBtn}>−</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
