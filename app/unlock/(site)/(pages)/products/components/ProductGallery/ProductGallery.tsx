"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/app/shared/context/ThemeContext";
import type { ProductImage } from "@/app/features/wp/api/wpProductsApi";
import styles from "./ProductGallery.module.scss";

type ProductGalleryProps = {
  images: ProductImage[];
  alt: string;
};

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const activeImage = images[activeIndex];

  useEffect(() => {
    setActiveIndex(0);
    setImgError(false);
  }, [images]);

  const logoSrc = theme === "dark" ? "/icons/logo-dark.svg" : "/icons/logo.svg";

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImageWrap}>
        {activeImage && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={activeImage.src}
            src={activeImage.src}
            srcSet={activeImage.srcset}
            sizes={activeImage.sizes ?? "(max-width: 768px) 100vw, 560px"}
            alt={activeImage.alt || alt}
            className={styles.mainImg}
            onError={() => setImgError(true)}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoSrc} alt="Финстрой" className={styles.placeholderLogo} aria-hidden="true" />
        )}
      </div>

      {images.length > 1 ? (
        <div className={styles.thumbnailRow}>
          {images.map((image, index) => (
            <button
              key={`${image.id}-${image.src}`}
              type="button"
              className={`${styles.thumbnail} ${activeIndex === index ? styles.thumbnailActive : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Фото ${index + 1}`}
              aria-current={activeIndex === index ? "true" : undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.thumbnail || image.src}
                alt=""
                className={styles.thumbnailImg}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
