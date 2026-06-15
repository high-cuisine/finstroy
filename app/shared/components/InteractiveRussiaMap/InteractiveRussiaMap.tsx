"use client";

import { useState, useCallback } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import russiaGeo from "@amcharts/amcharts4-geodata/russiaLow";
import styles from "./InteractiveRussiaMap.module.scss";

export type RussiaMapRegion = {
  id: string;
  label: string;
  coordinates: [number, number];
  details?: string;
  linkedRegionIds?: string[];
};

type Props = {
  regions: RussiaMapRegion[];
  defaultActiveId?: string;
  className?: string;
  ariaLabel?: string;
  showDetails?: boolean;
  muted?: boolean;
  static?: boolean;
  projectionScale?: number;
  projectionCenter?: [number, number];
  labelFontSize?: number;
  markerScale?: number;
  onRegionChange?: (region: RussiaMapRegion) => void;
};

// Teardrop pin: point at (0,0), bubble above centered at (0,-15)
const PIN_PATH = "M 0 0 C -7 -5 -12 -10 -12 -16 A 12 12 0 0 1 12 -16 C 12 -10 7 -5 0 0 Z";

export default function InteractiveRussiaMap({
  regions,
  defaultActiveId,
  className,
  ariaLabel = "Интерактивная карта России",
  showDetails = true,
  muted = false,
  static: isStatic = false,
  projectionScale = 500,
  projectionCenter = [84, 62],
  labelFontSize = 11,
  markerScale = 1,
  onRegionChange,
}: Props) {
  const [activeId, setActiveId] = useState(defaultActiveId ?? regions[0]?.id);

  const activeRegion = regions.find((r) => r.id === activeId) ?? regions[0];

  const selectRegion = useCallback(
    (region: RussiaMapRegion) => {
      setActiveId(region.id);
      onRegionChange?.(region);
    },
    [onRegionChange],
  );

  const officeRegionIds = new Set(regions.map((r) => r.id));

  return (
    <div
      className={[
        styles.map,
        muted ? styles.mapMuted : "",
        isStatic ? styles.mapStatic : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={ariaLabel}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: projectionCenter,
          scale: projectionScale,
        }}
        width={1086}
        height={698}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={russiaGeo}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const isActive =
                geo.id === activeId ||
                !!activeRegion?.linkedRegionIds?.includes(geo.id as string);
              const hasOffice = officeRegionIds.has(geo.id as string);
              const region = regions.find((r) => r.id === geo.id);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={isStatic ? undefined : () => region && selectRegion(region)}
                  style={{
                    default: {
                      fill: isStatic || !isActive
                        ? "var(--map-region-fill)"
                        : "var(--map-region-active-fill)",
                      stroke: "var(--map-region-stroke)",
                      strokeWidth: 0.5,
                      outline: "none",
                      cursor: isStatic ? "default" : hasOffice ? "pointer" : "default",
                      transition: "fill 0.2s ease",
                    },
                    hover: {
                      fill: isStatic
                        ? "var(--map-region-fill)"
                        : isActive
                          ? "var(--map-region-active-fill)"
                          : hasOffice
                            ? "var(--map-region-hover-fill)"
                            : "var(--map-region-fill)",
                      stroke: "var(--map-region-stroke)",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    pressed: {
                      fill: isStatic
                        ? "var(--map-region-fill)"
                        : "var(--map-region-active-fill)",
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>

        {regions.map((region) => {
          const isActive = !isStatic && region.id === activeId;
          return (
            <Marker key={region.id} coordinates={region.coordinates}>
              <g transform={`scale(${markerScale})`}>
                <g
                  className={isStatic ? styles.markerStatic : styles.markerGroup}
                  onClick={isStatic ? undefined : () => selectRegion(region)}
                  onMouseEnter={isStatic ? undefined : () => selectRegion(region)}
                  role={isStatic ? undefined : "button"}
                  tabIndex={isStatic ? undefined : 0}
                  aria-pressed={isStatic ? undefined : isActive}
                  aria-label={isStatic ? undefined : `Выбрать регион: ${region.label}`}
                  onKeyDown={
                    isStatic
                      ? undefined
                      : (e) => {
                          if (e.key === "Enter" || e.key === " ") selectRegion(region);
                        }
                  }
                >
                  <path
                    d={PIN_PATH}
                    className={isActive ? styles.pinActive : styles.pin}
                    strokeWidth={1.5}
                  />
                  <circle
                    cx={0}
                    cy={-16}
                    r={4.5}
                    className={styles.pinInner}
                  />
                  <text
                    x={18}
                    y={-12}
                    fontSize={labelFontSize}
                    fontWeight={600}
                    className={styles.markerLabel}
                  >
                    {region.label}
                  </text>
                </g>
              </g>
            </Marker>
          );
        })}
      </ComposableMap>

      {showDetails && activeRegion ? (
        <div className={styles.details}>
          <div className={styles.detailsKicker}>Выбранный регион</div>
          <div className={styles.detailsTitle}>{activeRegion.label}</div>
          {activeRegion.details ? <p className={styles.detailsText}>{activeRegion.details}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
