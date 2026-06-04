import { NextResponse } from "next/server";
import { BigQuery } from "@google-cloud/bigquery";
import type { Country, Region } from "@/types";

// Live market data scraped from the IMF World Economic Outlook via the official
// DataMapper JSON API (https://www.imf.org/external/datamapper/api/v1). Runs
// server-side, so there's no CORS issue and no client credentials involved.
// Cached for a day — WEO figures change a couple of times a year, not hourly.

export const revalidate = 86400;

const IMF_BASE = "https://www.imf.org/external/datamapper/api/v1";
const PROJECT_ID = "vast-flight-470212-c3";

// The markets in scope. Region is the one fact IMF doesn't carry, so we map it
// here (drives the "section of Africa" grouping on the treemap).
const TARGETS: { iso3: string; code: string; name: string; region: Region }[] = [
  { iso3: "NGA", code: "ng", name: "Nigeria", region: "West Africa" },
  { iso3: "KEN", code: "ke", name: "Kenya", region: "East Africa" },
  { iso3: "RWA", code: "rw", name: "Rwanda", region: "East Africa" },
];

// IMF WEO indicator codes we pull for each market.
const INDICATORS = [
  "NGDPD", // GDP, current prices, USD billions
  "NGDP_RPCH", // Real GDP growth, % change
  "PCPIPCH", // Inflation, average consumer prices, %
  "NGDPDPC", // GDP per capita, current prices, USD
  "LP", // Population, millions
  "GGXWDG_NGDP", // General government gross debt, % of GDP
  "LUR", // Unemployment rate, %
  "BCA_NGDPD", // Current account balance, % of GDP
] as const;

type Series = Record<string, number>;
type IndicatorMap = Record<string, Record<string, Series>>; // indicator → iso3 → { year: value }

// Pick the value for the most recent year at or before the reference year,
// falling back to the latest year IMF has at all.
function pickValue(
  series: Series | undefined,
  refYear: number,
): { value: number | null; year: number | null } {
  if (!series) return { value: null, year: null };
  const years = Object.keys(series)
    .map(Number)
    .filter((y) => !Number.isNaN(y) && series[String(y)] != null)
    .sort((a, b) => a - b);
  if (years.length === 0) return { value: null, year: null };
  const atOrBefore = years.filter((y) => y <= refYear);
  const year = atOrBefore.length ? atOrBefore[atOrBefore.length - 1] : years[years.length - 1];
  return { value: series[String(year)], year };
}

function round(v: number | null, dp = 2): number | null {
  if (v == null || Number.isNaN(v)) return null;
  const f = 10 ** dp;
  return Math.round(v * f) / f;
}

// iso3 → the ISI tables' integer country_id (those tables key by 1=NG,2=RW,3=KE).
const ISI_COUNTRY_ID: Record<string, number> = { NGA: 1, RWA: 2, KEN: 3 };

let bqClient: BigQuery | null = null;
function bq(): BigQuery {
  if (!bqClient) bqClient = new BigQuery({ projectId: PROJECT_ID });
  return bqClient;
}

interface IsiSignal {
  ewma: number | null;
  momentum: number | null;
}

// Latest ISI (EWMA 0–100 + momentum) per country from the bucket-signal table's
// most recent bucket. Returns an empty map on any failure so the Market Map
// still renders without ISI.
async function fetchIsiSignals(): Promise<Record<number, IsiSignal>> {
  try {
    const [rows] = await bq().query({
      query: `
        SELECT country_id, ewma_score_100, momentum
        FROM \`vast-flight-470212-c3.sentiment_pulse.sentiment_isi_bucket_signal\`
        WHERE country_id IN (1, 2, 3)
        QUALIFY ROW_NUMBER() OVER (PARTITION BY country_id ORDER BY bucket_start DESC) = 1
      `,
    });
    const out: Record<number, IsiSignal> = {};
    for (const r of rows as {
      country_id: number;
      ewma_score_100: number | null;
      momentum: number | null;
    }[]) {
      out[r.country_id] = { ewma: r.ewma_score_100, momentum: r.momentum };
    }
    return out;
  } catch {
    return {};
  }
}

export async function GET() {
  const refYear = new Date().getFullYear();
  const iso = TARGETS.map((t) => t.iso3).join("/");

  // IMF indicators (one request each, all three countries) and the ISI scores
  // (one BigQuery call) — all fetched in parallel.
  const [entries, isiById] = await Promise.all([
    Promise.all(
      INDICATORS.map(async (ind) => {
        try {
          const res = await fetch(`${IMF_BASE}/${ind}/${iso}`, {
            next: { revalidate },
            headers: { Accept: "application/json" },
          });
          if (!res.ok) return [ind, {}] as const;
          const json = await res.json();
          return [ind, (json?.values?.[ind] ?? {}) as Record<string, Series>] as const;
        } catch {
          return [ind, {} as Record<string, Series>] as const;
        }
      }),
    ),
    fetchIsiSignals(),
  ]);
  const byIndicator: IndicatorMap = Object.fromEntries(entries);

  const markets: Country[] = TARGETS.map((t) => {
    const get = (ind: string) => pickValue(byIndicator[ind]?.[t.iso3], refYear);
    const gdp = get("NGDPD");
    const growth = get("NGDP_RPCH");
    const isiId = ISI_COUNTRY_ID[t.iso3];
    const sig = isiId != null ? isiById[isiId] : undefined;
    return {
      code: t.code,
      iso3: t.iso3,
      name: t.name,
      region: t.region,
      gdp_usd_b: round(gdp.value) ?? 0,
      gdp_growth: round(growth.value) ?? 0,
      isi_score: sig?.ewma != null ? round(sig.ewma, 1) : null,
      isi_momentum: sig?.momentum != null ? round(sig.momentum, 2) : null,
      inflation: round(get("PCPIPCH").value),
      gdp_per_capita: round(get("NGDPDPC").value, 0),
      population: round(get("LP").value),
      govt_debt_pct: round(get("GGXWDG_NGDP").value),
      unemployment: round(get("LUR").value),
      current_account_pct: round(get("BCA_NGDPD").value),
      data_year: gdp.year ?? undefined,
    };
  });

  const reachedImf = markets.some((m) => m.gdp_usd_b > 0);
  if (!reachedImf) {
    return NextResponse.json(
      { success: false, error: "Could not reach the IMF DataMapper API.", markets: [] },
      { status: 502 },
    );
  }

  return NextResponse.json({
    success: true,
    source: "IMF World Economic Outlook · DataMapper API",
    markets,
  });
}
