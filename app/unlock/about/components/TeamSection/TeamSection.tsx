"use client";

import { useState } from "react";
import Image from "next/image";
import { teamMembers, teamTabs, culturePhotos, cultureText, vacancies } from "../../data/aboutData";
import styles from "./TeamSection.module.scss";

export default function TeamSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={`${styles.section} ${styles.teamSection}`}>
      <div className={styles.teamTop}>
        <h1 className={styles.h1}>Сотрудники</h1>

        <div className={styles.teamTabs} aria-label="Разделы сотрудников">
          {teamTabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={[
                styles.teamTab,
                index === activeTab ? styles.teamTabActive : "",
              ].filter(Boolean).join(" ")}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 0 && (
        <>
          <p className={styles.teamLead}>
            Сотрудники — это главный актив компании ФИНСТРОЙ. Их профессионализм и стремление к развитию
            создают уникальную атмосферу, способствующую успеху. Мы ценим каждого члена команды и уверены,
            что именно благодаря их усилиям мы достигаем высоких результатов.
          </p>
          <div className={styles.teamGrid} role="list" aria-label="Список сотрудников">
            {teamMembers.map((m, index) => (
              <article key={`${m.name}-${index}`} className={styles.teamCard} role="listitem">
                {m.imageSrc ? (
                  <div className={styles.teamPhoto}>
                    <Image src={m.imageSrc} alt={m.name} fill sizes="(max-width: 860px) 50vw, 25vw" className={styles.teamPhotoImg} />
                  </div>
                ) : (
                  <div className={styles.teamPhotoPlaceholder} aria-hidden="true" />
                )}
                <div className={styles.teamCardBottom}>
                  <div className={styles.memberName}>{m.name}</div>
                  <div className={styles.memberRole}>{m.role}</div>
                </div>
              </article>
            ))}
            <button type="button" className={styles.allTeamCard}>
              <span>Все сотрудники</span>
              <span aria-hidden>›</span>
            </button>
          </div>
        </>
      )}

      {activeTab === 1 && (
        <>
          <div className={styles.cultureGallery} aria-label="Фотографии корпоративной культуры">
            <div className={`${styles.cultureRow} ${styles.cultureRowTop}`}>
              {culturePhotos.top.map((photo) => (
                <div key={photo.src} className={styles.culturePhoto}>
                  <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 860px) 50vw, 526px" className={styles.culturePhotoImg} />
                </div>
              ))}
            </div>
            <div className={`${styles.cultureRow} ${styles.cultureRowBottom}`}>
              {culturePhotos.bottom.map((photo) => (
                <div key={photo.src} className={styles.culturePhoto}>
                  <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 860px) 33vw, 347px" className={styles.culturePhotoImg} />
                </div>
              ))}
            </div>
          </div>
          <div className={styles.cultureTextBlock}>
            {cultureText.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className={styles.cultureParagraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </>
      )}

      {activeTab === 2 && (
        <>
          <p className={styles.teamLead}>
            Мы всегда в поиске талантливых специалистов. Присоединяйтесь к команде ФИНСТРОЙ
            и развивайтесь вместе с одним из крупнейших поставщиков древесно-плитных материалов в России.
          </p>
          <div className={styles.vacancyList}>
            {vacancies.map((v) => (
              <div key={v.title} className={styles.vacancyCard}>
                <div className={styles.vacancyInfo}>
                  <div className={styles.vacancyTitle}>{v.title}</div>
                  <div className={styles.vacancyMeta}>
                    <span>{v.dept}</span>
                    <span className={styles.vacancyDot} aria-hidden>·</span>
                    <span>{v.location}</span>
                    <span className={styles.vacancyDot} aria-hidden>·</span>
                    <span>{v.type}</span>
                  </div>
                </div>
                <button type="button" className={styles.vacancyBtn}>Откликнуться</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
