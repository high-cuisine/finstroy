export type WpContactCoords = [number, number]; // [lat, lng]

export type WpContactAcf = {
  phone: string;
  email: string;
  officeAddress: string;
  warehouseAddress: string;
  workSchedule: string;
  unitCity: string;
};

export type WpContactItem = {
  id: number;
  slug: string;
  title: string;
  contentHtml: string;
  link: string;
  officeCoords?: WpContactCoords;
  warehouseCoords?: WpContactCoords;
  acf: WpContactAcf;
};

export type WpContactRest = {
  id: number;
  slug: string;
  title?: { rendered?: string };
  content?: { rendered?: string };
  link?: string;
  acf?: {
    "unit-city"?: string;
    unit_phone_number?: string;
    office_address?: string;
    sklad_address?: string;
    work_schedule?: string;
    unit_email?: string;
    office_location?: string;
    warehouse_location?: string;
  };
};

function decodeEntities(input: string): string {
  return input
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)));
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function parseCoords(raw: string | undefined): WpContactCoords | undefined {
  if (!raw?.trim() || raw.trim() === "-") return undefined;
  const parts = raw.split(",").map((s) => parseFloat(s.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return [parts[0], parts[1]];
  }
  return undefined;
}

function stripPrefix(value: string, ...prefixes: string[]): string {
  let v = value.trim();
  for (const p of prefixes) {
    const re = new RegExp(
      `^${p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*:?\\s*`,
      "i",
    );
    v = v.replace(re, "").trim();
  }
  return v;
}

/** Пустые / label-only значения ACF (без реального адреса). */
function isPlaceholderValue(value: string): boolean {
  const v = value.trim().toLowerCase().replace(/\s+/g, " ");
  if (!v) return true;
  return /^(адрес\s+склада|адрес\s+офиса|склад|офис|телефон|e-?mail|email|график\s+работы)$/i.test(
    v,
  );
}

/**
 * В office_address часто «Офис: … Склад: …» одной строкой.
 * Режем на офис / склад. Не путать с префиксом «Офис и склад:».
 */
function splitOfficeAndWarehouse(raw: string): {
  office: string;
  warehouse: string;
} {
  const cleaned = raw.trim();
  if (!cleaned) return { office: "", warehouse: "" };

  // Отдельный маркер склада (не «офис и склад»)
  const warehouseMatch = cleaned.match(
    /(?:^|[\s;,.])\s*склад\s*:?\s*(.+)$/i,
  );
  if (warehouseMatch && warehouseMatch.index != null && warehouseMatch.index > 0) {
    const before = cleaned.slice(0, warehouseMatch.index).trim();
    // «Офис и» + «склад: …» — это один общий адрес, не два
    if (!/офис\s+и\s*$/i.test(before)) {
      const warehouse = warehouseMatch[1].trim();
      const office = stripPrefix(before, "Офис и склад", "Офис", "Склад");
      return {
        office: isPlaceholderValue(office) ? "" : office,
        warehouse: isPlaceholderValue(warehouse) ? "" : warehouse,
      };
    }
  }

  // «Офис и склад: …» — один общий адрес на оба блока
  const combined = /^\s*офис\s+и\s+склад\s*:?\s*/i.test(cleaned);
  const office = stripPrefix(cleaned, "Офис и склад", "Офис", "Склад");
  const officeClean = isPlaceholderValue(office) ? "" : office;
  return {
    office: officeClean,
    warehouse: combined ? officeClean : "",
  };
}

function parseAcf(acf: WpContactRest["acf"]): WpContactAcf {
  const phoneRaw = acf?.unit_phone_number
    ? stripPrefix(acf.unit_phone_number, "Телефон")
    : "";
  const emailRaw = acf?.unit_email
    ? stripPrefix(acf.unit_email, "E-mail", "Email")
    : "";
  const scheduleRaw = acf?.work_schedule
    ? stripPrefix(acf.work_schedule, "График работы")
    : "";

  const { office, warehouse: warehouseFromOffice } = splitOfficeAndWarehouse(
    acf?.office_address ?? "",
  );

  const warehouseFromAcf = acf?.sklad_address
    ? stripPrefix(acf.sklad_address, "Адрес склада", "Склад")
    : "";
  const warehouseAddress =
    (!isPlaceholderValue(warehouseFromAcf) ? warehouseFromAcf : "") ||
    warehouseFromOffice;

  // Телефон иногда зашит в office_address (Краснодар и т.п.)
  let phone = !isPlaceholderValue(phoneRaw) ? phoneRaw : "";
  if (!phone && acf?.office_address) {
    const fromAddr = extractContactFields(acf.office_address).phones[0];
    if (fromAddr) phone = fromAddr;
  }

  return {
    phone,
    email: !isPlaceholderValue(emailRaw) ? emailRaw : "",
    officeAddress: office,
    warehouseAddress,
    workSchedule: !isPlaceholderValue(scheduleRaw) ? scheduleRaw : "",
    unitCity: (acf?.["unit-city"] ?? "").trim(),
  };
}

export function normalizeContactPost(row: WpContactRest): WpContactItem {
  const rawTitle = row.title?.rendered ?? row.slug;
  return {
    id: row.id,
    slug: row.slug,
    title: decodeEntities(stripHtml(rawTitle)) || row.slug,
    contentHtml: row.content?.rendered ?? "",
    link: row.link ?? "",
    officeCoords: parseCoords(row.acf?.office_location),
    warehouseCoords: parseCoords(row.acf?.warehouse_location),
    acf: parseAcf(row.acf),
  };
}

/** Телефоны и email из HTML контента (для карточки «Контакты»). */
export function extractContactFields(html: string): {
  phones: string[];
  emails: string[];
  plainPreview: string;
} {
  const plain = stripHtml(decodeEntities(html));
  const phoneRe =
    /(?:\+?7|8)[\s\-]?(?:\(?\d{3}\)?)[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}|8\s*\(?800\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}/g;
  const emailRe = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  const phones = [...new Set(plain.match(phoneRe) ?? [])];
  const emails = [...new Set(plain.match(emailRe) ?? [])];
  const plainPreview = plain.length > 280 ? `${plain.slice(0, 280)}…` : plain;
  return { phones, emails, plainPreview };
}

export type ParsedContactLayout = {
  phones: string[];
  emails: string[];
  hoursLine: string | null;
  officeAddress: string | null;
  warehouseAddress: string | null;
};

export function parseContactLayout(html: string): ParsedContactLayout {
  const { phones, emails } = extractContactFields(html);
  const plain = stripHtml(decodeEntities(html));

  let hoursLine: string | null = null;
  const hi = plain.search(/график работы/i);
  if (hi >= 0) {
    hoursLine = plain.slice(hi).replace(/^\s*график работы:?\s*/i, "").trim();
  }

  let officePlain = plain;
  let warehouseAddress: string | null = null;
  const si = plain.toLowerCase().indexOf("склад");
  if (si >= 0) {
    warehouseAddress = plain
      .slice(si)
      .replace(/^\s*склад\s*:?\s*/i, "")
      .trim();
    officePlain = plain.slice(0, si).trim();
  }

  let officeAddress: string | null = null;
  const oi = officePlain.toLowerCase().indexOf("офис");
  if (oi >= 0) {
    let chunk = officePlain.slice(oi).replace(/^\s*офис\s*:?\s*/i, "");
    const gi = chunk.search(/график работы/i);
    if (gi >= 0) chunk = chunk.slice(0, gi).trim();
    officeAddress = chunk.trim() || null;
  }

  if (!officeAddress && officePlain.length > 8) {
    officeAddress = officePlain;
  }

  return { phones, emails, hoursLine, officeAddress, warehouseAddress };
}

export type OfficeCardField = {
  label: string;
  value: string;
  href?: string;
};

export type OfficeCardViewModel = {
  slug: string;
  cityTitle: string;
  cityHeading: string;
  companyName: string;
  fields: OfficeCardField[];
};

const DEFAULT_COMPANY_NAME = "АО «ФИН-Стройматериалы»";
const DEFAULT_PHONE = "8 (800) 550-02-20";
const DEFAULT_EMAIL = "info@finstroy.ru";
const DEFAULT_HOURS = "Пн – Пт с 8:00 до 18:00";
const FALLBACK_OFFICE =
  "Адрес офиса уточняйте у менеджеров.";
const FALLBACK_WAREHOUSE =
  "Уточняйте адрес склада в карточке города или у менеджеров.";

function phoneToTelHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return `tel:${phone}`;
  let normalized = digits;
  if (normalized.startsWith("8")) normalized = `7${normalized.slice(1)}`;
  if (!normalized.startsWith("7")) normalized = `7${normalized}`;
  return `tel:+${normalized}`;
}

