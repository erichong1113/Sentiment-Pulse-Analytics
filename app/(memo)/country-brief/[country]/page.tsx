import Link from "next/link";
import { notFound } from "next/navigation";
import { findCountry, countries } from "@/lib/stubs/countries";

interface PageProps {
  params: Promise<{ country: string }>;
}

// Tier copy mirrors the IC-memo mockup. Tier A = Allocate, Tier B = Hold/UW.
function tierFor(isi: number): "A" | "B" {
  return isi >= 70 ? "A" : "B";
}

// Tiny inline sparkline — borrowed from the mockup's `makeSpark`.
function Spark({ values, tone }: { values: number[]; tone: "pos" | "neg" }) {
  const w = 240,
    h = 36;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 6) - 3;
    return [x, y] as const;
  });
  const path = pts
    .map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1))
    .join(" ");
  const last = pts[pts.length - 1];
  const color = tone === "pos" ? "oklch(0.40 0.09 190)" : "oklch(0.46 0.15 35)";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-9 w-full">
      <path d={path} fill="none" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={2.4} fill={color} />
    </svg>
  );
}

export default async function CountryBriefPage({ params }: PageProps) {
  const { country: countryParam } = await params;
  const focus = findCountry(countryParam);
  if (!focus) notFound();

  // Top 5 movers — for the IC memo we want the focused country plus a curated
  // mix of movers. Order by absolute 1W move.
  const movers = [...countries]
    .sort((a, b) => Math.abs(b.perf_1w) - Math.abs(a.perf_1w))
    .slice(0, 5);

  return (
    <>
      {/* Document toolbar */}
      <div className="sticky top-0 z-10 -mx-7 mb-4 flex items-center gap-3.5 border-b border-rule bg-bg-0 px-7 py-2.5">
        <div className="flex items-center gap-2 text-[13.5px] font-semibold">
          <span className="grid h-[22px] w-[22px] place-items-center rounded-[5px] bg-ink-1 text-[11px] font-extrabold text-bg-0">
            K
          </span>
          Kilwa<span className="font-medium text-ink-3">.io</span>
        </div>
        <span className="text-ink-3">›</span>
        <span className="text-[12px] text-ink-2">
          Memos /{" "}
          <strong className="font-medium text-ink-1">
            {focus.name} Brief · Wk 19 / 2026
          </strong>
        </span>
        <div className="flex-1" />
        <div className="flex rounded-md border border-rule-2 bg-bg-1 p-0.5">
          <button className="rounded-sm px-2.5 py-1 text-[11px] text-ink-3">Monitor</button>
          <button className="rounded-sm bg-bg-0 px-2.5 py-1 text-[11px] text-ink-1 shadow-[0_0_0_1px_var(--rule-2)]">
            Memo
          </button>
        </div>
        <button className="rounded-md border border-rule-2 bg-bg-0 px-2.5 py-1 text-[11.5px] text-ink-1">
          Export PDF
        </button>
        <button className="rounded-md border border-rule-2 bg-bg-0 px-2.5 py-1 text-[11.5px] text-ink-1">
          Send to IC
        </button>
        <Link
          href="/dashboard"
          className="rounded-md border border-ink-1 bg-ink-1 px-2.5 py-1 text-[11.5px] text-bg-0"
        >
          ＋ Add country
        </Link>
      </div>

      {/* Document */}
      <article className="mx-auto max-w-[1080px] rounded border border-rule bg-bg-0 px-16 pb-[72px] pt-14 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        <div className="text-[10.5px] font-semibold uppercase tracking-[1.4px] text-brand">
          Investment Committee · Internal · Draft v3
        </div>
        <h1 className="serif mb-1.5 mt-2 text-[38px] font-semibold leading-[1.1] tracking-[-1px] text-ink-1">
          {focus.name} Brief — 11 May 2026
        </h1>
        <p className="max-w-[720px] text-[14px] leading-[1.5] text-ink-2">
          IC-grade read on {focus.name} ({focus.iso3}, {focus.region}). Captures 1W shifts and the model-derived view at the
          live ISI v2.3 read. All figures USD-denominated unless flagged.
        </p>

        {/* Meta strip */}
        <div className="mt-4 grid grid-cols-5 gap-4 border-y border-rule py-3 text-[11.5px]">
          {[
            ["As of", "11 May 2026 · 14:22 UTC"],
            ["Model", "ISI v2.3 · METI v1.4"],
            ["Confidence", "0.87"],
            ["Sources", "14 active · 9 primary"],
            ["Author", "R. Thiongo · Zawadi AI"],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="mb-1 text-[10px] uppercase tracking-[0.4px] text-ink-3">{k}</div>
              <div className="mono text-[12.5px] text-ink-1">{v}</div>
            </div>
          ))}
        </div>

        {/* Executive summary */}
        <section className="mt-9">
          <h2 className="serif text-[20px] font-semibold tracking-[-0.3px]">
            Executive summary
          </h2>
          <p className="mb-3.5 text-[11.5px] text-ink-3">Three takeaways for the committee.</p>
          <div className="rounded border border-l-[3px] border-rule border-l-brand bg-bg-1 px-5 py-4">
            <p className="max-w-[800px] text-[13.5px] leading-[1.65]">
              <strong>{focus.region} leads on conviction.</strong>{" "}
              {focus.name} prints an ISI of{" "}
              <Pill>{focus.iso3} {focus.isi_score} / 100</Pill>, the {focus.isi_score >= 70 ? "highest" : "tier-B"} read in our universe.
              1W performance is{" "}
              <Pill tone={focus.perf_1w >= 0 ? "pos" : "neg"}>
                {focus.perf_1w >= 0 ? "+" : ""}
                {focus.perf_1w.toFixed(2)}%
              </Pill>{" "}
              vs. region average. We recommend a Tier {tierFor(focus.isi_score)} stance.
            </p>
            <p className="mt-2.5 text-[13.5px] leading-[1.65]">
              <strong>Sector flows constructive.</strong> Energy &amp; fintech announcements compounded; renewables capex pipeline expanded by{" "}
              <Pill>$4.2B</Pill> across the region this week. Sector mix favours allocation into{" "}
              {focus.sectors.slice(0, 2).join(" and ")}.
            </p>
            <p className="mt-2.5 text-[13.5px] leading-[1.65]">
              <strong>Watch:</strong> central-bank decisions (15 May), sovereign restructuring read-outs late May, and the upcoming Eurobond
              rollover window in Q3 are the most material near-term catalysts.
            </p>
          </div>
        </section>

        {/* Universe at a glance */}
        <section className="mt-9">
          <h2 className="serif text-[20px] font-semibold tracking-[-0.3px]">
            Universe at a glance
          </h2>
          <p className="mb-3.5 text-[11.5px] text-ink-3">
            1W, GDP-weighted, 36 of 39 markets included.
          </p>
          <div className="grid grid-cols-4 gap-3.5">
            <Stat k="Top performer · 1W" v="KEN +2.30" unit="%" tone="pos" sub="East Africa · ▲ 2.30 vs. region 0.42" foot="USD index · vs. prior-week close" />
            <Stat k="Universe average · 1W" v="+0.62" unit="%" sub="36 markets, GDP-weighted" foot="Excludes ZWE, SSD, ERI" />
            <Stat k="Highest vol · σ" v="ZAF 3.21" unit="σ" tone="neg" sub="▼ 3.33 · 2 SD from 90d mean" foot="Realized 1W vol, USD terms" />
            <Stat k="Active ISI signals ≥ 70" v="14" unit=" / 39" sub="▲ 3 new since yesterday · 36% coverage" foot="Threshold configurable" />
          </div>
        </section>

        {/* Country briefs */}
        <section className="mt-9">
          <h2 className="serif text-[20px] font-semibold tracking-[-0.3px]">
            Country briefs
          </h2>
          <p className="mb-3.5 text-[11.5px] text-ink-3">
            Top movers, ordered by 1W absolute move. Hover any line in the live dashboard for the full source set.
          </p>
          <div className="flex flex-col gap-3.5">
            {movers.map((m) => {
              const tier = tierFor(m.isi_score);
              const hist = Array.from({ length: 14 }, (_, i) => {
                const t = i / 13;
                return m.perf_1w * (0.4 + 0.6 * t) + Math.sin(i * 1.6) * 0.4 - 0.1;
              });
              return (
                <div
                  key={m.code}
                  className="grid grid-cols-[200px_1fr_260px] gap-[22px] rounded-md border border-rule bg-bg-0 px-5 py-4"
                >
                  <div>
                    <div className="mono text-[10.5px] tracking-[0.4px] text-ink-3">
                      {m.iso3} · {m.region}
                    </div>
                    <div className="serif my-1 text-[22px] font-semibold leading-[1.1] tracking-[-0.3px]">
                      {m.name}
                    </div>
                    <div className="mb-3 text-[11px] text-ink-3">{m.sectors.slice(0, 3).join(" · ")}</div>
                    <span
                      className={
                        tier === "A"
                          ? "inline-block rounded border border-[oklch(0.85_0.06_65)] bg-[var(--brand-soft)] px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.4px] text-brand"
                          : "inline-block rounded border border-rule-2 bg-bg-1 px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.4px] text-ink-2"
                      }
                    >
                      Tier {tier} · {tier === "A" ? "Allocate" : "Hold / Underweight"}
                    </span>
                  </div>
                  <div>
                    <p className="max-w-[580px] text-[12.5px] leading-[1.6]">
                      {m.name} prints an ISI of{" "}
                      <Pill>{m.isi_score}/100</Pill>. 1W performance{" "}
                      <Pill tone={m.perf_1w >= 0 ? "pos" : "neg"}>
                        {m.perf_1w >= 0 ? "+" : ""}
                        {m.perf_1w.toFixed(2)}%
                      </Pill>{" "}
                      against a regional average of 0.42%. Sector tilt: {m.sectors.slice(0, 2).join(", ")}.
                    </p>
                    <p className="mt-1.5 text-[12.5px] leading-[1.6]">
                      Watch: macro-political calendar for {m.region}, upcoming policy decisions, and FX band stability.
                    </p>
                    <div className="mono mt-2.5 text-[10px] text-ink-3">
                      Sources: CBK · IMF Art. IV · Reuters · Internal
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <Spark values={hist} tone={m.perf_1w >= 0 ? "pos" : "neg"} />
                    <DataRow k="1W perf" v={`${m.perf_1w >= 0 ? "+" : ""}${m.perf_1w.toFixed(2)}%`} tone={m.perf_1w >= 0 ? "pos" : "neg"} />
                    <DataRow k="ISI" v={`${m.isi_score} / 100`} />
                    <DataRow k="GDP (USD)" v={`$${m.gdp_estimate_usd_b}B`} />
                    <div>
                      <div className="h-1.5 overflow-hidden rounded-sm bg-bg-2">
                        <div
                          className={tier === "B" ? "h-full bg-ink-2" : "h-full bg-brand"}
                          style={{ width: `${m.isi_score}%` }}
                        />
                      </div>
                      <div className="mono mt-1 flex justify-between text-[9.5px] text-ink-3">
                        <span>0</span><span>40</span><span>60</span><span>80</span><span>100</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footnotes */}
        <section className="mt-7 border-t border-rule pt-3.5 text-[10.5px] leading-[1.6] text-ink-3">
          <Foot k="Methodology">
            ISI v2.3 — weights: macro 30%, political 25%, FX stability 20%, capital depth 15%, ESG 10%. USD-denominated. 1W rolling unless stated.
          </Foot>
          <Foot k="Coverage">39 markets · 8 sectors · 12 currencies · 4 sovereign risk indices.</Foot>
          <Foot k="Confidence">
            Aggregate confidence 0.87 from 14 active sources (CBK, NSE, IMF, World Bank, AfDB, JSE, FT, Reuters, internal models).
          </Foot>
          <Foot k="Disclosure">
            For Kilwa premium subscribers only. Not investment advice. Methodology and version history available in Settings → Models.
          </Foot>
        </section>
      </article>
    </>
  );
}

function Pill({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone?: "pos" | "neg";
}) {
  const toneClass =
    tone === "pos"
      ? "text-pos-deep border-[oklch(0.80_0.05_185)]"
      : tone === "neg"
        ? "text-neg-deep border-[oklch(0.82_0.06_40)]"
        : "text-ink-1 border-rule-2";
  return (
    <span
      className={`mono inline-block rounded-[3px] border bg-bg-0 px-1.5 py-px text-[11px] font-medium ${toneClass}`}
    >
      {children}
    </span>
  );
}

function Stat({
  k,
  v,
  unit,
  sub,
  foot,
  tone,
}: {
  k: string;
  v: string;
  unit?: string;
  sub?: React.ReactNode;
  foot?: React.ReactNode;
  tone?: "pos" | "neg";
}) {
  return (
    <div className="rounded-md border border-rule bg-bg-0 px-4 py-3.5">
      <div className="text-[10px] uppercase tracking-[0.4px] text-ink-3">{k}</div>
      <div
        className={`mono mt-1 text-[22px] font-medium tracking-[-0.4px] ${
          tone === "pos" ? "text-pos-deep" : tone === "neg" ? "text-neg-deep" : ""
        }`}
      >
        {v}
        {unit ? <span className="ml-1 text-[12px] font-normal text-ink-3">{unit}</span> : null}
      </div>
      {sub ? <div className="mt-1 text-[11px] text-ink-2">{sub}</div> : null}
      {foot ? (
        <div className="mt-2 border-t border-dashed border-rule pt-1.5 text-[10px] text-ink-3">
          {foot} · <span className="dotted-u">method</span>
        </div>
      ) : null}
    </div>
  );
}

function DataRow({
  k,
  v,
  tone,
}: {
  k: string;
  v: string;
  tone?: "pos" | "neg";
}) {
  const toneClass = tone === "pos" ? "text-pos-deep" : tone === "neg" ? "text-neg-deep" : "text-ink-1";
  return (
    <div className="flex justify-between border-b border-dashed border-rule pb-1.5 text-[11px]">
      <span className="text-ink-3">{k}</span>
      <span className={`mono ${toneClass}`}>{v}</span>
    </div>
  );
}

function Foot({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="mb-1 flex gap-3.5">
      <b className="min-w-[78px] font-medium text-ink-2">{k}</b>
      <span>{children}</span>
    </div>
  );
}
