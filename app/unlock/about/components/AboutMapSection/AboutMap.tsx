"use client";

import InteractiveRussiaMap from "@/app/shared/components/InteractiveRussiaMap/InteractiveRussiaMap";
import { companyAboutMapRegions } from "@/app/shared/components/InteractiveRussiaMap/officeRegions";
import styles from "./AboutMapSection.module.scss";

export default function AboutMap() {
  return (
    <div className={styles.mapWrap}>
      <InteractiveRussiaMap
        regions={companyAboutMapRegions}
        showDetails={false}
        static
        projectionScale={740}
        projectionCenter={[58, 54]}
        labelFontSize={11}
        markerScale={1.3}
        ariaLabel="Карта офисов и складов ФИНСТРОЙ в России"
        className={styles.map}
      />
    </div>
  );
}
