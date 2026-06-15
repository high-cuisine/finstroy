import { sitePath } from "@/app/shared/lib/sitePath";
import { aboutSubLinks } from "../Header/headerNav";

export const footerMainLinks = [
  { label: "Каталог товаров", href: sitePath("/catalog") },
  { label: "Калькулятор распила", href: sitePath("/calculate") },
  { label: "Проекты", href: sitePath("/projects") },
  { label: "Поставщикам", href: sitePath("/suppliers") },
  { label: "Новости", href: sitePath("/news") },
  { label: "Контакты", href: sitePath("/contacts") },
  { label: "Отзывы", href: sitePath("/reviews") },
] as const;

export const footerAboutLinks = aboutSubLinks;

export const footerContacts = {
  phone: "+7 800 550 02 20",
  phoneHref: "tel:+78005500220",
  email: "info@fin-sm.ru",
  emailHref: "mailto:info@fin-sm.ru",
  address: "108852, г. Москва, г. Щербинка, ул. Восточная, д. 10",
} as const;
