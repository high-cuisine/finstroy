"use client";

import Header from "@/app/shared/componets/layout/Header/Header";
import Footer from "@/app/shared/componets/layout/Footer/Footer";
import { useAboutSection } from "./hooks/useAboutSection";
import AboutSidebar from "./components/AboutSidebar/AboutSidebar";
import InfoSection from "./components/InfoSection/InfoSection";
import TeamSection from "./components/TeamSection/TeamSection";
import ClientsSection from "./components/ClientsSection/ClientsSection";
import CertificatesSection from "./components/CertificatesSection/CertificatesSection";
import styles from "./about.module.scss";

export default function AboutPage() {
  const { active, setActive, sections } = useAboutSection();

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <AboutSidebar
            sections={sections}
            active={active}
            onChange={(key) => setActive(key as typeof active)}
          />

          <section className={styles.content}>
            {active === "info" && <InfoSection />}
            {active === "team" && <TeamSection />}
            {active === "clients" && <ClientsSection />}
            {active === "certs" && <CertificatesSection />}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
