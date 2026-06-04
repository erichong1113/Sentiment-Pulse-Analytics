"use client";

import { useEffect, useState } from "react";
import type { Country } from "@/types";

// Overview / Compare — all markets side by side across every metric, with the
// leader in each row highlighted. Pulls the same /api/markets payload the
// Market Map uses (IMF WEO + ISI), so it's a single fetch.

type LoadState = "loading" | "ready" | "empty" | "error";

const fmtGdp = (b: number) => (b >= 1000 ? `$${(b / 1000).toFixed(2)}T` : `$${Math.round(b)}B`);
const num = (v: number | null | undefined, suffix = "", dp = 1) =>
  v == null ? "—" : `${v.toFixed(dp)}${suffix}`;
const pct = (v: number | null | undefined, dp = 1) =>
  v == null ? "—" : `${v > 0 ? "+" : ""}${v.toFixed(dp)}%`;

interface Metric {
  label: string;
  get: (c: Country) => number | null | undefined;
  fmt: (c: Country) => string;
  dir: "high" | "low" | "none"; // which direction is "best"
}

const METRICS: Metric[] = [
  { label: "ISI score", get: (c) => c.isi_score, fmt: (c) => num(c.isi_score, "", 1), dir: "high" },
  { label: "GDP (USD)", get: (c) => c.gdp_usd_b, fmt: (c) => fmtGdp(c.gdp_usd_b), dir: "high" },
  { label: "Real GDP growth", get: (c) => c.gdp_growth, fmt: (c) => pct(c.gdp_growth), dir: "high" },
  { label: "Inflation", get: (c) => c.inflation, fmt: (c) => num(c.inflation, "%"), dir: "low" },
  {
    label: "GDP per capita",
    get: (c) => c.gdp_per_capita,
    fmt: (c) => (c.gdp_per_capita == null ? "—" : `$${c.gdp_per_capita.toLocaleString()}`),
    dir: "high",
  },
  { label: "Population", get: (c) => c.population, fmt: (c) => num(c.population, "M"), dir: "none" },
  { label: "Govt debt", get: (c) => c.govt_debt_pct, fmt: (c) => num(c.govt_debt_pct, "% of GDP"), dir: "low" },
  { label: "Unemployment", get: (c) => c.unemployment, fmt: (c) => num(c.unemployment, "%"), dir: "low" },
  {
    label: "Current account",
    get: (c) => c.current_account_pct,
    fmt: (c) => num(c.current_account_pct, "% of GDP"),
    dir: "high",
  },
];

function bestIndex(markets: Country[], m: Metric): number {
  if (m.dir === "none") return -1;
  let best = -1;
  let bestVal: number | null = null;
  markets.forEach((c, i) => {
    const v = m.get(c);
    if (v == null) return;
    if (bestVal == null || (m.dir === "high" ? v > bestVal : v < bestVal)) {
      bestVal = v;
      best = i;
    }
  });
  return best;
}

export default function OverviewPage() {
  const [markets, setMarkets] = useState<Country[]>([]);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/markets");
        if (!res.ok) {
          if (!cancelled) setState("error");
          return;
        }
        const data = await res.json();
        const list: Country[] = Array.isArray(data?.markets) ? data.markets : [];
        if (cancelled) return;
        setMarkets(list);
        setState(list.length > 0 ? "ready" : "empty");
      } catch {
        if (!cancelled) setState("error");
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-w-0 flex-1 overflow-y-auto bg-bg-0 p-6">
      <div className="mb-4">
        <h1 className="text-[22px] font-semibold tracking-tight">Overview</h1>
        <p className="text-[12px] text-ink-2">
          All markets compared across every metric · leader in each row highlighted · IMF WEO + ISI.
        </p>
      </div>

      {state !== "ready" ? (
        <div className="flex h-48 items-center justify-center rounded-lg border border-rule bg-bg-1 text-[12px] text-ink-3">
          {state === "loading"
            ? "Loading markets…"
            : state === "error"
              ? "Couldn't load market data."
              : "No market data available yet."}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-rule bg-bg-1">
          <table className="w-full border-collapse text-[12.5px]">
            <thead>
              <tr className="border-b border-rule bg-bg-2">
                <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.4px] text-ink-3">
                  Metric
                </th>
                {markets.map((c) => (
                  <th key={c.code} className="px-4 py-3 text-right">
                    <div className="font-semibold text-ink-1">{c.name}</div>
                    <div className="mono text-[10px] font-normal text-ink-3">
                      {c.iso3} · {c.region}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METRICS.map((m) => {
                const best = bestIndex(markets, m);
                return (
                  <tr key={m.label} className="border-t border-rule hover:bg-bg-2">
                    <td className="px-4 py-2.5 text-ink-2">{m.label}</td>
                    {markets.map((c, i) => (
                      <td
                        key={c.code}
                        className={`mono px-4 py-2.5 text-right ${
                          i === best ? "font-semibold text-brand" : "text-ink-1"
                        }`}
                      >
                        {m.fmt(c)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {state === "ready" ? (
        <p className="mt-3 text-[10.5px] text-ink-3">
          <span className="text-brand">Highlighted</span> = best in row (higher is better, except
          inflation / debt / unemployment where lower is better). Population shown for context only.
        </p>
      ) : null}
    </main>
  );
}
