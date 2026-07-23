import Image from "next/image";
import styles from "./AdvantagesSection.module.scss";

const advantages = [
  { icon: "/icons/calendar.svg", text: "Более 30 лет\nбесперебойной работы" },
  { icon: "/icons/box-add.svg", text: "1000+ наименований\nв ассортименте" },
  { icon: "/icons/sklad.svg", text: "15 000 м2 складских\nпомещений" },
  { icon: "/icons/calculator.svg", text: "Калькуляторы\nраспила и кубов" },
  { icon: "/icons/delivery.svg", text: "Максимально\nбыстрая доставка" },
  { icon: "/icons/quality.svg", text: "Высокое качество\nпродукции" },
  { icon: "/icons/trend-up.svg", text: "Выгодные условия\nработы" },
  { icon: "/icons/tag-user.svg", text: "Индивидуальный\nподход" },
];

export default function AdvantagesSection(props: { subtitle: string; items: string[] }) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Наши преимущества</h2>
        <p className={styles.subtitle}>{props.subtitle}</p>
      </div>

      <div className={styles.grid}>
        {advantages.map((adv, index) => (
          <div key={`${adv.text}-${index}`} className={styles.card}>
            <span className={styles.cardIcon}>
              <Image src={adv.icon} alt="" width={48} height={48} />
            </span>
            <p className={styles.cardText}>{props.items[index] ?? adv.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}