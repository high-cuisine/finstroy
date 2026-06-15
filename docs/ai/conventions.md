# Conventions — Финстрой Frontend

## Структура типичного файла компонента

Каждый компонент — это папка `ComponentName/` с двумя файлами:

```
ComponentName/
├── ComponentName.tsx          ← логика + разметка
└── ComponentName.module.scss  ← стили
```

### Шаблон Server Component (секции, футер)

```tsx
// app/pages/(main)/components/HeroSection/HeroSection.tsx

import Image from "next/image";
import styles from "./HeroSection.module.scss";

// Статические данные — прямо в файле, над компонентом
const stats = [
  { value: "31", label: "год на рынке" },
  { value: "1000 +", label: "наименований\nассортимента" },
];

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.left}>
        <h1 className={styles.title}>...</h1>
        <div className={styles.stats}>
          {stats.map((s) => (
            <div key={s.value} className={styles.statItem}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Шаблон Client Component (с состоянием)

```tsx
// app/pages/account/page.tsx

"use client";

import { useState } from "react";
import Header from "@/app/shared/componets/layout/Header/Header";
import Footer from "@/app/shared/componets/layout/Footer/Footer";
import styles from "./account.module.scss";

// Типы — до компонента
type Tab = "profile" | "cart";

// Интерфейсы — до компонента
interface CartItem {
  id: number;
  name: string;
  qty: number;
}

// Статические данные — до компонента
const initialItems: CartItem[] = [...];

export default function AccountPage() {
  const [tab, setTab] = useState<Tab>("profile");

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        {/* content */}
      </main>
      <Footer />
    </div>
  );
}
```

---

## Структура SCSS-модуля

```scss
// ── Page shell ────────────────────────────────────────────────────────────────

.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg-page);      // ← всегда CSS-переменные, не хардкод
  transition: background 0.2s;     // ← transition на все theme-зависимые свойства
}

// ── Секция ────────────────────────────────────────────────────────────────────

.card {
  background: var(--bg-surface);
  border-radius: 12px;
  padding: 24px 32px 48px;
}

// ── Responsive ────────────────────────────────────────────────────────────────

// Комментарий с описанием брейкпоинта
@media (max-width: 768px) {
  .card {
    padding: 16px 16px 32px;
  }
}
```

**Правила для SCSS:**
- Разделы отделяются комментарием `// ── Название ───────...`
- Адаптивные стили — в конце файла под заголовком `// ── Responsive`
- `transition: ... 0.2s` на все свойства, зависящие от темы (`background`, `color`, `border-color`)
- Нет вложенности глубже 2 уровней (только `&:hover`, `&:focus`)

---

## Система тем — как использовать

### В SCSS

```scss
// ✅ Правильно — CSS-переменные
.element {
  background: var(--bg-surface);
  color: var(--color-black);
  border: 1px solid var(--border-color);
  transition: background 0.2s, color 0.2s;
}

// ❌ Неправильно — хардкод
.element {
  background: #242429;
  color: #ffffff;
}
```

### В TSX (для условной стилизации по теме)

```tsx
"use client";
import { useTheme } from "@/app/shared/context/ThemeContext";

export default function MyComponent() {
  const { theme } = useTheme();
  return (
    <div className={`${styles.wrap} ${theme === "dark" ? styles.dark : ""}`}>
      ...
    </div>
  );
}
```

### Добавление новой CSS-переменной

В `app/globals.css` добавить в оба блока:

```css
:root {
  --my-new-var: #светлое_значение;
}

[data-theme="dark"] {
  --my-new-var: #тёмное_значение;
}
```

---

## Компонент Button — использование

```tsx
import Button from "@/app/shared/componets/ui/Button";

// Варианты (variant): "green" | "grey" | "black"
// Размеры (size):     "L" | "M"

<Button variant="green" size="L">Сохранить</Button>
<Button variant="grey"  size="M">Отмена</Button>

// Полная ширина — через className из модуля родителя
<Button variant="green" size="L" className={styles.btnFull}>
  Перейти к оформлению
</Button>
```

```scss
// в родительском .module.scss
.btnFull { width: 100%; }
```

---

## Паттерн новой страницы (пошагово)

### 1. Создать папку и файлы

```
app/pages/my-page/
├── page.tsx
└── my-page.module.scss
```

### 2. Скопировать шаблон страницы

