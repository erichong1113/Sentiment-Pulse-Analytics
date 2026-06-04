"use client";

import { useEffect, useMemo, useState } from "react";
import { Treemap } from "@/components/dashboard/Treemap";
import { KpiTile } from "@/components/dashboard/KpiTile";
import type { Country } from "@/types";

// Market Map — the coverage-universe treemap. Markets come from the IMF World
// Economic Outlook via our /api/markets route (which scrapes the IMF DataMapper
// API server-side). Tile area = GDP, colour = real GDP growth (teal/red),
// grouped by section of Africa.

type LoadState = "loading" | "ready" | "empty" | "error";

export default function MarketMapPage() {
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

  const kpis = useMemo(() => deriveKpis(markets), [markets]);
  const coverage = useMemo(() => deriveCoverage(markets), [markets]);
  const signals = useMemo(() => buildSignals(markets), [markets]);

  return (
    <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
      {/* Scenario bar */}
        <div className="flex h-[42px] items-center gap-4 border-b border-rule bg-bg-1 px-[22px]">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--brand-soft)] px-2.5 py-1 text-[11.5px] font-medium text-ink-1">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            IMF · World Economic Outlook
          </span>
          <span className="mono text-[11px] text-ink-3">Real GDP growth · annual</span>
        </div>

        {/* Coverage row */}
        <div className="flex items-baseline gap-7 border-b border-rule bg-bg-0 px-[22px] py-3">
          <CovItem n={coverage.markets} l="Markets" />
          <CovItem n={coverage.regions} l="Regions" />
          <CovItem n={coverage.year} l="WEO year" />
          <div className="flex-1" />
          <div className="max-w-[320px] text-right text-[10.5px] leading-snug text-ink-3">
            Source: <span className="dotted-u">IMF DataMapper</span> · GDP (NGDPD), growth (NGDP_RPCH), inflation, debt &amp; more
          </div>
        </div>

        {/* KPI tiles */}
        <div className="grid grid-cols-4 border-b border-rule bg-bg-0">
          <KpiTile
            label="Largest economy"
            value={kpis ? kpis.largest.iso3 : "—"}
            unit={kpis ? fmtGdp(kpis.largest.gdp_usd_b) : undefined}
            tone="brand"
            sub={kpis ? `${kpis.largest.name} · ${kpis.largest.region}` : "Awaiting data"}
            foot={<>GDP, current USD · IMF WEO</>}
          />
          <KpiTile
            label="Fastest growth"
            value={kpis ? <span className="text-pos">{kpis.fastest.iso3}</span> : "—"}
            unit={kpis ? fmtPct(kpis.fastest.gdp_growth) : undefined}
            tone="pos"
            sub={kpis ? `${kpis.fastest.name} · real GDP, annual` : "Awaiting data"}
            foot={<>NGDP_RPCH · IMF WEO</>}
          />
          <KpiTile
            label="Avg inflation"
            value={kpis && kpis.avgInfl != null ? kpis.avgInfl.toFixed(1) : "—"}
            unit={kpis && kpis.avgInfl != null ? "%" : undefined}
            tone="neutral"
            sub={kpis ? `Across ${kpis.count} markets · avg CPI` : "Awaiting data"}
            foot={<>PCPIPCH · IMF WEO</>}
          />
          <KpiTile
            label="Combined GDP"
            value={kpis ? fmtGdp(kpis.combined) : "—"}
            tone="brand"
            sub={kpis ? `${kpis.count} markets in coverage` : "Awaiting data"}
            foot={<>Sum of NGDPD · IMF WEO</>}
          />
        </div>

        {/* Key signals — auto-computed takeaways */}
        {signals.length > 0 ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-rule bg-bg-0 px-[22px] py-2.5 text-[11.5px] text-ink-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.5px] text-ink-3">
              Key signals
            </span>
            {signals.map((s, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 ? <span className="text-ink-3">·</span> : null}
                <span>{s.emoji}</span>
                <span>{s.label}</span>
              </span>
            ))}
          </div>
        ) : null}

        {/* Toolbar */}
        <div className="flex items-center gap-3.5 border-b border-rule bg-bg-1 px-[22px] py-2">
          <p className="flex-1 text-[11.5px] text-ink-2">
            African markets · grouped by <strong className="font-medium text-ink-1">section of Africa</strong>{" "}
            · area ∝ <strong className="font-medium text-ink-1">GDP (√ scale)</strong> · colour ={" "}
            <strong className="font-medium text-ink-1">real GDP growth</strong>
          </p>
          <Seg options={["▦ Treemap"]} active={0} />
        </div>

        {/* Treemap canvas */}
        <div className="min-h-0 flex-1">
          {state === "ready" ? (
            <Treemap countries={markets} />
          ) : (
            <CanvasMessage state={state} />
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3.5 border-t border-rule bg-bg-1 px-[22px] py-2 text-[10.5px] text-ink-3">
          <span>Real GDP growth</span>
          <div className="flex items-center gap-px">
            <span className="mono pr-1">−4</span>
            {[
              "oklch(0.44 0.16 30)",
              "oklch(0.54 0.14 35)",
              "oklch(0.62 0.12 40)",
              "oklch(0.50 0.05 180)",
              "oklch(0.60 0.10 185)",
              "oklch(0.50 0.10 188)",
              "oklch(0.40 0.10 190)",
            ].map((c, i) => (
              <span key={i} className="block h-2 w-[18px]" style={{ background: c }} />
            ))}
            <span className="mono pl-1">+6%</span>
          </div>
          <span className="h-3.5 w-px bg-rule" />
          <span>Area ∝ GDP</span>
          <span className="ml-auto italic">Hover a market for the full IMF profile</span>
        </div>
      </main>
  );
}

