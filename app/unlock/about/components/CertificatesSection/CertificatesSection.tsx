import Image from "next/image";
import { certificates } from "../../data/aboutData";
import styles from "./CertificatesSection.module.scss";

export default function CertificatesSection() {
  return (
    <div className={`${styles.section} ${styles.certsSection}`}>
      <h1 className={styles.h1}>Сертификаты</h1>

      <section className={styles.certsGrid} aria-label="Список сертификатов">
        {certificates.map((cert, idx) => (
          <article
            key={`${cert.title}-${idx}`}
            className={`${styles.certCard}${cert.wide ? ` ${styles.certCardWide}` : ""}`}
          >
            {cert.fileUrl ? (
              <a href={cert.fileUrl} target="_blank" rel="noreferrer" className={styles.certCardInner}>
                <div className={styles.certPreview}>
                  {cert.imageSrc ? (
                    <Image src={cert.imageSrc} alt={cert.title} fill sizes="(max-width: 860px) 50vw, 25vw"
                      className={`${styles.certPreviewImg}${cert.wide ? ` ${styles.certPreviewImgLandscape}` : ""}`} />
                  ) : (
                    <div className={styles.certPreviewPlaceholder} />
                  )}
                </div>
                <span className={styles.certTitle}>{cert.title}</span>
              </a>
            ) : (
              <div className={styles.certCardInner}>
                <div className={styles.certPreview}>
                  {cert.imageSrc ? (
                    <Image src={cert.imageSrc} alt={cert.title} fill sizes="(max-width: 860px) 50vw, 25vw"
                      className={`${styles.certPreviewImg}${cert.wide ? ` ${styles.certPreviewImgLandscape}` : ""}`} />
                  ) : (
                    <div className={styles.certPreviewPlaceholder} />
                  )}
                </div>
                <span className={styles.certTitle}>{cert.title}</span>
              </div>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
