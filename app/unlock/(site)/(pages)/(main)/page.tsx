import Header from "@/app/shared/componets/layout/Header/Header";
import HeroSection from "./components/HeroSection/HeroSection";
import CategoriesSection from "./components/CategoriesSection/CategoriesSection";
import AdvantagesSection from "./components/AdvantagesSection/AdvantagesSection";
import MapSection from "./components/MapSection/MapSection";
import ClientsSection from "./components/ClientsSection/ClientsSection";
import FaqSection from "./components/FaqSection/FaqSection";
import NewsSection from "./components/NewsSection";
import Footer from "@/app/shared/componets/layout/Footer/Footer";
import { loadMainPageData } from "./loadMainPageData";
import styles from "./page.module.scss";

export default async function MainPage() {
  const { acf, mainNewsItems, contacts } = await loadMainPageData();

  return (
    <div className={`${styles.page} flex flex-col w-full`}>
      <Header />
      <HeroSection
        title={acf.hero_block_description}
        videoLabel={acf.hero_block_text_of_link}
        stats={[
          { value: acf.hero_block_years, label: "год на рынке" },
          { value: acf.hero_block_product_names, label: "" },
          { value: acf.hero_block_annual_turnover, label: "годовой\nтоварооборот" },
        ]}
      />
      <CategoriesSection />
      <AdvantagesSection
        subtitle={acf.our_advantages_description}
        items={acf.list_of_our_advantages.map((item) => item.advantages_description)}
      />
      <MapSection
        subtitle={acf.company_office_description}
        contacts={contacts}
      />
      <ClientsSection subtitle={acf.clients_description} />
      <FaqSection
        items={acf.questions_answers.map((item) => ({
          question: item["title-question"],
          answer: item.answer,
        }))}
      />
      <NewsSection items={mainNewsItems} />
      <Footer />
    </div>
  );
}
