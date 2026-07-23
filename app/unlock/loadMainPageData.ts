import { FALLBACK_GLAVNAYA_ACF } from "@/app/features/wp/api/glavnayaFallback";
import { getGlavnayaPageServer } from "@/app/features/wp/api/wpPagesApi";
import { getNewsList, type NewsListItem } from "@/app/features/wp/api/wpNewsApi";
import { fetchContactPostsServer } from "@/app/features/wp/api/wpContactsApi.server";
import type { WpContactItem } from "@/app/features/wp/api/wpContactsHelpers";
import type { GlavnayaAcf } from "@/app/features/wp/api/types";

export type MainNewsItem = NewsListItem;

export async function loadMainPageData(): Promise<{
  acf: GlavnayaAcf;
  mainNewsItems: MainNewsItem[];
  contacts: WpContactItem[];
}> {
  let acf = FALLBACK_GLAVNAYA_ACF;
  let news: NewsListItem[] = [];
  let contacts: WpContactItem[] = [];

  const [glavnayaResult, newsResult, contactsResult] = await Promise.allSettled([
    getGlavnayaPageServer(),
    getNewsList(),
    fetchContactPostsServer(),
  ]);

  if (glavnayaResult.status === "fulfilled") {
    acf = glavnayaResult.value.data.entity.acf;
  } else if (process.env.NODE_ENV === "development") {
    console.warn(
      "[loadMainPageData] glavnaya недоступна, показываем заглушку:",
      glavnayaResult.reason,
    );
  }

  if (newsResult.status === "fulfilled") {
    news = newsResult.value;
  } else if (process.env.NODE_ENV === "development") {
    console.warn("[loadMainPageData] новости недоступны:", newsResult.reason);
  }

  if (contactsResult.status === "fulfilled") {
    contacts = contactsResult.value;
  } else if (process.env.NODE_ENV === "development") {
    console.warn("[loadMainPageData] контакты недоступны:", contactsResult.reason);
  }

  const mainNewsItems = news.slice(0, 4);

  return { acf, mainNewsItems, contacts };
}
