"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  fetchEmployees,
  type EmployeeItem,
} from "@/app/features/wp/api/wpEmployeesApi";
import {
  fetchVacancies,
  type VacancyItem,
} from "@/app/features/wp/api/wpVacanciesApi";
import { teamTabs, culturePhotos, cultureText } from "../../data/aboutData";
import VacancyApplyModal from "../VacancyApplyModal/VacancyApplyModal";
import styles from "./TeamSection.module.scss";

export default function TeamSection() {
  const [activeTab, setActiveTab] = useState(0);

  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [employeesError, setEmployeesError] = useState<string | null>(null);

  const [vacancies, setVacancies] = useState<VacancyItem[]>([]);
  const [vacanciesLoading, setVacanciesLoading] = useState(false);
  const [vacanciesError, setVacanciesError] = useState<string | null>(null);

  const [applyOpen, setApplyOpen] = useState(false);
  const [applyContact, setApplyContact] = useState("");
  const [applyTitle, setApplyTitle] = useState("");

  useEffect(() => {
    if (activeTab !== 0) return;
    let cancelled = false;

    setEmployeesLoading(true);
    setEmployeesError(null);

    void fetchEmployees()
      .then((items) => {
        if (!cancelled) setEmployees(items);
      })
      .catch((e) => {
        if (!cancelled) {
          setEmployeesError(
            e instanceof Error ? e.message : "Ошибка загрузки сотрудников",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setEmployeesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 2) return;
    let cancelled = false;

    setVacanciesLoading(true);
    setVacanciesError(null);

    void fetchVacancies()
      .then((items) => {
        if (!cancelled) setVacancies(items);
      })
      .catch((e) => {
        if (!cancelled) {
          setVacanciesError(
            e instanceof Error ? e.message : "Ошибка загрузки вакансий",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setVacanciesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const openApply = (vacancy: VacancyItem) => {
    setApplyContact(vacancy.contact);
    setApplyTitle(vacancy.title);
    setApplyOpen(true);
  };

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
              ]
                .filter(Boolean)
                .join(" ")}
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
            Сотрудники — это главный актив компании ФИНСТРОЙ. Их профессионализм и
            стремление к развитию создают уникальную атмосферу, способствующую
            успеху. Мы ценим каждого члена команды и уверены, что именно благодаря
            их усилиям мы достигаем высоких результатов.
          </p>

          {employeesLoading && (
            <p className={styles.teamStatus}>Загружаем сотрудников…</p>
          )}
          {!employeesLoading && employeesError && (
            <p className={styles.teamStatus}>Ошибка загрузки: {employeesError}</p>
          )}
          {!employeesLoading && !employeesError && employees.length === 0 && (
            <p className={styles.teamStatus}>Список сотрудников пока пуст.</p>
          )}

          {!employeesLoading && !employeesError && employees.length > 0 && (
            <div className={styles.teamGrid} role="list" aria-label="Список сотрудников">
              {employees.map((m) => (
                <article key={m.id} className={styles.teamCard} role="listitem">
                  {m.imageSrc ? (
                    <div className={styles.teamPhoto}>
                      <Image
                        src={m.imageSrc}
                        alt={m.name}
                        fill
                        sizes="(max-width: 860px) 50vw, 25vw"
                        className={styles.teamPhotoImg}
                      />
                    </div>
                  ) : (
                    <div className={styles.teamPhotoPlaceholder} aria-hidden="true" />
                  )}
                  <div className={styles.teamCardBottom}>
                    <div className={styles.memberName}>{m.name}</div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 1 && (
        <>
          <div className={styles.cultureGallery} aria-label="Фотографии корпоративной культуры">
            <div className={`${styles.cultureRow} ${styles.cultureRowTop}`}>
              {culturePhotos.top.map((photo) => (
                <div key={photo.src} className={styles.culturePhoto}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 860px) 50vw, 526px"
                    className={styles.culturePhotoImg}
                  />
                </div>
              ))}
            </div>
            <div className={`${styles.cultureRow} ${styles.cultureRowBottom}`}>
              {culturePhotos.bottom.map((photo) => (
                <div key={photo.src} className={styles.culturePhoto}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 860px) 33vw, 347px"
                    className={styles.culturePhotoImg}
                  />
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
            Мы всегда в поиске талантливых специалистов. Присоединяйтесь к команде
            ФИНСТРОЙ и развивайтесь вместе с одним из крупнейших поставщиков
            древесно-плитных материалов в России.
          </p>

          {vacanciesLoading && (
            <p className={styles.teamStatus}>Загружаем вакансии…</p>
          )}
          {!vacanciesLoading && vacanciesError && (
            <p className={styles.teamStatus}>Ошибка загрузки: {vacanciesError}</p>
          )}
          {!vacanciesLoading && !vacanciesError && vacancies.length === 0 && (
            <p className={styles.teamStatus}>Извините, вакансий сейчас нет</p>
          )}

          {!vacanciesLoading && !vacanciesError && vacancies.length > 0 && (
            <div className={styles.vacancyList}>
              {vacancies.map((v) => {
                const meta = [v.dept, v.city, v.employmentType].filter(Boolean);
                return (
                  <div key={v.id} className={styles.vacancyCard}>
                    <div className={styles.vacancyInfo}>
                      <div className={styles.vacancyTitle}>{v.title}</div>
                      {meta.length > 0 && (
                        <div className={styles.vacancyMeta}>
                          {meta.map((part, i) => (
                            <span key={`${v.id}-${part}`} className={styles.vacancyMetaItem}>
                              {i > 0 && (
                                <span className={styles.vacancyDot} aria-hidden>
                                  ·
                                </span>
                              )}
                              {part}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className={styles.vacancyBtn}
                      onClick={() => openApply(v)}
                    >
                      Откликнуться
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <VacancyApplyModal
        isOpen={applyOpen}
        contact={applyContact}
        vacancyTitle={applyTitle}
        onClose={() => setApplyOpen(false)}
      />
    </div>
  );
}
