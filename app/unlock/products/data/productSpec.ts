// ── Types ──────────────────────────────────────────────────────────────────────

export interface Format {
  label: string;
  area: number;
}

export interface Thickness {
  label: string;
  mm: number;
  density: number;
}

export interface TableRow {
  t: string;
  l: string;
  so: string;
  sr: string;
  no_: string;
  nr: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────

export const FORMATS: Format[] = [
  { label: "1525×1525 мм", area: 1.525 * 1.525 },
  { label: "2440×1220 мм", area: 2.44 * 1.22 },
  { label: "2500×1250 мм", area: 2.5 * 1.25 },
  { label: "3000×1500 мм", area: 3.0 * 1.5 },
];

export const THICKNESSES: Thickness[] = [
  { label: "3 мм",    mm: 3,    density: 760 },
  { label: "4 мм",    mm: 4,    density: 750 },
  { label: "6,5 мм",  mm: 6.5,  density: 730 },
  { label: "9 мм",    mm: 9,    density: 720 },
  { label: "12 мм",   mm: 12,   density: 710 },
  { label: "15 мм",   mm: 15,   density: 700 },
  { label: "18 мм",   mm: 18,   density: 690 },
  { label: "21 мм",   mm: 21,   density: 680 },
  { label: "24 мм",   mm: 24,   density: 670 },
  { label: "27 мм",   mm: 27,   density: 660 },
  { label: "30 мм",   mm: 30,   density: 650 },
];

export const DEFAULT_PRICE_PER_SHEET = 2876;

export const TABLE_ROWS: TableRow[] = [
  { t: "3",    l: "3",  so: "+0,3 -0,4", sr: "0,6", no_: "+0,3 -0,4", nr: "0,6" },
  { t: "4",    l: "3",  so: "+0,3 -0,5", sr: "0,6", no_: "+0,3 -0,5", nr: "1,0" },
  { t: "6,5",  l: "5",  so: "+0,4 -0,5", sr: "0,6", no_: "+0,4 -0,5", nr: "1,0" },
  { t: "9",    l: "7",  so: "+0,4 -0,6", sr: "0,6", no_: "+0,4 -0,6", nr: "0,6" },
  { t: "12",   l: "9",  so: "+0,4 -0,6", sr: "0,6", no_: "+0,4 -0,6", nr: "1,0" },
  { t: "15",   l: "11", so: "+0,4 -0,7", sr: "0,8", no_: "+0,4 -0,7", nr: "1,5" },
  { t: "18",   l: "13", so: "+0,5 -0,7", sr: "0,8", no_: "+0,5 -0,7", nr: "1,5" },
  { t: "21",   l: "15", so: "+0,5 -0,7", sr: "1,0", no_: "+0,5 -0,7", nr: "2,0" },
  { t: "24",   l: "17", so: "+0,4 -0,6", sr: "1,0", no_: "+0,4 -0,6", nr: "2,0" },
  { t: "27",   l: "19", so: "+0,4 -0,6", sr: "1,0", no_: "+0,4 -0,6", nr: "2,0" },
  { t: "30",   l: "21", so: "+0,3 -0,5", sr: "1,0", no_: "+0,4 -0,6", nr: "2,0" },
];
