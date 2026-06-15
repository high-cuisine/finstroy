# Architecture — Финстрой Frontend

## Назначение проекта

Клиентский сайт компании **Финстрой** — оптовый поставщик строительных материалов (ДСП, фанера, МДФ, OSB и т.д.). Более 30 лет на рынке. Сайт реализует:

- Каталог товаров с калькулятором объёма/веса
- Страницы новостей с динамическими роутами
- Личный кабинет (профиль, корзина, заказы, оплата)
- Главную страницу с секциями (герой, категории, преимущества, карта, клиенты, FAQ, новости)

---

## Стек

```
Next.js 16.1.6  (App Router)
React 19.2.3
TypeScript 5
Tailwind CSS v4  (PostCSS, без tailwind.config)
SCSS Modules     (sass ^1.98.0)
Docker           (node:20-alpine, multi-stage)
```

---

## Схема модулей и зависимостей

```
app/
│
├── layout.tsx ──────────────────────────────────────────────────────────┐
│   └── ThemeProvider (shared/context/ThemeContext.tsx)                  │
│       └── next/font: Geologica + Inter                                 │
│                                                                        │
├── page.tsx                                                             │
│   └── redirect("/pages") ──────────────────────────────────────────── │─→ /pages
│                                                                        │
├── pages/                                                               │
│   ├── (main)/page.tsx  ← URL: /pages                                  │
│   │   ├── Header ────────────────────────────────────────────────────┤
│   │   ├── HeroSection                                                  │
│   │   ├── CategoriesSection                                            │
│   │   ├── AdvantagesSection                                            │
│   │   ├── MapSection                                                   │
│   │   ├── ClientsSection                                               │
│   │   ├── FaqSection                                                   │
│   │   ├── NewsSection                                                  │
│   │   └── Footer ───────────────────────────────────────────────────┤
│   │                                                                    │
│   ├── products/page.tsx  ← URL: /pages/products                       │
│   │   ├── Header / Footer                                              │
│   │   └── (inline): CalcSection, ProductImages, Sidebar, CharTable    │
│   │                                                                    │
│   ├── news/page.tsx  ← URL: /pages/news                               │
│   │   ├── Header / Footer                                              │
│   │   └── data.ts (NewsItem[], newsItems[])                            │
│   │                                                                    │
│   ├── news/[id]/page.tsx  ← URL: /pages/news/:id                      │
│   │   ├── Header / Footer                                              │
│   │   └── ← данные из ../data.ts                                       │
│   │                                                                    │
│   └── account/page.tsx  ← URL: /pages/account                        │
│       ├── Header / Footer                                              │
│       └── (inline): ProfileTab, CartTab, OrdersTab, PaymentTab        │
│                                                                        │
└── shared/                                                             │
    ├── componets/                                                       │
    │   ├── layout/Header/    ← useTheme, usePathname, next/link        │
    │   ├── layout/Footer/    ← Server Component                        │
    │   └── ui/Button/        ← variant: green|grey|black, size: L|M    │
    ├── context/ThemeContext.tsx  ← React Context + localStorage        │
    └── lib/ (hooks/, helpers/) ← пусто, зарезервировано               │
```

---

## Точки входа и основные потоки данных

### 1. HTTP Request Flow

```
Browser → Next.js App Router
  → app/page.tsx         (Server) → redirect("/pages")
  → app/pages/(main)/page.tsx (Server) → рендер секций
```

### 2. Тема (клиентский поток)

```
layout.tsx
  └─ <ThemeProvider>
       ├─ useEffect: localStorage → document.documentElement[data-theme]
       └─ toggle(): обновляет state + localStorage + data-theme атрибут

Header.tsx (Client)
  └─ useTheme() → { theme, toggle }
  └─ кнопка theme-swap вызывает toggle()

globals.css
  └─ :root { --bg-page: #fff ... }
  └─ [data-theme="dark"] { --bg-page: #111114 ... }
  └─ Все компоненты читают var(--bg-page) → автоматически переключаются
```

### 3. Новости (статические данные)

```
news/data.ts
  export interface NewsItem { id, date, title, body[] }
  export const newsItems: NewsItem[]

news/page.tsx           → mapирует newsItems → карточки + <Link href="/pages/news/{id}">
news/[id]/page.tsx      → useParams().id → newsItems.find() → рендер статьи
                                                             → notFound() если нет
```

### 4. Аккаунт (локальный стейт)

```
account/page.tsx ("use client")
  useState(tab: Tab)          → переключение разделов (profile/cart/orders/payment)
  useState(cartItems)         → реактивная корзина (qty, checked, remove)
  useState(cards)             → сохранённые карты

  Нет API-запросов → всё mock-данные
```

---

## Routing Map

| URL | Файл | Тип |
|---|---|---|
| `/` | `app/(pages)/(main)/page.tsx` | Server |
| `/products` | `app/(pages)/products/page.tsx` | Client |
| `/news` | `app/(pages)/news/page.tsx` | Server |
| `/news/[id]` | `app/(pages)/news/[id]/page.tsx` | Client |
| `/account` | `app/(pages)/account/page.tsx` | Client |
| `/contacts` | `app/(pages)/contacts/page.tsx` | Client |

> `(pages)` и `(main)` — route groups (скобки), они не создают URL-сегменты.

---

## Внешние зависимости и интеграции

| Зависимость | Использование |
|---|---|
| Google Fonts (CDN) | Geologica + Inter через `next/font/google` |
| `fonts.gstatic.com` | Разрешён в `next.config.ts` remotePatterns |
| Docker Hub | `node:20-alpine` базовый образ |

**Нет интеграций с:**
- Backend API
- CMS
- Аналитикой
- Платёжными системами (платёжные методы — заглушка)
- Картами (MapSection — заглушка)

---

## Инфраструктура

```
Dockerfile (multi-stage):
  Stage 1 "deps"    → npm install
  Stage 2 "builder" → npm run build
  Stage 3 "runner"  → только dist + node_modules

docker-compose.yml:
  container: new
  port: 3338 → 3000 (внешний : внутренний)
  restart: unless-stopped
  NODE_ENV: production
```

> Примечание: в `Dockerfile` есть устаревший комментарий «нет lock-файла», но `package-lock.json` присутствует. Рекомендуется добавить `COPY package-lock.json ./` и использовать `npm ci` для воспроизводимых сборок.
