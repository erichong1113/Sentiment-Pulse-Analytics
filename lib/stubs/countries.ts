import type { Country } from "@/types";

export const countries: Country[] = [
  {
    code: "ke",
    name: "Kenya",
    region: "East Africa",
    isi_score: 71,
    gdp_estimate_usd_b: 113.4,
    sectors: ["Tech", "Agriculture", "Finance"],
  },
  {
    code: "ng",
    name: "Nigeria",
    region: "West Africa",
    isi_score: 58,
    gdp_estimate_usd_b: 477.4,
    sectors: ["Energy", "Finance", "Telecom"],
  },
  {
    code: "rw",
    name: "Rwanda",
    region: "East Africa",
    isi_score: 78,
    gdp_estimate_usd_b: 13.3,
    sectors: ["Tourism", "Tech", "Agriculture"],
  },
  {
    code: "eg",
    name: "Egypt",
    region: "North Africa",
    isi_score: 49,
    gdp_estimate_usd_b: 398.4,
    sectors: ["Energy", "Tourism", "Manufacturing"],
  },
  {
    code: "za",
    name: "South Africa",
    region: "Southern Africa",
    isi_score: 52,
    gdp_estimate_usd_b: 405.7,
    sectors: ["Mining", "Finance", "Manufacturing"],
  },
  {
    code: "ma",
    name: "Morocco",
    region: "North Africa",
    isi_score: 67,
    gdp_estimate_usd_b: 142.9,
    sectors: ["Tourism", "Manufacturing", "Agriculture"],
  },
  {
    code: "gh",
    name: "Ghana",
    region: "West Africa",
    isi_score: 61,
    gdp_estimate_usd_b: 76.6,
    sectors: ["Mining", "Energy", "Agriculture"],
  },
  {
    code: "et",
    name: "Ethiopia",
    region: "East Africa",
    isi_score: 38,
    gdp_estimate_usd_b: 156.1,
    sectors: ["Agriculture", "Manufacturing", "Logistics"],
  },
  {
    code: "tz",
    name: "Tanzania",
    region: "East Africa",
    isi_score: 64,
    gdp_estimate_usd_b: 84.0,
    sectors: ["Mining", "Tourism", "Agriculture"],
  },
  {
    code: "sn",
    name: "Senegal",
    region: "West Africa",
    isi_score: 69,
    gdp_estimate_usd_b: 31.2,
    sectors: ["Energy", "Agriculture", "Tourism"],
  },
  {
    code: "ci",
    name: "Côte d'Ivoire",
    region: "West Africa",
    isi_score: 73,
    gdp_estimate_usd_b: 87.6,
    sectors: ["Agriculture", "Energy", "Logistics"],
  },
  {
    code: "tn",
    name: "Tunisia",
    region: "North Africa",
    isi_score: 44,
    gdp_estimate_usd_b: 49.8,
    sectors: ["Tourism", "Manufacturing", "Agriculture"],
  },
  {
    code: "bw",
    name: "Botswana",
    region: "Southern Africa",
    isi_score: 75,
    gdp_estimate_usd_b: 20.4,
    sectors: ["Mining", "Tourism", "Finance"],
  },
  {
    code: "mu",
    name: "Mauritius",
    region: "Southern Africa",
    isi_score: 82,
    gdp_estimate_usd_b: 16.7,
    sectors: ["Finance", "Tourism", "Tech"],
  },
  {
    code: "ug",
    name: "Uganda",
    region: "East Africa",
    isi_score: 56,
    gdp_estimate_usd_b: 53.4,
    sectors: ["Agriculture", "Energy", "Tourism"],
  },
];

// URL-friendly slug derived from the country name. We accept either the ISO
// code or the slug when looking up so the route works with `/sentiment-isi/ke`
// or `/sentiment-isi/kenya`.
export function countrySlug(country: Country): string {
  return country.name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function findCountry(idOrSlug: string): Country | undefined {
  const needle = idOrSlug.toLowerCase();
  return countries.find(
    (c) => c.code === needle || countrySlug(c) === needle,
  );
}
