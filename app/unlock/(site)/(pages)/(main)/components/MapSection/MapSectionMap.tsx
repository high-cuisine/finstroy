"use client";

import { useEffect, useState } from "react";
import InteractiveRussiaMap from "@/app/shared/components/InteractiveRussiaMap/InteractiveRussiaMap";
import { companyOfficeRegions } from "@/app/shared/components/InteractiveRussiaMap/officeRegions";
import styles from "./MapSectionMap.module.scss";

const DESKTOP_MAP_QUERY = "(min-width: 769px)";

export default function MapSectionMap({
  onRegionSelect,
}: {
  onRegionSelect?: (regionId: string) => void;
}) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_MAP_QUERY);
    const sync = () => setIsDesktop(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <div className={styles.wrap}>
      <InteractiveRussiaMap
        regions={companyOfficeRegions}
        showDetails={false}
        onRegionChange={onRegionSelect ? (r) => onRegionSelect(r.id) : undefined}
        projectionScale={isDesktop ? 740 : 700}
        projectionCenter={[58, 54]}
        labelFontSize={isDesktop ? 11 : 18}
        markerScale={isDesktop ? 1.3 : 1.35}
        ariaLabel="Карта представительств ФИНСТРОЙ в России"
        className={styles.map}
      />
    </div>
  );
}
