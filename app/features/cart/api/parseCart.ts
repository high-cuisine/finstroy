import type {
  NormalizedCartLine,
  WcStoreCartJson,
  WcStoreCartLineJson,
} from "./types";

function minorDivisor(minor: number): number {
  const m = Number.isFinite(minor) && minor >= 0 ? minor : 2;
  return 10 ** m;
}

function parseMinorAmount(raw: string | undefined, minorUnit: number): number {
  if (raw === undefined || raw === "") return 0;
  const s = String(raw).trim();
  if (s.includes(".") || s.includes(",")) {
    const n = parseFloat(s.replace(",", "."));
    return Number.isNaN(n) ? 0 : n;
  }
  const n = parseInt(s.replace(/\D/g, ""), 10);
  if (Number.isNaN(n)) return 0;
  return n / minorDivisor(minorUnit);
}

function pickImage(line: WcStoreCartLineJson): string | null {
  const imgs = line.images;
  if (Array.isArray(imgs) && imgs.length > 0) {
    const first = imgs[0];
    if (first && typeof first === "object") {
      const src = first.src ?? first.thumbnail ?? first.url;
      if (typeof src === "string" && src.length > 0) return src;
    }
  }

  const single = line.image;
  if (single && typeof single === "object") {
    const src =
      (single as { src?: string; thumbnail?: string; url?: string }).src ??
      (single as { src?: string; thumbnail?: string; url?: string }).thumbnail ??
      (single as { src?: string; thumbnail?: string; url?: string }).url;
    if (typeof src === "string" && src.length > 0) return src;
  }

  return null;
}

function normalizeLine(line: WcStoreCartLineJson, index: number): NormalizedCartLine | null {
  const key =
    typeof line.key === "string" && line.key.length > 0 ? line.key : `line-${index}`;
  const productId =
    typeof line.id === "number"
      ? line.id
      : typeof line.id === "string"
        ? parseInt(line.id, 10)
        : 0;
  const name = typeof line.name === "string" ? line.name : "Товар";
  const quantity =
    typeof line.quantity === "number"
      ? Math.max(0, line.quantity)
      : Math.max(0, parseInt(String(line.quantity ?? 1), 10) || 1);

  const minor = line.prices?.currency_minor_unit ?? 2;
  const unitPrice = parseMinorAmount(line.prices?.price, minor);
  const regularRaw = line.prices?.regular_price;
  const regularPrice =
    regularRaw !== undefined && regularRaw !== "" && regularRaw !== line.prices?.price
      ? parseMinorAmount(regularRaw, minor)
      : null;

  const lineTotalRaw = line.totals?.line_total ?? line.totals?.line_subtotal;
  const lineTotal =
    lineTotalRaw !== undefined
      ? parseMinorAmount(String(lineTotalRaw), minor)
      : unitPrice * quantity;

  return {
    key,
    productId,
    name,
    quantity,
    unitPrice,
    lineTotal,
    regularPrice,
    imageUrl: pickImage(line),
  };
}

export function normalizeStoreCart(json: unknown): {
  lines: NormalizedCartLine[];
  currencySymbol: string;
} {
  if (!json || typeof json !== "object") {
    return { lines: [], currencySymbol: "₽" };
  }

  const cart = json as WcStoreCartJson;
  const rawItems = Array.isArray(cart.items) ? cart.items : [];
  const lines: NormalizedCartLine[] = [];

  rawItems.forEach((item, idx) => {
    const line = normalizeLine(item as WcStoreCartLineJson, idx);
    if (line) lines.push(line);
  });

  const currencySymbol =
    (typeof cart.currency_symbol === "string" && cart.currency_symbol) ||
    (typeof cart.totals?.currency_symbol === "string" && cart.totals.currency_symbol) ||
    "₽";

  return { lines, currencySymbol };
}
