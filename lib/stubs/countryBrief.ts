import type { CountryBrief } from "@/types";

export const kenyaBrief: CountryBrief = {
  country_code: "ke",
  title: "Kenya — May 2026 Investment Outlook",
  summary:
    "Kenya's investment sentiment trended upward over the past two weeks, driven primarily by strong agricultural export figures and a stabilizing shilling against the dollar. New tech-sector capital flows from Gulf-based funds reinforced the rally, though headline ISI remains capped by tighter fiscal commentary from the Treasury. Analysts highlight Nairobi's continued role as the regional fintech hub, while flagging election-cycle noise as a known-unknown for the back half of the year. On balance, Kenya is screening as one of the more constructive East African setups in our coverage.",
  key_drivers: [
    {
      text: "Tea and horticulture exports posted a 12% YoY uplift in April, lifting current-account expectations.",
      source: "Business Daily Africa",
      url: "https://example.com/article/ke-exports-april",
    },
    {
      text: "Two Gulf-backed funds disclosed a combined $180M commitment to Nairobi-based fintechs.",
      source: "Reuters Africa",
      url: "https://example.com/article/ke-fintech-gulf",
    },
    {
      text: "CBK held the policy rate steady, signalling a data-dependent posture into Q3.",
      source: "Central Bank of Kenya",
      url: "https://example.com/cbk/may-statement",
    },
  ],
  risks: [
    {
      text: "Pre-election political noise tends to widen sovereign spreads in H2.",
      severity: "medium",
    },
    {
      text: "Drought risk in the Rift Valley could pressure agri-export volumes through Q3.",
      severity: "medium",
    },
    {
      text: "External debt servicing remains elevated relative to peers.",
      severity: "high",
    },
  ],
  generated_at: "2026-05-06T09:14:00Z",
};

export function getCountryBrief(countryCode: string): CountryBrief {
  // Until the brief generation pipeline is live, every country renders Kenya's
  // brief with the country_code rewritten so the page header matches the URL.
  return { ...kenyaBrief, country_code: countryCode.toLowerCase() };
}
