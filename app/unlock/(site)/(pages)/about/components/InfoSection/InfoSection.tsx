import Image from "next/image";
import AppLogo from "@/app/shared/componets/ui/AppLogo/AppLogo";
import AboutMapSection from "../AboutMapSection/AboutMapSection";
import styles from "./InfoSection.module.scss";

export default function InfoSection() {
  return (
    <div className={styles.section}>
      <h1 className={styles.h1}>Информация</h1>

      <p className={styles.lead}>
        Группа компаний «ФИНСТРОЙ» является одной из крупнейших Российских компаний по продаже
        древесно-плитных материалов. Мы поставляем материалы строительным организациям, промышленным
        предприятиям, оптовым и розничным торговым фирмам, магазинам и торговым сетям, а так же
        частным лицам. Благодаря высокому уровню менеджмента и профессионализму сотрудников, наша
        компания растет и постоянно развивается с учетом интересов потребителей, ориентируясь
        исключительно на высокое качество товаров, сервиса. Наша работа, начиная с первого звонка и
        до получения и использования нашего товара, ориентирована на скорость и удобство вашей
        работы. Мы являемся дилерами заводов-производителей, а это гарантирует для вас лучшие цены.
        Для нас важен каждый клиент, поэтому мы всегда идем на встречу к Вам.
      </p>

      <section className={styles.mediaGrid} aria-label="Фотографии компании">
        <div className={`${styles.mediaItem} ${styles.mediaLogo}`}>
          <AppLogo className={styles.logo} priority />
        </div>
        <div className={styles.mediaItem}>
          <Image src="/about/about-1.png" alt="" fill sizes="(max-width: 1100px) 60vw, 33vw" className={styles.mediaImg} />
        </div>
        <div className={styles.mediaItem}>
          <Image src="/about/about-2.png" alt="" fill sizes="(max-width: 1100px) 60vw, 33vw" className={styles.mediaImg} />
        </div>
        <div className={styles.mediaItem}>
          <Image src="/about/about-3.png" alt="" fill sizes="(max-width: 1100px) 60vw, 33vw" className={styles.mediaImg} />
        </div>
        <div className={styles.mediaItem}>
          <Image src="/about/about-4.png" alt="" fill sizes="(max-width: 1100px) 60vw, 33vw" className={styles.mediaImg} />
        </div>
        <div className={styles.mediaItem}>
          <Image src="/about/about-5.png" alt="" fill sizes="(max-width: 1100px) 60vw, 33vw" className={styles.mediaImg} />
        </div>
      </section>

      <p className={styles.text}>
        Наши офисы и склады находятся в Москве, Воронеже, Санкт-Петербурге, Нижнем Новгороде,
        Самаре, Краснодаре, Ростове-на-Дону, Новосибирске, Екатеринбурге, Челябинске. Благодаря
        эффективно выстроенной логистике мы осуществляем поставки продукции на всей территории
        Российской Федерации. Миссия компании: надежные, высокотехнологичные и качественные продукты.
        За годы работы мы зарекомендовали себя как надежный и ответственный поставщик. Минимальные
        сроки доставки, высокое качество продукции, выгодные условия сотрудничества, а так же
        индивидуальный подход к каждому клиенту, делает работу с ГК «ФИНСТРОЙ» удобной и комфортной.
      </p>

      <AboutMapSection />
    </div>
  );
}
