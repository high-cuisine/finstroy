FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json .npmrc ./
# Кэш npm между сборками (нужен BuildKit)
RUN --mount=type=cache,target=/root/.npm npm ci

FROM base AS builder
ARG WP_PAGES_UPSTREAM=https://wp.finstroi.com
ARG CUBIC_CALCULATOR_UPSTREAM=https://wp.finstroi.com/wp-json/cubic-calculator/v1
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Ограничение RAM при сборке (подстройте под VPS: 512 / 768 / 1024)
ENV NODE_OPTIONS="--max-old-space-size=768"
# Upstream нужен на этапе build (prerender /news, /projects и т.д.)
ENV WP_PAGES_UPSTREAM=${WP_PAGES_UPSTREAM}
ENV CUBIC_CALCULATOR_UPSTREAM=${CUBIC_CALCULATOR_UPSTREAM}
ENV NEXT_PUBLIC_WP_PAGES_UPSTREAM=${WP_PAGES_UPSTREAM}
ENV NEXT_PUBLIC_CUBIC_CALCULATOR_BASE=${CUBIC_CALCULATOR_UPSTREAM}
# Плейсхолдеры подставляются при старте контейнера (entrypoint.sh)
ENV NEXT_PUBLIC_YANDEX_MAPS_API_KEY=__NEXT_PUBLIC_YANDEX_MAPS_API_KEY__
ENV NEXT_PUBLIC_WC_PRODUCT_PAGE_ID=__NEXT_PUBLIC_WC_PRODUCT_PAGE_ID__

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN <<'EOF' cat > /app/replace-runtime-env.mjs
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const RUNTIME_PUBLIC_ENV = [
  "NEXT_PUBLIC_YANDEX_MAPS_API_KEY",
  "NEXT_PUBLIC_WC_PRODUCT_PAGE_ID",
  "NEXT_PUBLIC_WP_PAGES_UPSTREAM",
  "NEXT_PUBLIC_CUBIC_CALCULATOR_BASE",
];

function collectFiles(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      collectFiles(path, acc);
      continue;
    }
    if (/\.(js|json|html)$/.test(name)) {
      acc.push(path);
    }
  }
  return acc;
}

const files = [];
if (statSync(join(ROOT, ".next")).isDirectory()) {
  collectFiles(join(ROOT, ".next"), files);
}

const serverJs = join(ROOT, "server.js");
if (statSync(serverJs).isFile()) {
  files.push(serverJs);
}

for (const name of RUNTIME_PUBLIC_ENV) {
  const placeholder = `__${name}__`;
  const raw = process.env[name];
  const value = !raw || raw === placeholder ? "" : raw;

  for (const file of files) {
    const content = readFileSync(file, "utf8");
    if (!content.includes(placeholder)) continue;
    writeFileSync(file, content.split(placeholder).join(value), "utf8");
  }

  if (value) {
    console.log(`[entrypoint] ${name} applied`);
  } else {
    console.warn(`[entrypoint] ${name} is empty — set it in container env and restart`);
  }
}
EOF

RUN <<'EOF' cat > /app/entrypoint.sh
#!/bin/sh
set -e
node /app/replace-runtime-env.mjs
exec "$@"
EOF

RUN chmod +x /app/entrypoint.sh \
    && chown nextjs:nodejs /app/replace-runtime-env.mjs /app/entrypoint.sh

USER nextjs
EXPOSE 3000
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "server.js"]
