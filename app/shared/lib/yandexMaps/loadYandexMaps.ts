export type YandexMapInstance = {
  addChild: (child: unknown) => void;
  destroy?: () => void;
};

declare global {
  interface Window {
    ymaps3?: {
      ready: Promise<void>;
      YMap: new (
        container: HTMLElement,
        props: {
          location: { center: [number, number]; zoom: number };
          behaviors?: string[];
        },
      ) => YandexMapInstance;
      YMapDefaultSchemeLayer: new (props?: Record<string, unknown>) => unknown;
      YMapDefaultFeaturesLayer: new (props?: Record<string, unknown>) => unknown;
      YMapMarker: new (
        props: { coordinates: [number, number]; anchor?: [number, number] },
        element: HTMLElement,
      ) => unknown;
    };
  }
}

const API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY?.trim() ?? "";

let scriptPromise: Promise<void> | null = null;

function yandexMapsLoadErrorMessage(): string {
  const host =
    typeof window !== "undefined" ? window.location.hostname : "localhost";
  return (
    "Yandex Maps script failed to load. In Yandex Developer Console → API key → " +
    "«Ограничение по HTTP Referer», add one domain per line (without https://, port, or path): " +
    `finstroi.com, localhost, ${host}. ` +
    "Changes take up to 15 minutes. Verify NEXT_PUBLIC_YANDEX_MAPS_API_KEY in .env.local " +
    "and restart `npm run dev`."
  );
}

export function getYandexMapsApiKey(): string {
  return API_KEY;
}

export function isYandexMapsConfigured(): boolean {
  return API_KEY.length > 0;
}

function waitForYmapsReady(): Promise<void> {
  const ready = window.ymaps3?.ready;
  if (!ready) {
    return Promise.reject(new Error("Yandex Maps script loaded but ymaps3 is unavailable"));
  }
  return ready;
}

export function loadYandexMapsScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Yandex Maps can only load in the browser"));
  }

  if (!isYandexMapsConfigured()) {
    return Promise.reject(
      new Error("NEXT_PUBLIC_YANDEX_MAPS_API_KEY is not set. Add it to .env.local"),
    );
  }

  if (window.ymaps3?.ready) {
    return waitForYmapsReady();
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-ymaps3]");
    if (existing) {
      existing.addEventListener("load", () => void waitForYmapsReady().then(resolve).catch(reject), {
        once: true,
      });
      existing.addEventListener(
        "error",
        () =>
          reject(
            new Error(yandexMapsLoadErrorMessage()),
          ),
        { once: true },
      );
      if (window.ymaps3?.ready) {
        void waitForYmapsReady().then(resolve).catch(reject);
      }
      return;
    }

    const script = document.createElement("script");
    script.src = `https://api-maps.yandex.ru/v3/?apikey=${encodeURIComponent(API_KEY)}&lang=ru_RU`;
    script.async = true;
    script.referrerPolicy = "strict-origin-when-cross-origin";
    script.dataset.ymaps3 = "1";
    script.onload = () => void waitForYmapsReady().then(resolve).catch(reject);
    script.onerror = () =>
      reject(
        new Error(yandexMapsLoadErrorMessage()),
      );
    document.head.appendChild(script);
  });

  return scriptPromise;
}
