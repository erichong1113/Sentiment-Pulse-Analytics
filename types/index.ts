// Domain types for Kilwa frontend.
// All shapes here are placeholders pending the contracts.md handoff from the
// backend pod. Files importing these should not assume field names are stable.

export type Region =
  | "North Africa"
  | "West Africa"
  | "East Africa"
  | "Southern Africa"
  | "Central Africa";

export type SectorTag =
  | "Energy"
  | "Agriculture"
  | "Tech"
  | "Finance"
  | "Mining"
  | "Tourism"
  | "Telecom"
  | "Manufacturing"
  | "Logistics";

// SWAP: shape will be confirmed in contracts.md once backend pod finalizes
export interface Country {
  code: string; // ISO-3166 alpha-2, lowercased for URL slugs
  name: string;
  region: Region;
  isi_score: number; // 0–100
  gdp_estimate_usd_b: number; // billions
  sectors: SectorTag[];
}

// SWAP: shape will be confirmed in contracts.md once backend pod finalizes
export interface SentimentISIPoint {
  date: string; // ISO yyyy-mm-dd
  sentiment_isi: number; // 0–100
  macro_isi: number; // 0–100
  volume: number; // article count for the day
  momentum: number; // -10 to 10
}

// SWAP: shape will be confirmed in contracts.md once backend pod finalizes
export interface BriefDriver {
  text: string;
  source: string;
  url: string;
}

// SWAP: shape will be confirmed in contracts.md once backend pod finalizes
export type RiskSeverity = "low" | "medium" | "high";

// SWAP: shape will be confirmed in contracts.md once backend pod finalizes
export interface BriefRisk {
  text: string;
  severity: RiskSeverity;
}

// SWAP: shape will be confirmed in contracts.md once backend pod finalizes
export interface CountryBrief {
  country_code: string;
  title: string;
  summary: string;
  key_drivers: BriefDriver[];
  risks: BriefRisk[];
  generated_at: string; // ISO timestamp
}

// SWAP: shape will be confirmed in contracts.md once backend pod finalizes
export interface TopDriver {
  id: string;
  title: string;
  source: string;
  url: string;
  snippet: string;
  sentiment_score: number; // -1 to 1
  contribution_weight: number; // 0–1
  published_at: string; // ISO timestamp
}
