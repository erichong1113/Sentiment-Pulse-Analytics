// Domain types for Kilwa frontend.
// Shapes here are placeholders pending the contracts.md handoff from the
// backend pod. Treat field names and units as draft.

export type Region =
  | "North Africa"
  | "West Africa"
  | "East Africa"
  | "Southern Africa"
  | "Central Africa";

export type SectorTag =
  | "Energy"
  | "Renewables"
  | "Agriculture"
  | "Tech"
  | "Fintech"
  | "Finance"
  | "Mining"
  | "Tourism"
  | "Telecom"
  | "Manufacturing"
  | "Logistics"
  | "Infrastructure"
  | "Healthcare";

// SWAP: shape will be confirmed in contracts.md once backend pod finalizes
export interface Country {
  code: string; // ISO-3166 alpha-2 lowercase — used in URL slugs
  iso3: string; // ISO-3166 alpha-3 uppercase — used in UI badges
  name: string;
  region: Region;
  isi_score: number; // 0–100
  gdp_estimate_usd_b: number;
  perf_1w: number; // 1-week performance in % (USD)
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
  source_tier: "t1" | "t2" | "t3";
  url: string;
  snippet: string;
  sentiment_score: number; // -1 to 1
  contribution_weight: number; // 0–1
  published_at: string; // ISO timestamp
  tags: string[];
}

// SWAP: shape will be confirmed in contracts.md once backend pod finalizes
export interface KpiTile {
  label: string;
  value: string;
  unit?: string;
  sub: string;
  tone?: "pos" | "neg" | "brand" | "neutral";
  delta?: { value: string; tone: "pos" | "neg" };
  foot?: string;
}
