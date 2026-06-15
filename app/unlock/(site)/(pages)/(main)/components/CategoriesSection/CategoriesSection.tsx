import Image from "next/image";
import Link from "next/link";
import { sitePath } from "@/app/shared/lib/sitePath";
import styles from "./CategoriesSection.module.scss";

const categories = [
  { name: "Продукция\nSVEZA", image: "/images/cat-sveza-71db3a.png", query: "SVEZA" },
  { name: "Фанера ФК", image: "/images/cat-fk-125d2b.png", query: "Фанера ФК" },
  { name: "Фанера ЛФ", image: "/images/cat-lf-63735f.png", query: "Фанера ЛФ" },
  { name: "Фанера ФСФ", image: "/images/cat-fsf-55dc88.png", query: "Фанера ФСФ" },
  { name: "Фанера\nФСФ хвойная", image: "/images/cat-fsf-hv-2f71c5.png", query: "ФСФ хвойная" },
  { name: "Авиационная\nфанера", image: "/images/cat-avia-19eb7e.png", query: "Авиационная фанера" },
  { name: "МДФ", image: "/images/cat-mdf-710c6e.png", query: "МДФ" },
  { name: "EVOGLOSS,\nACRYLIC", image: "/images/cat-evogloss-5b2794.png", query: "EVOGLOSS" },
  { name: "ХДФ", image: "/images/cat-hdf-563846.png", query: "HDF" },
  { name: "ДСП, ЛДСП", image: "/images/cat-dsp-221423.png", query: "ДСП" },
  { name: "OSB", image: "/images/cat-osb-649bba.png", query: "OSB" },
  { name: "ДСП\nшпунтованная", image: "/images/cat-dsp-sh-30d777.png", query: "шпунтованная" },
  { name: "ДВП", image: "/images/cat-dvp-14ab96.png", query: "ДВП" },
  { name: "Столешницы", image: "/images/cat-stol-271f72.png", query: "Столешницы" },
  { name: "Опалубка", image: "/images/cat-opal-505de8.png", query: "Опалубка" },
  { name: "Фурнитура Boyard", image: "/images/cat-furn-33e1b7.png", query: "BOYARD" },
];

export default function CategoriesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={sitePath(`/catalog?q=${encodeURIComponent(cat.query)}`)}
            className={styles.card}
          >
            <Image
              src={cat.image}
              alt={cat.name}
              width={573}
              height={549}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
              className={styles.cardImage}
            />
            <span className={styles.cardLabel}>{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
