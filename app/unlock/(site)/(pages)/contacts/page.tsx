"use client";

import Header from "@/app/shared/componets/layout/Header/Header";
import Footer from "@/app/shared/componets/layout/Footer/Footer";
import { useContactsPage } from "./hooks/useContactsPage";
import CityBar from "./components/CityBar/CityBar";
import ContactsInfoCard from "./components/ContactsInfoCard/ContactsInfoCard";
import LocationBlock from "./components/LocationBlock/LocationBlock";
import styles from "./contacts.module.scss";

export default function ContactsPage() {
  const {
    items,
    activeSlug,
    setActiveSlug,
    active,
    loading,
    error,
    displayPhones,
    displayEmails,
    hoursLine,
    officeAddr,
    warehouseAddr,
    companyName,
    headingCity,
    cityLabel,
  } = useContactsPage();

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <CityBar
          items={items}
          activeSlug={activeSlug}
          loading={loading}
          error={error}
          onChange={setActiveSlug}
        />

        <div className={styles.container}>
          {!loading && !error && items.length === 0 && (
            <p className={styles.emptyNotice}>
              Список контактов пуст. Добавьте записи типа «contact» в WordPress.
            </p>
          )}

          {active && (
            <>
              <div className={styles.titleSection}>
                <h1 className={styles.title}>
                  Финстрой
                  <br />
                  <span className={styles.titleCity}>{headingCity}</span>
                </h1>
                <p className={styles.company}>{companyName}</p>
              </div>

              <div className={styles.grid}>
                <ContactsInfoCard
                  phones={displayPhones}
                  emails={displayEmails}
                  hoursLine={hoursLine}
                />
                <LocationBlock
                  title="Офис"
                  address={officeAddr}
                  coords={active.officeCoords}
                  label={`Офис — ${cityLabel}`}
                />
                <LocationBlock
                  title="Склад"
                  address={warehouseAddr}
                  coords={active.warehouseCoords}
                  label={`Склад — ${cityLabel}`}
                />
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