function buildSignals(markets: Country[]): { emoji: string; label: React.ReactNode }[] {
  if (markets.length === 0) return [];
  const byMax = (sel: (c: Country) => number | null | undefined) =>
    markets.reduce((a, b) => ((sel(b) ?? -Infinity) > (sel(a) ?? -Infinity) ? b : a));

  const topIsi = byMax((c) => c.isi_score);
  const topGrowth = byMax((c) => c.gdp_growth);
  const topInfl = byMax((c) => c.inflation);
  const moms = markets.map((c) => c.isi_momentum).filter((v): v is number => v != null);
  const allPositive = moms.length > 0 && moms.every((v) => v > 0);
  const anyNegative = moms.some((v) => v < 0);

  const out: { emoji: string; label: React.ReactNode }[] = [];
  if (topIsi.isi_score != null) {
    out.push({
      emoji: "🟢",
      label: (
        <>
          <b className="text-ink-1">{topIsi.name}</b> leads on sentiment — ISI{" "}
          <b className="text-brand">{topIsi.isi_score.toFixed(1)}</b>
        </>
      ),
    });
  }
  out.push({
    emoji: "🚀",
    label: (
      <>
        <b className="text-ink-1">{topGrowth.name}</b> fastest-growing at{" "}
        <b className="text-pos">+{topGrowth.gdp_growth.toFixed(1)}%</b>
      </>
    ),
  });
  if (topInfl.inflation != null) {
    out.push({
      emoji: "⚠️",
      label: (
        <>
          <b className="text-ink-1">{topInfl.name}</b> inflation highest at{" "}
          <b className="text-neg">{topInfl.inflation.toFixed(1)}%</b>
        </>
      ),
    });
  }
  if (moms.length > 0) {
    out.push({
      emoji: allPositive ? "📈" : anyNegative ? "📉" : "📊",
      label: allPositive ? (
        <>
          sentiment momentum <b className="text-pos">positive</b> across all {markets.length}
        </>
      ) : (
        <>
          sentiment momentum <b className="text-ink-1">mixed</b>
        </>
      ),
    });
  }
  return out;
}

function deriveKpis(markets: Country[]) {
  if (markets.length === 0) return null;
  const largest = markets.reduce((a, b) => (b.gdp_usd_b > a.gdp_usd_b ? b : a));
  const fastest = markets.reduce((a, b) => (b.gdp_growth > a.gdp_growth ? b : a));
  const infls = markets
    .map((m) => m.inflation)
    .filter((v): v is number => v != null);
  const avgInfl = infls.length ? infls.reduce((s, v) => s + v, 0) / infls.length : null;
  const combined = markets.reduce((s, m) => s + m.gdp_usd_b, 0);
  return { largest, fastest, avgInfl, combined, count: markets.length };
}

function deriveCoverage(markets: Country[]) {
  return {
    markets: markets.length ? String(markets.length) : "—",
    regions: markets.length ? String(new Set(markets.map((m) => m.region)).size) : "—",
    year: markets.length && markets[0].data_year ? String(markets[0].data_year) : "—",
  };
}

function fmtGdp(b: number): string {
  return b >= 1000 ? `$${(b / 1000).toFixed(2)}T` : `$${Math.round(b)}B`;
}

function fmtPct(v: number, withSign = true): string {
  const sign = withSign && v > 0 ? "+" : "";
  return `${sign}${v.toFixed(1)}%`;
}

function CanvasMessage({ state }: { state: LoadState }) {
  const text =
    state === "loading"
      ? "Loading markets from IMF…"
      : state === "error"
        ? "Couldn't reach the IMF data service. Check your connection and reload."
        : "No market data available yet.";
  return (
    <div className="flex h-full items-center justify-center bg-bg-0 px-6 text-center text-[12px] text-ink-3">
      {text}
    </div>
  );
}

function CovItem({ n, l }: { n: string; l: string }) {
  return (
    <div className="flex flex-col gap-px">
      <span className="mono text-[16px] font-medium leading-tight tracking-[-0.2px] text-ink-1">
        {n}
      </span>
      <span className="text-[10px] uppercase tracking-[0.4px] text-ink-3">{l}</span>
    </div>
  );
}

function Seg({ options, active }: { options: string[]; active: number }) {
  return (
    <div className="flex rounded-md border border-rule bg-bg-0 p-0.5">
      {options.map((o, i) => (
        <button
          key={o}
          type="button"
          className={`rounded-sm px-2.5 py-1 text-[11px] ${i === active ? "bg-bg-2 text-ink-1" : "text-ink-3 hover:text-ink-2"}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