/** Юр. название из ACF unit-city; если там просто город — дефолт. */
export function resolveCompanyName(contact: WpContactItem): string {
  const unit = contact.acf.unitCity.trim();
  if (!unit) return DEFAULT_COMPANY_NAME;
  if (unit.toLowerCase() === contact.title.toLowerCase()) {
    return DEFAULT_COMPANY_NAME;
  }
  return unit;
}

export function buildOfficeCardViewModel(
  contact: WpContactItem,
  companyName?: string,
): OfficeCardViewModel {
  const parsed = parseContactLayout(contact.contentHtml);
  const phone = contact.acf.phone || parsed.phones[0] || DEFAULT_PHONE;
  const email = contact.acf.email || parsed.emails[0] || DEFAULT_EMAIL;
  const hours =
    contact.acf.workSchedule ||
    parsed.hoursLine?.trim() ||
    DEFAULT_HOURS;
  const officeAddress =
    contact.acf.officeAddress ||
    parsed.officeAddress?.trim() ||
    FALLBACK_OFFICE;
  const warehouseAddress =
    contact.acf.warehouseAddress ||
    parsed.warehouseAddress?.trim() ||
    "";

  const fields: OfficeCardField[] = [
    { label: "Офис", value: officeAddress },
  ];

  if (warehouseAddress) {
    fields.push({ label: "Склад", value: warehouseAddress });
  }

  fields.push(
    { label: "Телефон", value: phone, href: phoneToTelHref(phone) },
    { label: "График работы", value: hours },
    { label: "Email", value: email, href: `mailto:${email}` },
  );

  return {
    slug: contact.slug,
    cityTitle: contact.title,
    cityHeading: cityHeadingLine(contact.slug, contact.title),
    companyName: companyName ?? resolveCompanyName(contact),
    fields,
  };
}

/** Подзаголовок «в Москве» / «в Санкт-Петербурге» по slug города. */
export function cityHeadingLine(slug: string, title: string): string {
  const map: Record<string, string> = {
    moskva: "в Москве",
    "sankt-peterburg": "в Санкт-Петербурге",
    "nizhniy-novgorod": "в Нижнем Новгороде",
    krasnodar: "в Краснодаре",
    "rostov-na-donu": "в Ростове-на-Дону",
    novosibirsk: "в Новосибирске",
    samara: "в Самаре",
    ekaterinburg: "в Екатеринбурге",
    voronezh: "в Воронеже",
    chelyabinsk: "в Челябинске",
  };
  return map[slug] ?? title;
}

export {
  DEFAULT_COMPANY_NAME,
  DEFAULT_PHONE,
  DEFAULT_EMAIL,
  DEFAULT_HOURS,
  FALLBACK_OFFICE,
  FALLBACK_WAREHOUSE,
};
