# Заглушка и режим превью

Сайт управляется одной переменной **`SITE_MAINTENANCE`**. Пересборка не нужна — достаточно перезапустить контейнер или PM2.

## Включить заглушку (режим по умолчанию)

```env
SITE_MAINTENANCE=true
NEXT_PUBLIC_SITE_MAINTENANCE=true
```

| URL | Результат |
|-----|-----------|
| `/` | «Проводятся технические работы» |
| `/unlock` | Полный сайт (превью) |
| `/catalog` и др. | Редирект на `/` |

**Docker:**

```bash
# в .env или docker-compose
SITE_MAINTENANCE=true

docker compose down && docker compose up -d
```

**PM2:**

```bash
SITE_MAINTENANCE=true NEXT_PUBLIC_SITE_MAINTENANCE=true npm run deploy
```

---

## Выключить заглушку (публичный запуск)

```env
SITE_MAINTENANCE=false
NEXT_PUBLIC_SITE_MAINTENANCE=false
```

| URL | Результат |
|-----|-----------|
| `/` | Главная страница |
| `/catalog`, `/about` и т.д. | Обычные страницы |
| `/unlock/...` | Редирект на URL без префикса |

**Docker:**

```bash
SITE_MAINTENANCE=false docker compose down && docker compose up -d
```

**PM2:**

```bash
SITE_MAINTENANCE=false NEXT_PUBLIC_SITE_MAINTENANCE=false npm run deploy
```

> Для Docker `NEXT_PUBLIC_SITE_MAINTENANCE` подставляется из `SITE_MAINTENANCE` автоматически (см. `docker-compose.yml`).

---

## Пароль на превью `/unlock`

Работает **только при `SITE_MAINTENANCE=true`**.

Задать все три переменные:

```env
UNLOCK_GATE_USERNAME=логин
UNLOCK_GATE_PASSWORD=пароль
UNLOCK_GATE_SECRET=случайная_строка_32_символа
```

Отключить пароль — очистить все три переменные и перезапустить.

---

## Локальная разработка

Скопировать `.env.example` в `.env.local` и менять `SITE_MAINTENANCE`:

```bash
cp .env.example .env.local
npm run dev
```

- `true` → [http://localhost:3000](http://localhost:3000) заглушка, [http://localhost:3000/unlock](http://localhost:3000/unlock) сайт
- `false` → [http://localhost:3000](http://localhost:3000) сайт

После смены `NEXT_PUBLIC_SITE_MAINTENANCE` в dev перезапустите `npm run dev`.

---

## Как это работает в коде

- `middleware.ts` — редиректы и rewrite в зависимости от `SITE_MAINTENANCE`
- `app/page.tsx` — страница заглушки (показывается только при `SITE_MAINTENANCE=true`)
- `app/unlock/` — файлы страниц сайта (внутренний префикс всегда `/unlock`)
- `app/shared/lib/maintenanceMode.ts` — чтение флага
- `app/shared/lib/sitePath.ts` — ссылки с `/unlock` или без него
