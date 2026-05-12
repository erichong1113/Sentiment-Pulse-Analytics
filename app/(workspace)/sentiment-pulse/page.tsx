import Link from "next/link";
import { ChevronRight, Sparkles, Pin, Bell, ExternalLink } from "lucide-react";
import { topDrivers } from "@/lib/stubs/topDrivers";
import { countries } from "@/lib/stubs/countries";

// Page-local sparkline — small SVG, no dep on d3 or recharts.
function MiniSpark({
  values,
  tone,
  height = 28,
}: {
  values: number[];
  tone: "pos" | "neg" | "neutral";
  height?: number;
}) {
  const w = 100;
  const h = height;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const d = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1);
    })
    .join(" ");
  const color =
    tone === "pos" ? "var(--pos)" : tone === "neg" ? "var(--neg)" : "var(--ink-3)";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-full w-full">
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}

export default function SentimentPulsePage() {
  // Top 6 countries for the per-country gauge list.
  const gaugeCountries = countries.slice(0, 6);
  const sectors = [
    { name: "Energy & Renewables", pos: 62, neu: 28, neg: 10, net: 52, spark: [4, 8, 6, 10, 14, 18, 22] },
    { name: "Technology & Fintech", pos: 71, neu: 22, neg: 7, net: 64, spark: [10, 12, 16, 14, 18, 22, 28] },
    { name: "Infrastructure", pos: 48, neu: 36, neg: 16, net: 32, spark: [2, 4, 6, 5, 8, 10, 12] },
    { name: "Mining & Metals", pos: 41, neu: 30, neg: 29, net: 12, spark: [16, 14, 10, 12, 8, 6, 4] },
    { name: "Agriculture", pos: 54, neu: 31, neg: 15, net: 39, spark: [6, 8, 10, 9, 12, 14, 16] },
    { name: "Financial Markets", pos: 36, neu: 38, neg: 26, net: 10, spark: [10, 12, 8, 10, 7, 5, 4] },
  ];
  const keywords = [
    { w: "Eurobond", sz: 22, t: "pos" as const },
    { w: "M-PESA", sz: 18, t: "pos" as const },
    { w: "Tinubu", sz: 16, t: "neu" as const },
    { w: "SARB", sz: 19, t: "neg" as const },
    { w: "green hydrogen", sz: 17, t: "pos" as const },
    { w: "FX shortage", sz: 15, t: "neg" as const },
    { w: "AfCFTA", sz: 14, t: "pos" as const },
    { w: "drought", sz: 13, t: "neg" as const },
    { w: "IPO pipeline", sz: 16, t: "pos" as const },
    { w: "default risk", sz: 14, t: "neg" as const },
    { w: "fintech licensing", sz: 15, t: "pos" as const },
    { w: "coalition", sz: 14, t: "neg" as const },
  ];
  const alerts = [
    { state: "met", label: "NSI > 60 sustained 24h", value: "fired 02:14 UTC" },
    { state: "armed", label: "ZAF NSI < 30", value: "armed · 14d" },
    { state: "armed", label: "Negative-news spike +2σ", value: "armed" },
    { state: "idle", label: "EUR/USD vol > 1σ", value: "idle" },
  ];

  return (
    <>
      {/* No FiltersPanel here — Sentiment Pulse has its own filter bar at top */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Filter bar */}
        <div className="flex h-[46px] shrink-0 items-center gap-3 overflow-x-auto border-b border-rule bg-bg-1 px-[22px]">
          <span className="text-[10px] uppercase tracking-[0.6px] text-ink-3">Scenario</span>
          <Pill on>Base</Pill>
          <Pill>Stress</Pill>
          <span className="ml-2 text-[10px] uppercase tracking-[0.6px] text-ink-3">Countries</span>
          {["KEN", "NGA", "ZAF", "EGY", "MAR", "GHA"].map((c) => (
            <Pill key={c} dot>{c}</Pill>
          ))}
          <span className="ml-2 text-[10px] uppercase tracking-[0.6px] text-ink-3">Range</span>
          {["1W", "1M", "3M", "6M"].map((r, i) => (
            <Pill key={r} on={i === 1}>{r}</Pill>
          ))}
          <span className="ml-2 text-[10px] uppercase tracking-[0.6px] text-ink-3">Source</span>
          {["All", "Tier-1", "Local", "Regulator", "Social"].map((s, i) => (
            <Pill key={s} on={i === 0}>{s}</Pill>
          ))}
        </div>

        {/* 3-column body */}
        <div className="grid min-h-0 flex-1 grid-cols-[288px_1fr_304px] overflow-hidden">
          {/* LEFT */}
          <aside className="overflow-y-auto border-r border-rule bg-bg-1 p-4">
            {/* NSI Card */}
            <Card>
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-[10px] uppercase tracking-[0.6px] text-ink-3">Net Sentiment Index</span>
                <span className="rounded-full border border-[oklch(0.36_0.08_175)] bg-[oklch(0.32_0.06_175)] px-2 py-0.5 mono text-[10px] text-pos">
                  ▲ +4.2
                </span>
              </div>
              <div className="mono mt-1 text-[42px] font-medium leading-none tracking-[-1px] text-ink-1">
                +18.4<span className="ml-1 text-[14px] text-ink-3">/100</span>
              </div>
              <div className="mt-1 text-[10.5px] text-ink-3">
                Formula: weighted (pos − neg) × tier × decay · 28-day rolling
              </div>
              <div className="my-3 h-8">
                <MiniSpark
                  values={[14, 16, 18, 17, 19, 22, 20, 18, 21, 24, 26, 22, 23, 18]}
                  tone="pos"
                  height={32}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 border-t border-dashed border-rule pt-2.5 mono text-[10px]">
                <Kv k="vol" v="2.1σ" />
                <Kv k="ŝ" v="0.74" />
                <Kv k="n" v="11,427" />
              </div>
            </Card>

            {/* Mini KPIs */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <MiniKpi label="Positive share" value="62.4%" delta="+1.8" tone="pos" />
              <MiniKpi label="Negative alerts" value="14" delta="+3" tone="neg" />
              <MiniKpi label="Source diversity" value="0.71" sub="11 active" />
              <MiniKpi label="Median latency" value="4.2m" sub="P50" />
            </div>

            {/* Source mix */}
            <SectionHead>Source mix · 28d</SectionHead>
            <Card>
              <div className="flex h-2 overflow-hidden rounded-sm">
                <span className="block bg-brand" style={{ width: "32%" }} />
                <span className="block bg-pos" style={{ width: "22%" }} />
                <span className="block bg-[var(--accent)]" style={{ width: "18%" }} />
                <span className="block bg-ink-3" style={{ width: "16%" }} />
                <span className="block bg-neg" style={{ width: "12%" }} />
              </div>
              <ul className="mt-3 space-y-1.5 text-[11px]">
                {[
                  ["Tier-1 newswire", 32, "var(--brand)"],
                  ["Regulator / CB", 22, "var(--pos)"],
                  ["Local press", 18, "var(--accent)"],
                  ["Research / model", 16, "var(--ink-3)"],
                  ["Social / unranked", 12, "var(--neg)"],
                ].map(([n, p, c]) => (
                  <li key={n as string} className="flex items-center gap-2 text-ink-2">
                    <span className="h-2 w-2 rounded-sm" style={{ background: c as string }} />
                    <span className="flex-1">{n}</span>
                    <span className="mono text-ink-3">{p}%</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Country gauges */}
            <SectionHead>By country · ISI linked</SectionHead>
            <div className="space-y-1.5">
              {gaugeCountries.map((c) => {
                const pos = 40 + Math.round(c.isi_score / 3);
                const neg = 100 - pos - 25;
                const tone = c.perf_1w >= 0 ? "pos" : "neg";
                return (
                  <Link
                    key={c.code}
                    href={`/sentiment-isi/${c.iso3.toLowerCase()}`}
                    className="block rounded-md border border-rule bg-bg-2 p-2.5 hover:border-rule-2"
                  >
                    <div className="mb-1.5 flex items-center justify-between text-[11.5px]">
                      <span className="font-medium text-ink-1">{c.name}</span>
                      <span className="flex items-center gap-1.5">
                        <span className={`mono text-[10.5px] ${tone === "pos" ? "text-pos" : "text-neg"}`}>
                          {c.perf_1w >= 0 ? "+" : ""}
                          {c.perf_1w.toFixed(2)}
                        </span>
                        <ChevronRight size={11} className="text-ink-3" />
                      </span>
                    </div>
                    <div className="flex h-1.5 overflow-hidden rounded-sm">
                      <span className="block bg-pos" style={{ width: `${pos}%` }} />
                      <span className="block bg-ink-3" style={{ width: `${25}%` }} />
                      <span className="block bg-neg" style={{ width: `${neg}%` }} />
                    </div>
                    <div className="mono mt-1 flex justify-between text-[9.5px] text-ink-3">
                      <span>{pos}% pos</span>
                      <span>{neg}% neg</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* CENTER */}
          <div className="overflow-y-auto bg-bg-0">
            <Card className="m-4">
              <div className="mb-3 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.6px] text-ink-3">Net sentiment trend</span>
                  <div className="text-[12px] text-ink-2">Multi-country · 28-day rolling · 80% confidence band</div>
                </div>
                <div className="flex gap-3 text-[11px] text-ink-3">
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" defaultChecked className="accent-[var(--brand)]" /> Confidence
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" defaultChecked className="accent-[var(--brand)]" /> Events
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" defaultChecked className="accent-[var(--brand)]" /> Volume
                  </label>
                </div>
              </div>
              {/* Simplified multi-line chart */}
              <TrendChart />
            </Card>

            {/* News flow grid */}
            <div className="grid grid-cols-2 gap-3 px-4 pb-4">
              <NewsFlow tone="pos" title="Positive flow" items={topDrivers.filter((d) => d.sentiment_score > 0)} />
              <NewsFlow tone="neg" title="Negative flow" items={topDrivers.filter((d) => d.sentiment_score <= 0)} />
            </div>
          </div>

          {/* RIGHT */}
          <aside className="overflow-y-auto border-l border-rule bg-bg-1 p-4">
            <SectionHead className="mt-0">Sector sentiment</SectionHead>
            <ul className="space-y-2">
              {sectors.map((s) => (
                <li key={s.name} className="rounded-md border border-rule bg-bg-2 px-2.5 py-2">
                  <div className="mb-1 flex items-baseline justify-between text-[11.5px]">
                    <span className="text-ink-1">{s.name}</span>
                    <span className={`mono text-[10.5px] ${s.net >= 0 ? "text-pos" : "text-neg"}`}>
                      {s.net >= 0 ? "+" : ""}{s.net}
                    </span>
                  </div>
                  <div className="flex h-1.5 overflow-hidden rounded-sm">
                    <span className="block bg-pos" style={{ width: `${s.pos}%` }} />
                    <span className="block bg-ink-3" style={{ width: `${s.neu}%` }} />
                    <span className="block bg-neg" style={{ width: `${s.neg}%` }} />
                  </div>
                  <div className="mt-1 h-5">
                    <MiniSpark values={s.spark} tone={s.net >= 0 ? "pos" : "neg"} height={20} />
                  </div>
                </li>
              ))}
            </ul>

            <SectionHead>Keyword cloud</SectionHead>
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((k) => {
                const toneClass =
                  k.t === "pos"
                    ? "border-[oklch(0.36_0.08_175)] bg-[oklch(0.32_0.06_175)] text-pos"
                    : k.t === "neg"
                      ? "border-[oklch(0.40_0.10_30)] bg-[oklch(0.30_0.08_30)] text-neg"
                      : "border-rule bg-bg-2 text-ink-2";
                return (
                  <span
                    key={k.w}
                    className={`mono inline-block rounded-md border px-2 py-0.5 ${toneClass}`}
                    style={{ fontSize: `${k.sz * 0.55}px` }}
                  >
                    {k.w}
                  </span>
                );
              })}
            </div>

            <SectionHead>Zawadi take</SectionHead>
            <Card accent>
              <div className="mb-1 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.6px] text-[var(--accent)]">
                <Sparkles size={11} />
                Drafted by Zawadi · conf 0.83
              </div>
              <p className="text-[12.5px] leading-[1.55] text-ink-1">
                Net sentiment is being lifted by{" "}
                <Cite>S1</Cite> fintech licensing in NGA/KEN/GHA and{" "}
                <Cite>S2</Cite> renewables capex in EGY/MAR. The drag is concentrated in ZAF coalition risk; if{" "}
                <Cite>S3</Cite> the 15 May SARB read tilts hawkish, expect a 1.5–2σ widening in JSE rand-hedge names.
              </p>
              <div className="mt-2.5 rounded-md border border-dashed border-rule-2 p-2 text-[11px] text-ink-3">
                <span className="font-medium text-ink-2">Steel-man · opposite case:</span>{" "}
                A SARB hold + soft US CPI print would flip the signal pos by week-end; we&apos;d need a coalition compromise on the budget for that
                pathway to be base case.
              </div>
              <div className="mt-2.5 flex gap-2">
                <button className="rounded-md border border-rule-2 bg-bg-1 px-2 py-1 text-[10.5px] text-ink-1">
                  Draft memo
                </button>
                <button className="rounded-md border border-rule-2 bg-bg-1 px-2 py-1 text-[10.5px] text-ink-1">
                  Open thread
                </button>
              </div>
            </Card>

            <SectionHead>Alerts &amp; triggers</SectionHead>
            <ul className="space-y-1.5">
              {alerts.map((a) => {
                const stateColor =
                  a.state === "met"
                    ? "var(--pos)"
                    : a.state === "armed"
                      ? "var(--brand)"
                      : "var(--ink-3)";
                return (
                  <li
                    key={a.label}
                    className="flex items-center gap-2 rounded-md border border-rule bg-bg-2 px-2.5 py-1.5 text-[11px]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: stateColor }} />
                    <span className="flex-1 text-ink-2">{a.label}</span>
                    <span className="mono text-[10px] text-ink-3">{a.value}</span>
                  </li>
                );
              })}
              <li>
                <button className="w-full rounded-md border border-dashed border-rule-2 px-2.5 py-1.5 text-[11px] text-ink-3 hover:border-brand hover:text-brand">
                  ＋ New trigger
                </button>
              </li>
            </ul>

            <SectionHead>Sentiment ↔ KEN 10Y spread</SectionHead>
            <Card>
              <div className="h-12">
                <DualSpark />
              </div>
              <div className="mt-2 flex justify-between mono text-[10px] text-ink-3">
                <span>ρ = −0.74</span>
                <span>lead 3.2d</span>
                <span className="text-[var(--accent)]">overlay →</span>
              </div>
            </Card>
          </aside>
        </div>
      </main>
    </>
  );
}

// Local primitives below — kept inline because they're not reusable across the
// app yet. If sentiment-pulse-style cards spread to other pages we'll lift.

function Card({
  children,
  className = "",
  accent,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border bg-bg-2 px-3 py-3 ${
        accent ? "border-[var(--accent)]/40 bg-[oklch(0.26_0.05_270)]" : "border-rule"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function SectionHead({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mb-2 mt-4 text-[10px] font-semibold uppercase tracking-[0.6px] text-ink-3 ${className}`}
    >
      {children}
    </div>
  );
}

function MiniKpi({
  label,
  value,
  delta,
  sub,
  tone,
}: {
  label: string;
  value: string;
  delta?: string;
  sub?: string;
  tone?: "pos" | "neg";
}) {
  const toneClass = tone === "pos" ? "text-pos" : tone === "neg" ? "text-neg" : "text-ink-1";
  return (
    <div className="rounded-md border border-rule bg-bg-2 px-2.5 py-2">
      <div className="text-[10px] text-ink-3">{label}</div>
      <div className={`mono mt-1 text-[18px] font-medium ${toneClass}`}>{value}</div>
      <div className="text-[10px] text-ink-3">
        {delta ? <span className={`mono ${toneClass}`}>{delta}</span> : sub}
      </div>
    </div>
  );
}

function Kv({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-ink-3">{k}</div>
      <div className="text-ink-1">{v}</div>
    </div>
  );
}

function Pill({
  children,
  on,
  dot,
}: {
  children: React.ReactNode;
  on?: boolean;
  dot?: boolean;
}) {
  return (
    <button
      type="button"
      className={`mono inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] ${
        on
          ? "border-brand bg-[var(--brand-soft)] text-ink-1"
          : "border-rule bg-bg-2 text-ink-2 hover:text-ink-1"
      }`}
    >
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-brand" /> : null}
      {children}
    </button>
  );
}

function Cite({ children }: { children: React.ReactNode }) {
  return (
    <span className="mono mx-px inline-block cursor-pointer rounded-sm border border-[var(--accent)]/40 bg-[var(--accent)]/20 px-1 py-px text-[9.5px] text-[var(--accent)]">
      {children}
    </span>
  );
}

function NewsFlow({
  tone,
  title,
  items,
}: {
  tone: "pos" | "neg";
  title: string;
  items: typeof topDrivers;
}) {
  const ribbon = tone === "pos" ? "border-pos/40 bg-[oklch(0.32_0.06_175)]/30" : "border-neg/40 bg-[oklch(0.30_0.08_30)]/40";
  return (
    <div className="rounded-md border border-rule bg-bg-1">
      <div className={`flex items-center gap-2 border-b border-rule px-3 py-2 ${ribbon}`}>
        <span className={`mono h-1.5 w-1.5 rounded-full ${tone === "pos" ? "bg-pos" : "bg-neg"}`} />
        <span className="text-[12px] font-medium text-ink-1">{title}</span>
        <span className="mono ml-auto text-[10px] text-ink-3">{items.length}</span>
      </div>
      <ul className="divide-y divide-rule">
        {items.length > 0 ? (
          items.map((d) => (
            <li key={d.id} className="px-3 py-2.5 text-[12px] hover:bg-bg-2">
              <div className="flex items-baseline gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: tone === "pos" ? "var(--pos)" : "var(--neg)" }} />
                <span className="flex-1 text-ink-1">{d.title}</span>
                <ExternalLink size={11} className="text-ink-3" />
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 pl-3.5 text-[10.5px] text-ink-3">
                <span className={`mono rounded border px-1.5 py-px text-[9.5px] ${d.source_tier === "t1" ? "border-[var(--accent)] text-[var(--accent)]" : "border-rule text-ink-3"}`}>
                  {d.source_tier.toUpperCase()}
                </span>
                <span>{d.source}</span>
                <span>·</span>
                <span className="mono">{new Date(d.published_at).toLocaleString(undefined, { dateStyle: "short" })}</span>
                <span className="mono ml-auto">conf {d.contribution_weight.toFixed(2)}</span>
              </div>
              <p className="mt-1.5 pl-3.5 text-[11px] leading-snug text-ink-2">{d.snippet}</p>
            </li>
          ))
        ) : (
          <li className="px-3 py-6 text-center text-[11px] text-ink-3">No items in window.</li>
        )}
      </ul>
    </div>
  );
}

function TrendChart() {
  // Three illustrative country series + confidence band + volume bars.
  const w = 720;
  const h = 220;
  const series = [
    { label: "KEN", color: "var(--brand)", data: [10, 14, 12, 18, 22, 26, 28, 32, 30, 34, 38, 42, 40, 44] },
    { label: "NGA", color: "var(--pos)", data: [8, 10, 14, 16, 20, 22, 24, 22, 26, 28, 30, 32, 34, 36] },
    { label: "ZAF", color: "var(--neg)", data: [16, 12, 10, 8, 6, 4, 2, -2, -6, -10, -14, -18, -20, -22] },
  ];

  const xs = (i: number) => (i / 13) * (w - 24) + 12;
  const ys = (v: number) => h - 30 - ((v + 25) / 70) * (h - 50);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-[220px] w-full">
      {/* horizontal grid */}
      {[0, 1, 2, 3, 4].map((g) => (
        <line
          key={g}
          x1={12}
          x2={w - 12}
          y1={20 + (g * (h - 50)) / 4}
          y2={20 + (g * (h - 50)) / 4}
          stroke="var(--rule)"
          strokeDasharray="2 3"
        />
      ))}
      {/* confidence band on series 0 */}
      <polygon
        fill="var(--brand)"
        fillOpacity={0.1}
        points={series[0].data
          .map((v, i) => `${xs(i)},${ys(v + 6)}`)
          .concat(series[0].data.slice().reverse().map((v, i) => `${xs(13 - i)},${ys(v - 6)}`))
          .join(" ")}
      />
      {/* event markers */}
      {[2, 6, 11].map((i) => (
        <circle key={i} cx={xs(i)} cy={ys(series[0].data[i])} r={3.2} fill="var(--ink-1)" stroke="var(--brand)" strokeWidth={1.2} />
      ))}
      {/* lines */}
      {series.map((s) => (
        <path
          key={s.label}
          d={s.data.map((v, i) => (i === 0 ? "M" : "L") + xs(i) + "," + ys(v)).join(" ")}
          fill="none"
          stroke={s.color}
          strokeWidth={1.8}
        />
      ))}
      {/* volume bars */}
      {series[0].data.map((_, i) => (
        <rect
          key={i}
          x={xs(i) - 4}
          y={h - 22}
          width={8}
          height={Math.abs((i - 6.5) * 1.4) + 4}
          fill="var(--rule-2)"
        />
      ))}
      {/* legend */}
      {series.map((s, i) => (
        <g key={s.label} transform={`translate(${20 + i * 70}, ${h - 4})`}>
          <rect width={10} height={2} fill={s.color} y={-3} />
          <text x={14} y={1} fill="var(--ink-2)" fontSize={10}>
            {s.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function DualSpark() {
  const w = 280;
  const h = 48;
  const sentiment = [10, 14, 16, 18, 22, 26, 24, 28, 32, 30];
  const spread = [22, 18, 14, 12, 10, 8, 10, 6, 4, 6];
  const xs = (i: number) => (i / 9) * (w - 4) + 2;
  const ysn = (v: number) => h - ((v - 0) / 36) * (h - 6) - 3;
  const yss = (v: number) => h - ((v - 0) / 36) * (h - 6) - 3;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-full w-full">
      <path
        d={sentiment.map((v, i) => (i === 0 ? "M" : "L") + xs(i) + "," + ysn(v)).join(" ")}
        fill="none"
        stroke="var(--pos)"
        strokeWidth={1.6}
      />
      <path
        d={spread.map((v, i) => (i === 0 ? "M" : "L") + xs(i) + "," + yss(v)).join(" ")}
        fill="none"
        stroke="var(--neg)"
        strokeWidth={1.6}
        strokeDasharray="3 2"
      />
    </svg>
  );
}

// Removed unused icon import-cleanup: Pin, Bell intentionally not rendered yet
// but reserved as they appear in the mockup's "+ pin / + bell" affordances.
void Pin;
void Bell;
