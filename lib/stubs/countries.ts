import type { Country } from "@/types";

// 30-country universe — mirrors the v2-dashboard mockup so the treemap and
// downstream views have the same coverage breadth. Hand-tuned values, not real
// data. Sectors are illustrative.
export const countries: Country[] = [
  // North Africa
  { code: "eg", iso3: "EGY", name: "Egypt",       region: "North Africa",    isi_score: 72, gdp_estimate_usd_b: 476, perf_1w:  0.90, sectors: ["Energy", "Tourism", "Manufacturing"] },
  { code: "dz", iso3: "DZA", name: "Algeria",     region: "North Africa",    isi_score: 65, gdp_estimate_usd_b: 191, perf_1w:  2.27, sectors: ["Energy"] },
  { code: "ma", iso3: "MAR", name: "Morocco",     region: "North Africa",    isi_score: 81, gdp_estimate_usd_b: 142, perf_1w:  0.01, sectors: ["Tourism", "Renewables", "Manufacturing"] },
  { code: "sd", iso3: "SDN", name: "Sudan",       region: "North Africa",    isi_score: 34, gdp_estimate_usd_b:  36, perf_1w: -1.90, sectors: ["Agriculture"] },
  { code: "tn", iso3: "TUN", name: "Tunisia",     region: "North Africa",    isi_score: 58, gdp_estimate_usd_b:  47, perf_1w: -1.90, sectors: ["Tourism", "Manufacturing"] },
  { code: "ly", iso3: "LBY", name: "Libya",       region: "North Africa",    isi_score: 29, gdp_estimate_usd_b:  41, perf_1w: -1.90, sectors: ["Energy"] },

  // West Africa
  { code: "ng", iso3: "NGA", name: "Nigeria",     region: "West Africa",     isi_score: 77, gdp_estimate_usd_b: 477, perf_1w:  1.90, sectors: ["Energy", "Fintech", "Telecom"] },
  { code: "ci", iso3: "CIV", name: "Côte d'Ivoire", region: "West Africa",   isi_score: 74, gdp_estimate_usd_b:  70, perf_1w:  2.20, sectors: ["Agriculture", "Energy", "Logistics"] },
  { code: "gh", iso3: "GHA", name: "Ghana",       region: "West Africa",     isi_score: 70, gdp_estimate_usd_b:  72, perf_1w:  2.20, sectors: ["Mining", "Energy", "Agriculture"] },
  { code: "sn", iso3: "SEN", name: "Senegal",     region: "West Africa",     isi_score: 68, gdp_estimate_usd_b:  28, perf_1w:  2.00, sectors: ["Energy", "Agriculture", "Tourism"] },
  { code: "bj", iso3: "BEN", name: "Benin",       region: "West Africa",     isi_score: 61, gdp_estimate_usd_b:  17, perf_1w:  2.00, sectors: ["Agriculture", "Logistics"] },
  { code: "gn", iso3: "GIN", name: "Guinea",      region: "West Africa",     isi_score: 55, gdp_estimate_usd_b:  16, perf_1w:  2.00, sectors: ["Mining"] },
  { code: "bf", iso3: "BFA", name: "Burkina Faso", region: "West Africa",    isi_score: 42, gdp_estimate_usd_b:  19, perf_1w: -1.90, sectors: ["Agriculture", "Mining"] },
  { code: "ml", iso3: "MLI", name: "Mali",        region: "West Africa",     isi_score: 38, gdp_estimate_usd_b:  18, perf_1w: -2.30, sectors: ["Mining", "Agriculture"] },
  { code: "ne", iso3: "NER", name: "Niger",       region: "West Africa",     isi_score: 44, gdp_estimate_usd_b:  14, perf_1w: -0.50, sectors: ["Mining"] },

  // East Africa
  { code: "et", iso3: "ETH", name: "Ethiopia",    region: "East Africa",     isi_score: 62, gdp_estimate_usd_b: 156, perf_1w: -1.90, sectors: ["Agriculture", "Manufacturing", "Logistics"] },
  { code: "ke", iso3: "KEN", name: "Kenya",       region: "East Africa",     isi_score: 85, gdp_estimate_usd_b: 118, perf_1w:  2.30, sectors: ["Tech", "Fintech", "Agriculture", "Finance"] },
  { code: "tz", iso3: "TZA", name: "Tanzania",    region: "East Africa",     isi_score: 66, gdp_estimate_usd_b:  80, perf_1w:  0.50, sectors: ["Mining", "Tourism", "Agriculture"] },
  { code: "ug", iso3: "UGA", name: "Uganda",      region: "East Africa",     isi_score: 60, gdp_estimate_usd_b:  45, perf_1w:  0.40, sectors: ["Agriculture", "Energy", "Tourism"] },
  { code: "zm", iso3: "ZMB", name: "Zambia",      region: "East Africa",     isi_score: 57, gdp_estimate_usd_b:  28, perf_1w:  0.40, sectors: ["Mining"] },
  { code: "mu", iso3: "MUS", name: "Mauritius",   region: "East Africa",     isi_score: 76, gdp_estimate_usd_b:  14, perf_1w: -1.20, sectors: ["Finance", "Tourism", "Tech"] },
  { code: "rw", iso3: "RWA", name: "Rwanda",      region: "East Africa",     isi_score: 69, gdp_estimate_usd_b:  11, perf_1w: -1.20, sectors: ["Tech", "Tourism", "Agriculture"] },
  { code: "mw", iso3: "MWI", name: "Malawi",      region: "East Africa",     isi_score: 46, gdp_estimate_usd_b:  14, perf_1w: -1.20, sectors: ["Agriculture"] },

  // Southern Africa
  { code: "za", iso3: "ZAF", name: "South Africa", region: "Southern Africa", isi_score: 79, gdp_estimate_usd_b: 405, perf_1w: -3.33, sectors: ["Mining", "Finance", "Manufacturing"] },
  { code: "bw", iso3: "BWA", name: "Botswana",    region: "Southern Africa", isi_score: 73, gdp_estimate_usd_b:  18, perf_1w: -1.90, sectors: ["Mining", "Tourism", "Finance"] },
  { code: "na", iso3: "NAM", name: "Namibia",     region: "Southern Africa", isi_score: 68, gdp_estimate_usd_b:  12, perf_1w: -1.30, sectors: ["Mining", "Tourism"] },

  // Central Africa
  { code: "ao", iso3: "AGO", name: "Angola",      region: "Central Africa",  isi_score: 59, gdp_estimate_usd_b:  93, perf_1w:  0.03, sectors: ["Energy", "Mining"] },
  { code: "cd", iso3: "COD", name: "DR Congo",    region: "Central Africa",  isi_score: 61, gdp_estimate_usd_b:  66, perf_1w:  1.90, sectors: ["Mining"] },
  { code: "cm", iso3: "CMR", name: "Cameroon",    region: "Central Africa",  isi_score: 64, gdp_estimate_usd_b:  45, perf_1w:  0.40, sectors: ["Energy", "Agriculture"] },
  { code: "ga", iso3: "GAB", name: "Gabon",       region: "Central Africa",  isi_score: 56, gdp_estimate_usd_b:  20, perf_1w: -1.90, sectors: ["Energy", "Mining"] },
];

// URL-friendly slug from country name, e.g. `Côte d'Ivoire` → `cote-d-ivoire`.
export function countrySlug(country: Country): string {
  return country.name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Lookup tolerates ISO-2 code, ISO-3 code, or slug — routes can use whichever.
export function findCountry(idOrSlug: string): Country | undefined {
  const needle = idOrSlug.toLowerCase();
  return countries.find(
    (c) =>
      c.code === needle ||
      c.iso3.toLowerCase() === needle ||
      countrySlug(c) === needle,
  );
}
