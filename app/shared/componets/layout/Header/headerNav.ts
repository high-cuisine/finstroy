import { sitePath } from "@/app/shared/lib/sitePath";

export type AboutSubLink = {
  label: string;
  href: string;
};

export const aboutSubLinks: AboutSubLink[] = [
  { label: "Информация", href: sitePath("/about#info") },
  { label: "Сотрудники", href: sitePath("/about#team") },
  { label: "Наши клиенты", href: sitePath("/about#clients") },
  { label: "Сертификаты", href: sitePath("/about#certs") },
];

export type MobileNavItem =
  | { type: "link"; label: string; href: string }
  | { type: "about"; label: string };

export const mobileNavItems: MobileNavItem[] = [
  { type: "link", label: "Калькулятор распила", href: sitePath("/calculate") },
  { type: "link", label: "Проекты", href: sitePath("/projects") },
  { type: "link", label: "Поставщикам", href: sitePath("/suppliers") },
  { type: "link", label: "Новости", href: sitePath("/news") },
  { type: "about", label: "О компании" },
  { type: "link", label: "Контакты", href: sitePath("/contacts") },
  { type: "link", label: "Отзывы", href: sitePath("/reviews") },
];

export const desktopNavLinks: { label: string; href: string }[] = [
  { label: "Калькулятор распила", href: sitePath("/calculate") },
  { label: "Проекты", href: sitePath("/projects") },
  { label: "Поставщикам", href: sitePath("/suppliers") },
  { label: "Новости", href: sitePath("/news") },
  { label: "Контакты", href: sitePath("/contacts") },
  { label: "Отзывы", href: sitePath("/reviews") },
];