```tsx
// app/pages/my-page/page.tsx

import Header from "@/app/shared/componets/layout/Header/Header";
import Footer from "@/app/shared/componets/layout/Footer/Footer";
import styles from "./my-page.module.scss";

export default function MyPage() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        {/* контент */}
      </main>
      <Footer />
    </div>
  );
}
```

### 3. Базовые стили страницы

```scss
// app/pages/my-page/my-page.module.scss

.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg-page);
  transition: background 0.2s;
}

.main {
  flex: 1;
  // padding, max-width и т.д.
}
```

### 4. Добавить ссылку в Header

В `Header.tsx` добавить в массив `navLinks`:

```tsx
{ label: "Моя страница", href: "/pages/my-page" },
```

> ⚠️ Использовать полный путь `/pages/my-page`, а не `/my-page`

### 5. Если нужны данные — создать `data.ts`

```ts
// app/pages/my-page/data.ts

export interface MyItem {
  id: number;
  title: string;
}

export const myItems: MyItem[] = [
  { id: 1, title: "Элемент 1" },
];
```

---

## Паттерн динамического маршрута (пример: новости)

```
app/pages/news/
├── data.ts          ← данные + типы
├── page.tsx         ← список
├── news.module.scss
└── [id]/
    ├── page.tsx     ← детальная страница
    └── article.module.scss
```

```tsx
// app/pages/news/[id]/page.tsx
"use client";

import { useParams, notFound } from "next/navigation";
import { newsItems } from "../data";

export default function ArticlePage() {
  const params = useParams();
  const id = Number(params.id);
  const article = newsItems.find((n) => n.id === id);

  if (!article) return notFound();

  return <div>{article.title}</div>;
}
```

---

## Паттерн многотабовой страницы (пример: аккаунт)

```tsx
"use client";
import { useState } from "react";

type Tab = "profile" | "cart" | "orders" | "payment";

const navItems: { label: string; tab: Tab }[] = [
  { label: "Профиль", tab: "profile" },
  { label: "Корзина", tab: "cart" },
];

export default function AccountPage() {
  const [tab, setTab] = useState<Tab>("profile");

  return (
    <div>
      <aside>
        {navItems.map((item) => (
          <button
            key={item.tab}
            className={tab === item.tab ? styles.active : ""}
            onClick={() => setTab(item.tab)}
          >
            {item.label}
          </button>
        ))}
      </aside>

      <div>
        {tab === "profile" && <ProfileSection />}
        {tab === "cart"    && <CartSection />}
      </div>
    </div>
  );
}
```

---

## Импорты — порядок и пути

```tsx
// 1. React / Next.js
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 2. Shared компоненты
import Header from "@/app/shared/componets/layout/Header/Header";
import Footer from "@/app/shared/componets/layout/Footer/Footer";
import Button from "@/app/shared/componets/ui/Button";

// 3. Контексты / хуки
import { useTheme } from "@/app/shared/context/ThemeContext";

// 4. Локальные данные / типы
import { newsItems } from "./data";

// 5. Стили — последними
import styles from "./page.module.scss";
```

**Алиас:** `@/*` → корень проекта (настроен в `tsconfig.json`). Всегда использовать `@/app/...` для абсолютных импортов.

---

## SVG-иконки

```tsx
// Вариант 1 — из /public/icons/ через next/image
<Image src="/icons/cart-icon.svg" alt="Корзина" width={20} height={20} />

// Вариант 2 — inline SVG для иконок с динамическим цветом
function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16" height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
```

Используй `currentColor` для иконок, чтобы они наследовали цвет родителя и реагировали на тему.

---

## Адаптивность — брейкпоинты

| Брейкпоинт | Ширина | Назначение |
|---|---|---|
| Tablet wide | ≤ 1280px | Уменьшить боковые отступы/сайдбар |
| Tablet | ≤ 1100px | Перестроить колонки, убрать второстепенные блоки |
| Mobile wide | ≤ 768px | Скрыть сайдбар, полная ширина для контента |
| Mobile | ≤ 480px | Вертикальная укладка всех рядов |
| Header mobile | ≤ 1023px | Бургер-меню, скрыть навигацию |

Пример:

```scss
// ── Responsive ────────────────────────────────────────────────────────────────

@media (max-width: 1280px) {
  .sidebar { width: 220px; }
}

@media (max-width: 768px) {
  .layout { flex-direction: column; }
  .sidebar { display: none; }
  .content { padding: 24px 16px; }
}

@media (max-width: 480px) {
  .formRow { flex-direction: column; }
}
```
