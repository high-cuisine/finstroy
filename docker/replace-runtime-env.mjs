import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const RUNTIME_PUBLIC_ENV = [
  "NEXT_PUBLIC_YANDEX_MAPS_API_KEY",
  "NEXT_PUBLIC_WC_PRODUCT_PAGE_ID",
  "NEXT_PUBLIC_WP_PAGES_UPSTREAM",
  "NEXT_PUBLIC_CUBIC_CALCULATOR_BASE",
  "NEXT_PUBLIC_SITE_MAINTENANCE",
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
