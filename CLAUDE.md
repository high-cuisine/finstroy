# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run start    # start production server
npm run lint     # ESLint

# Docker (production, port 3338)
docker compose up --build
```

There is no test runner configured.

## Architecture

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript 5 · SCSS Modules · Tailwind CSS v4 · Zustand 5

### Routing

Route groups `(pages)` and `(main)` don't create URL segments:

| URL | File |
|---|---|
| `/` | `app/(pages)/(main)/page.tsx` |
| `/products` | `app/(pages)/products/page.tsx` |
| `/news` | `app/(pages)/news/page.tsx` |
| `/news/[id]` | `app/(pages)/news/[id]/page.tsx` |
| `/account` | `app/(pages)/account/page.tsx` |
| `/contacts` | `app/(pages)/contacts/page.tsx` |
| `/api/wp/[...path]` | Proxy → `WP_PAGES_UPSTREAM` env var |
| `/api/cubic-calculator/[...path]` | Proxy → `CUBIC_CALCULATOR_UPSTREAM` env var |

`app/page.tsx` redirects to `(pages)/(main)`. API routes are thin proxies only — no business logic.

### Component structure

Every component is a folder with exactly two files:
```
ComponentName/
├── ComponentName.tsx
└── ComponentName.module.scss
```

Shared components live in `app/shared/componets/` — **note the typo ("componets", missing "n") — this is intentional and must not be corrected.**

Page-specific sections go in `app/(pages)/<route>/components/`.

### Server vs. Client components

Default to **Server Components** (no directive). Add `"use client"` only when the component uses `useState`, `useEffect`, `usePathname`, `useTheme`, or event handlers.

### Theme system

Theming works via a `data-theme` attribute on `<html>`, NOT via Tailwind's `dark:` variant:

- `ThemeContext.tsx` — `ThemeProvider` wraps the app in `layout.tsx`; exposes `useTheme()` → `{ theme, toggle }`
- Persisted to `localStorage`, falls back to `prefers-color-scheme`
- CSS variables defined in `globals.css`:
  ```css
  :root        { --bg-page: #fff; --color-black: #121317; ... }
  [data-theme="dark"] { --bg-page: #111114; ... }
  ```
- All components must use `var(--bg-page)` etc. — never hardcode colours
- Add `transition: background 0.2s, color 0.2s` to all theme-dependent properties

### Styling rules

- **SCSS Modules** for all component styles; **Tailwind** for minimal layout utilities in JSX (`flex`, `flex-col`, `w-full`)
- Tailwind v4 is configured **inline in `globals.css`** via `@theme inline {}` — there is no `tailwind.config.js`
- SCSS sections are separated by `// ── Section name ──────...` comments; responsive rules go at the bottom under `// ── Responsive`
- No nesting deeper than 2 levels (only `&:hover`, `&:focus` allowed)
- Responsive breakpoints:

  | Breakpoint | Width | Use for |
  |---|---|---|
  | Tablet wide | ≤ 1280px | Reduce padding / sidebar |
  | Tablet | ≤ 1100px | Reflow columns |
  | Mobile wide | ≤ 768px | Full-width content |
  | Mobile | ≤ 480px | Stack all rows vertically |
  | Header | ≤ 1023px | Burger menu, hide nav |

### State management

- **Zustand stores** for feature-level UI state in `app/features/`:
  - `useCatalogMenuStore` — catalog overlay open/close, mode, search history
  - `useCatalogSearchStore` — search query
  - `useCatalogCategoriesStore` — selected category
- **React Context** (`ThemeContext`) for application-wide theme only
- Local `useState` for page-level tab switching and form state

### Header

`app/shared/componets/layout/Header/Header.tsx` has two visual states controlled by the `variant` prop:
- `"default"` — standard header with logo, nav links, search bar
- `"catalog"` — compact dark pill (activated on scroll by the parent, or when `isMenuOpen` is true): logo hidden, wide search bar appears in centre, icons adapt

### Button component

```tsx
import Button from "@/app/shared/componets/ui/Button";

<Button variant="green" size="L">Save</Button>   // variant: "green" | "grey" | "black"
<Button variant="grey"  size="M">Cancel</Button>  // size: "L" | "M"
```

Pass `className={styles.btnFull}` to set `width: 100%` from the parent module.

### Import order

```tsx
// 1. React / Next.js
import { useState } from "react";
import Image from "next/image";

// 2. Shared components
import Header from "@/app/shared/componets/layout/Header/Header";

// 3. Contexts / hooks
import { useTheme } from "@/app/shared/context/ThemeContext";

// 4. Local data / types
import { newsItems } from "./data";

// 5. Styles — last
import styles from "./page.module.scss";
```

Path alias `@/*` maps to the project root (`tsconfig.json`). Always use `@/app/...` for non-local imports.

### SVG icons

Icons live in `public/icons/`. Use `next/image` for static icons; use inline SVG with `currentColor` for icons that must respond to theme colour changes.
