import type { RussiaMapRegion } from "./InteractiveRussiaMap";

export const companyOfficeRegions: RussiaMapRegion[] = [
  { id: "RU-SPE", label: "Санкт-Петербург", coordinates: [30.3141, 59.9386], linkedRegionIds: ["RU-LEN"] },
  { id: "RU-MOW", label: "Москва", coordinates: [37.6176, 55.7558], linkedRegionIds: ["RU-MOS"] },
  { id: "RU-NIZ", label: "Нижний Новгород", coordinates: [44.0059, 56.3269] },
  { id: "RU-VOR", label: "Воронеж", coordinates: [39.2006, 51.6755] },
  { id: "RU-ROS", label: "Ростов-на-Дону", coordinates: [39.7125, 47.2357] },
  { id: "RU-KDA", label: "Краснодар", coordinates: [38.9769, 45.0355] },
  { id: "RU-SAM", label: "Самара", coordinates: [50.1606, 53.1959] },
  { id: "RU-SVE", label: "Екатеринбург", coordinates: [60.6122, 56.8389] },
  { id: "RU-NVS", label: "Новосибирск", coordinates: [82.9346, 54.9884] },
  { id: "RU-CHE", label: "Челябинск", coordinates: [61.4291, 55.1644] },
];

export const companyMapRegions = companyOfficeRegions;
export const companyAboutMapRegions = companyOfficeRegions;

export const regionIdToContactSlug: Record<string, string> = {
  "RU-SPE": "sankt-peterburg",
  "RU-MOW": "moskva",
  "RU-NIZ": "nizhniy-novgorod",
  "RU-VOR": "voronezh",
  "RU-ROS": "rostov-na-donu",
  "RU-KDA": "krasnodar",
  "RU-SAM": "samara",
  "RU-SVE": "ekaterinburg",
  "RU-NVS": "novosibirsk",
  "RU-CHE": "chelyabinsk",
};

const cityAliases: Record<string, string[]> = {
  "RU-SPE": ["санкт-петербург", "петербург", "санкт-петербурге"],
  "RU-MOW": ["москва", "москве", "москов"],
  "RU-NIZ": ["нижний новгород", "нижнем новгороде"],
  "RU-VOR": ["воронеж", "воронеже"],
  "RU-ROS": ["ростов-на-дону", "ростове-на-дону"],
  "RU-KDA": ["краснодар", "краснодаре"],
  "RU-SAM": ["самара", "самаре"],
  "RU-SVE": ["екатеринбург", "екатеринбурге"],
  "RU-NVS": ["новосибирск", "новосибирске"],
  "RU-CHE": ["челябинск", "челябинске"],
};

export function findCompanyRegionByCity(city: string) {
  const normalizedCity = city.toLowerCase().trim();
  return companyOfficeRegions.find((region) =>
    (cityAliases[region.id] ?? [region.label.toLowerCase()]).some((alias) =>
      normalizedCity.includes(alias),
    ),
  );
}
