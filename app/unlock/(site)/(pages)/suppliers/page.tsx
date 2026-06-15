import Image from "next/image";
import Header from "@/app/shared/componets/layout/Header/Header";
import Footer from "@/app/shared/componets/layout/Footer/Footer";
import styles from "./suppliers.module.scss";

type PartnerItem = {
  label?: string;
  imageSrc?: string;
  imageAlt?: string;
  wide?: boolean;
  dimmed?: boolean;
};

const mdfPartners: PartnerItem[] = [
  { imageSrc: "/suppliers/logos/suppliers-mdf-1.svg", imageAlt: "SWISS KRONO" },
  { imageSrc: "/suppliers/logos/suppliers-mdf-2.svg", imageAlt: "KRASPAN" },
  { imageSrc: "/suppliers/logos/suppliers-mdf-3.svg", imageAlt: "Вышневолоцкий МДОК" },
  { imageSrc: "/suppliers/logos/suppliers-mdf-4.svg", imageAlt: "SOMME INDUSTRIA" },
  { imageSrc: "/suppliers/logos/suppliers-mdf-5.svg", imageAlt: "АЛТАЙ/ЛЕС" },
  { label: "", dimmed: true },
];

const plywoodPartners: PartnerItem[] = [
  { imageSrc: "/suppliers/logos/suppliers-plywood-1.svg", imageAlt: "СВЕЗА" },
  { imageSrc: "/suppliers/logos/suppliers-plywood-2.svg", imageAlt: "segezha group" },
  { imageSrc: "/suppliers/logos/suppliers-plywood-3.svg", imageAlt: "ILIM TIMBER" },
  { imageSrc: "/suppliers/logos/suppliers-plywood-4.svg", imageAlt: "HOMANIT" },
  { imageSrc: "/suppliers/logos/suppliers-plywood-5.svg", imageAlt: "Партнер" },
  { label: "", dimmed: true },
];

const osbPartners: PartnerItem[] = [
  {
    imageSrc: "/suppliers/logos/suppliers-osb-group.svg",
    imageAlt: "LATAT и KRONOSPAN",
    wide: true,
  },
];

function PartnersGrid(props: { items: PartnerItem[] }) {
  return (
    <div className={styles.partnersGrid}>
      {props.items.map((p, idx) => (
        <div
          key={`${p.label ?? p.imageSrc ?? "partner"}-${idx}`}
          className={`${styles.partnerCard}${p.dimmed ? ` ${styles.partnerCardDimmed}` : ""}${p.wide ? ` ${styles.partnerCardWide}` : ""}`}
          aria-hidden={p.label || p.imageSrc ? undefined : "true"}
        >
          {p.imageSrc ? (
            <Image
              src={p.imageSrc}
              alt={p.imageAlt ?? ""}
              width={170}
              height={110}
              className={styles.partnerLogo}
            />
          ) : (
            p.label && <span className={styles.partnerLabel}>{p.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function SuppliersPage() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <article className={styles.card}>
            <div className={styles.introGrid}>
              <section className={styles.block}>
                <h1 className={styles.h1}>Поставщикам</h1>
                <p className={styles.text}>
                  Мы всегда рады новым возможностям и открыты для сотрудничества с новыми поставщиками.
                  Если вы хотите обсудить условия партнерства или предложить свои товары, не стесняйтесь
                  связаться с нами. Мы ценим каждую возможность расширить наш ассортимент и улучшить
                  качество обслуживания клиентов.
                </p>
              </section>

              <section className={styles.block}>
                <h2 className={styles.h2}>
                  Если у вас есть релевантные предложения о поставках, вы можете направить их на почту для
                  предложений:{" "}
                  <a className={styles.mailLink} href="mailto:offers@fin-sm.ru">
                    offers@fin-sm.ru
                  </a>
                </h2>
                <p className={styles.text}>
                  Или свяжитесь с нами любым удобным способом, представленным в разделе Контакты
                </p>
              </section>
            </div>

            <section className={styles.group}>
              <h3 className={styles.groupTitle}>Производители МДФ, ХДФ, ДСП</h3>
              <PartnersGrid items={mdfPartners} />
            </section>

            <section className={styles.group}>
              <h3 className={styles.groupTitle}>Производители фанеры</h3>
              <PartnersGrid items={plywoodPartners} />
            </section>

            <section className={styles.group}>
              <h3 className={styles.groupTitle}>Производители OSB - плит</h3>
              <PartnersGrid items={osbPartners} />
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}

