// Domain types for Kilwa frontend.
// Shapes here are placeholders pending the contracts.md handoff from the
// backend pod. Treat field names and units as draft.

export type Region =
  | "North Africa"
  | "West Africa"
  | "East Africa"
  | "Southern Africa"
  | "Central Africa";

// A single market in the coverage universe. Drives the Market Map treemap.
// Figures are sourced live from the IMF World Economic Outlook (DataMapper API)
// — see app/api/markets/route.ts.
export interface Country {
  code: string; // ISO-3166 alpha-2 lowercase — React key
  iso3: string; // ISO-3166 alpha-3 uppercase — IMF country code + UI badge
  name: string;
  region: Region;
  gdp_usd_b: number; // NGDPD — GDP, current prices, USD billions (drives tile size)
  gdp_growth: number; // NGDP_RPCH — real GDP growth, % (drives teal/red colour)
  isi_score?: number | null; // latest ISI (EWMA, 0–100) from the sentiment ISI tables
  isi_momentum?: number | null; // latest ISI momentum (rising/falling sentiment)
  // IMF macro extras shown on hover. null when IMF has no value for the market.
  inflation?: number | null; // PCPIPCH — avg consumer prices, %
  gdp_per_capita?: number | null; // NGDPDPC — GDP per capita, current USD
  population?: number | null; // LP — population, millions
  govt_debt_pct?: number | null; // GGXWDG_NGDP — govt gross debt, % of GDP
  unemployment?: number | null; // LUR — unemployment rate, %
  current_account_pct?: number | null; // BCA_NGDPD — current account, % of GDP
  data_year?: number; // WEO year the figures are drawn from
}

// A scored news item feeding the Sentiment Pulse news flow.
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
