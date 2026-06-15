"use client";

import { useCallback, useState } from "react";
import type { WpContactItem } from "@/app/features/wp/api/wpContactsHelpers";
import { regionIdToContactSlug } from "@/app/shared/components/InteractiveRussiaMap/officeRegions";
import MapSectionMap from "./MapSectionMap";
import OfficeCardSlider from "./OfficeCardSlider";
import styles from "./MapSection.module.scss";

function findDefaultIndex(contacts: WpContactItem[]) {
  const idx = contacts.findIndex(
    (c) => c.slug.includes("peterburg") || c.title.toLowerCase().includes("петербург"),
  );
  return idx >= 0 ? idx : 0;
}

function findIndexByRegionId(contacts: WpContactItem[], regionId: string): number {
  const targetSlug = regionIdToContactSlug[regionId];
  if (!targetSlug) return -1;
  return contacts.findIndex((c) => c.slug.includes(targetSlug) || targetSlug.includes(c.slug));
}

export default function MapSectionInteractive({ contacts }: { contacts: WpContactItem[] }) {
  const [activeIndex, setActiveIndex] = useState(() => findDefaultIndex(contacts));

  const handleRegionSelect = useCallback(
    (regionId: string) => {
      const idx = findIndexByRegionId(contacts, regionId);
      if (idx >= 0) setActiveIndex(idx);
    },
    [contacts],
  );

  return (
    <div className={styles.mapArea}>
      <div className={styles.mapLayer}>
        <MapSectionMap onRegionSelect={handleRegionSelect} />
      </div>

      {contacts.length > 0 && (
        <div className={styles.cardLayer}>
          <OfficeCardSlider
            contacts={contacts}
            controlledIndex={activeIndex}
            onIndexChange={setActiveIndex}
          />
        </div>
      )}
    </div>
  );
}
