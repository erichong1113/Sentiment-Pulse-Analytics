import type { TopDriver } from "@/types";

export const topDrivers: TopDriver[] = [
  {
    id: "td-001",
    title: "Nairobi tech hub draws $180M in fresh Gulf capital",
    source: "Reuters Africa",
    url: "https://example.com/article/ke-fintech-gulf",
    snippet:
      "A consortium of Gulf-based funds announced a combined $180M commitment to Nairobi fintechs this week, citing strong unit economics and a clearer regulatory path under the new digital lending framework — the largest single inflow this quarter.",
    sentiment_score: 0.72,
    contribution_weight: 0.31,
    published_at: "2026-05-05T07:42:00Z",
  },
  {
    id: "td-002",
    title: "Tea exports beat April forecasts on stronger EU demand",
    source: "Business Daily Africa",
    url: "https://example.com/article/ke-exports-april",
    snippet:
      "Kenya's tea and horticulture exports expanded 12% year-on-year in April, with EU buyers leading the rebound. Analysts say the print supports a more constructive current-account view and partly offsets earlier concerns about shilling weakness.",
    sentiment_score: 0.58,
    contribution_weight: 0.22,
    published_at: "2026-05-04T13:10:00Z",
  },
  {
    id: "td-003",
    title: "Treasury signals tighter fiscal stance ahead of budget reading",
    source: "The Standard",
    url: "https://example.com/article/ke-treasury-fiscal",
    snippet:
      "Treasury officials previewed a more restrained spending posture for the FY26 budget, prioritising debt-service coverage over new capex. Markets read the language as marginally hawkish, capping the recent ISI rally despite supportive external prints.",
    sentiment_score: -0.21,
    contribution_weight: 0.18,
    published_at: "2026-05-03T16:55:00Z",
  },
  {
    id: "td-004",
    title: "CBK holds policy rate, flags data-dependent path",
    source: "Central Bank of Kenya",
    url: "https://example.com/cbk/may-statement",
    snippet:
      "The Central Bank of Kenya kept its benchmark rate unchanged and emphasised a data-dependent posture into Q3. The communique was read as neutral-dovish, stabilising the shilling and providing a constructive backdrop for portfolio inflows.",
    sentiment_score: 0.14,
    contribution_weight: 0.16,
    published_at: "2026-05-02T10:00:00Z",
  },
  {
    id: "td-005",
    title: "Rift Valley drought watch escalated to amber",
    source: "Reuters Africa",
    url: "https://example.com/article/ke-drought-watch",
    snippet:
      "Meteorological services raised the Rift Valley drought watch to amber this week, putting Q3 horticulture volumes at risk. Sentiment scoring weighted the headline negatively given downstream export and FX implications if conditions persist.",
    sentiment_score: -0.46,
    contribution_weight: 0.13,
    published_at: "2026-05-01T18:20:00Z",
  },
];
