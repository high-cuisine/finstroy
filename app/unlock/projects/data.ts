export type ProjectCard = {
  id: string;
  slug: string;
  date: string;
  title: string;
  imageSrc: string;
};

export type ProjectDetail = ProjectCard & {
  description: string;
  content: string[];
  gallery: string[];
};

const placeholderSvg = encodeURIComponent(`
<svg width="1200" height="800" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#15161B"/>
      <stop offset="0.55" stop-color="#0F1014"/>
      <stop offset="1" stop-color="#15161B"/>
    </linearGradient>
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(860 210) rotate(135) scale(520 420)">
      <stop stop-color="#006F3D" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#006F3D" stop-opacity="0"/>
    </radialGradient>
    <filter id="noise" x="0" y="0" width="1200" height="800" filterUnits="userSpaceOnUse">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="
        0 0 0 0 0.5
        0 0 0 0 0.5
        0 0 0 0 0.5
        0 0 0 0.08 0" />
    </filter>
  </defs>
  <rect width="1200" height="800" fill="url(#bg)"/>
  <rect width="1200" height="800" fill="url(#glow)"/>
  <rect width="1200" height="800" filter="url(#noise)" opacity="0.35"/>
  <path d="M120 540C260 420 380 370 520 380C680 392 780 470 920 438C1010 418 1070 360 1120 300" stroke="rgba(255,255,255,0.22)" stroke-width="2"/>
  <path d="M120 570C260 450 380 400 520 410C680 422 780 500 920 468C1010 448 1070 390 1120 330" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
  <text x="120" y="180" fill="rgba(255,255,255,0.55)" font-family="Inter, system-ui, -apple-system" font-size="30" font-weight="600">Проект</text>
</svg>
`).trim();

const placeholderDataUri = `data:image/svg+xml,${placeholderSvg}`;

export const projects: ProjectCard[] = [
  {
    id: "1",
    slug: "stroitelstvo-dvuh-agnks-nn",
    date: "22 мая 2023 года",
    title: "Реализовали проект по строительству двух АГНКС в Нижнем Новгороде",
    imageSrc: placeholderDataUri,
  },
  {
    id: "2",
    slug: "stroitelstvo-dvuh-agnks-nn-2",
    date: "22 мая 2023 года",
    title: "Реализовали проект по строительству двух АГНКС в Нижнем Новгороде",
    imageSrc: placeholderDataUri,
  },
  {
    id: "3",
    slug: "stroitelstvo-dvuh-agnks-nn-3",
    date: "22 мая 2023 года",
    title: "Реализовали проект по строительству двух АГНКС в Нижнем Новгороде",
    imageSrc: placeholderDataUri,
  },
  {
    id: "4",
    slug: "stroitelstvo-dvuh-agnks-nn-4",
    date: "22 мая 2023 года",
    title: "Реализовали проект по строительству двух АГНКС в Нижнем Новгороде",
    imageSrc: placeholderDataUri,
  },
];

export const projectDetails: ProjectDetail[] = projects.map((p) => ({
  ...p,
  description:
    "Краткое описание проекта. Здесь будет 1–2 предложения о задаче, географии, сроках и результате.",
  content: [
    "«ФИНСТРОЙ» выполняет комплекс поставок материалов и сопровождение проекта на всех этапах: от подбора позиций до координации поставок и контроля качества.",
    "В рамках работ обеспечили устойчивую логистику и соблюдение сроков. Подобрали оптимальные решения по ассортименту и обеспечили конкурентные условия.",
    "По итогам проекта заказчик получил своевременную поставку и предсказуемое качество материалов, что позволило выполнить работы без простоев.",
  ],
  gallery: [p.imageSrc, p.imageSrc, p.imageSrc],
}));

export function getProjectBySlug(slug: string) {
  return projectDetails.find((p) => p.slug === slug);
}

