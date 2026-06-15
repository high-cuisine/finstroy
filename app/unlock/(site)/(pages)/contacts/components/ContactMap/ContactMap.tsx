"use client";

import { useEffect, useRef, useState } from "react";
import {
  loadYandexMapsScript,
  type YandexMapInstance,
} from "@/app/shared/lib/yandexMaps/loadYandexMaps";
import styles from "./ContactMap.module.scss";

interface ContactMapProps {
  coords: [number, number];
  label?: string;
}

type MapStatus = "loading" | "ready" | "error";

function MapFallback(props: { label?: string; message?: string }) {
  return (
    <div className={styles.fallback} role="img" aria-label={props.label ?? "Карта недоступна"}>
      <div className={styles.fallbackGrid} aria-hidden="true" />
      <div className={styles.fallbackPin}>
        <svg width="28" height="36" viewBox="0 0 28 36" fill="none" aria-hidden="true">
          <path
            d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z"
            fill="#006f3d"
          />
          <circle cx="14" cy="14" r="5" fill="white" />
        </svg>
        {props.label ? <span className={styles.fallbackLabel}>{props.label}</span> : null}
      </div>
      {props.message ? <p className={styles.fallbackMessage}>{props.message}</p> : null}
    </div>
  );
}

export default function ContactMap({ coords, label }: ContactMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<MapStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let destroyed = false;
    let map: YandexMapInstance | null = null;

    void (async () => {
      try {
        await loadYandexMapsScript();
        if (destroyed || !containerRef.current) return;

        const ymaps3 = window.ymaps3;
        if (!ymaps3) {
          throw new Error("Yandex Maps script loaded but ymaps3 is unavailable");
        }

        await ymaps3.ready;
        if (destroyed || !containerRef.current) return;

        const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = ymaps3;
        const center: [number, number] = [coords[1], coords[0]];

        map = new YMap(containerRef.current, {
          location: { center, zoom: 15 },
          behaviors: ["drag", "pinchZoom", "dblClick"],
        });

        map.addChild(new YMapDefaultSchemeLayer({}));
        map.addChild(new YMapDefaultFeaturesLayer({}));

        const pinEl = document.createElement("div");
        pinEl.className = styles.pin;
        pinEl.innerHTML = `<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#006f3d"/>
          <circle cx="14" cy="14" r="5" fill="white"/>
        </svg>`;
        if (label) {
          const labelEl = document.createElement("span");
          labelEl.className = styles.pinLabel;
          labelEl.textContent = label;
          pinEl.appendChild(labelEl);
        }

        map.addChild(new YMapMarker({ coordinates: center, anchor: [0.5, 1] }, pinEl));

        if (!destroyed) {
          setStatus("ready");
          setErrorMessage(null);
        }
      } catch (error) {
        if (destroyed) return;
        setStatus("error");
        const detail = error instanceof Error ? error.message : "Не удалось загрузить карту";
        if (process.env.NODE_ENV === "development") {
          setErrorMessage(detail);
        } else {
          console.error("[ContactMap]", detail);
          setErrorMessage("Карта временно недоступна");
        }
      }
    })();

    return () => {
      destroyed = true;
      map?.destroy?.();
      map = null;
    };
  }, [coords, label]);

  if (status === "error") {
    return <MapFallback label={label} message={errorMessage ?? undefined} />;
  }

  return (
    <div className={styles.wrap}>
      {status === "loading" ? <MapFallback label={label} /> : null}
      <div
        ref={containerRef}
        className={styles.map}
        hidden={status !== "ready"}
        aria-hidden={status !== "ready"}
      />
    </div>
  );
}
