import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { countrySlug, findCountry } from "@/lib/stubs/countries";
import { getSentimentISI } from "@/lib/stubs/sentimentISI";
import { topDrivers } from "@/lib/stubs/topDrivers";
import { FiltersPanel } from "@/components/shell/FiltersPanel";

interface PageProps {
  params: Promise<{ country: string }>;
}

// Two-series line chart — sentiment vs macro ISI, hand-drawn SVG to stay
// dep-light.
function DualSeries({
  data,
  keys,
}: {
  data: { date: string; sentiment_isi: number; macro_isi: number }[];
  keys: [
    { label: string; color: string; key: "sentiment_isi" | "macro_isi" },
    { label: string; color: string; key: "sentiment_isi" | "macro_isi" },
  ];
}) {
  const w = 700;
  const h = 240;
  const x = (i: number) => (i / (data.length - 1)) * (w - 32) + 16;
  const y = (v: number) => h - 30 - (v / 100) * (h - 50);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-[240px] w-full">
      {[0, 25, 50, 75, 100].map((v) => (
        <g key={v}>
          <line x1={16} x2={w - 16} y1={y(v)} y2={y(v)} stroke="var(--rule)" strokeDasharray="2 3" />
          <text x={4} y={y(v) + 3} fill="var(--ink-3)" fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      {keys.map((k) => (
        <path
          key={k.key}
          d={data.map((d, i) => (i === 0 ? "M" : "L") + x(i) + "," + y(d[k.key])).join(" ")}
          fill="none"
          stroke={k.color}
          strokeWidth={1.8}
        />
      ))}
      {data.map((d, i) =>
        i % 2 === 0 ? (
          <text key={d.date} x={x(i)} y={h - 8} fill="var(--ink-3)" fontSize={9} textAnchor="middle">
            {d.date.slice(5)}
          </text>
        ) : null,
      )}
    </svg>
  );
}

export default async function SentimentISIPage({ params }: PageProps) {
  const { country: countryParam } = await params;
  const country = findCountry(countryParam);
  if (!country) notFound();

  const series = getSentimentISI(country.code);
  const latest = series[series.length - 1];
  const first = series[0];
  const dSent = latest.sentiment_isi - first.sentiment_isi;
  const dMacro = latest.macro_isi - first.macro_isi;

  return (
    <>
      <FiltersPanel />
      <main className="min-w-0 flex-1 overflow-y-auto bg-bg-0">
        {/* Header strip */}
        <div className="border-b border-rule bg-bg-1 px-[22px] py-3">
          <Link
            href="/dashboard"
            className="mb-2 inline-flex items-center gap-1.5 text-[11px] text-ink-3 hover:text-ink-1"
          >
            <ArrowLeft size={11} /> Back to dashboard
          </Link>
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="mono mb-1 text-[10.5px] uppercase tracking-[0.4px] text-ink-3">
                {country.iso3} · {country.region}
              </div>
              <h1 className="text-[26px] font-semibold tracking-tight">
                {country.name}
              </h1>
              <p className="mt-0.5 text-[12px] text-ink-2">
                Sentiment ISI vs Macro ISI — 14-day rolling. Sectors in coverage: {country.sectors.join(", ")}.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge label="Sentiment" value={latest.sentiment_isi} />
              <Badge label="Macro" value={latest.macro_isi} />
              <Link
                href={`/country-brief/${countrySlug(country)}`}
                className="inline-flex items-center gap-1.5 rounded-md border border-rule bg-bg-2 px-2.5 py-1.5 text-[12px] text-ink-1 hover:bg-bg-3"
              >
                <FileText size={12} /> View brief
              </Link>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-2">
          <Panel
            title="Sentiment ISI"
            sub={`${latest.sentiment_isi}`}
            delta={dSent}
          >
            <DualSeries
              data={series}
              keys={[
                { label: "Sentiment ISI", color: "var(--brand)", key: "sentiment_isi" },
                { label: "Macro ISI", color: "var(--pos)", key: "macro_isi" },
              ]}
            />
          </Panel>
          <Panel title="Macro ISI" sub={`${latest.macro_isi}`} delta={dMacro}>
            <DualSeries
              data={series}
              keys={[
                { label: "Macro ISI", color: "var(--pos)", key: "macro_isi" },
                { label: "Sentiment ISI", color: "var(--brand)", key: "sentiment_isi" },
              ]}
            />
          </Panel>
        </div>

        {/* Top drivers — local subset */}
        <div className="px-4 pb-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[12px] font-medium uppercase tracking-[0.6px] text-ink-3">
              Top drivers — {country.name}
            </h2>
            <Link href="/sentiment-pulse" className="text-[11px] text-ink-3 hover:text-brand">
              View Sentiment Pulse →
            </Link>
          </div>
          <ul className="space-y-2">
            {topDrivers.map((d) => (
              <li
                key={d.id}
                className="rounded-md border border-rule bg-bg-1 px-4 py-3 hover:bg-bg-2"
              >
                <div className="flex items-baseline gap-2">
                  <span
                    className={`mono rounded border px-1 py-px text-[9.5px] ${
                      d.source_tier === "t1"
                        ? "border-[var(--accent)] text-[var(--accent)]"
                        : "border-rule text-ink-3"
                    }`}
                  >
                    {d.source_tier.toUpperCase()}
                  </span>
                  <span className="text-[12px] font-medium text-ink-1">{d.title}</span>
                  <span
                    className={`mono ml-auto text-[11px] ${d.sentiment_score >= 0 ? "text-pos" : "text-neg"}`}
                  >
                    {d.sentiment_score >= 0 ? "+" : ""}
                    {d.sentiment_score.toFixed(2)}
                  </span>
                </div>
                <p className="mt-1 text-[11.5px] leading-snug text-ink-2">{d.snippet}</p>
                <div className="mt-2 flex items-center gap-2 text-[10.5px] text-ink-3">
                  <span>{d.source}</span>
                  <span>·</span>
                  <span className="mono">{new Date(d.published_at).toLocaleString(undefined, { dateStyle: "short" })}</span>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-ink-3">Contribution</span>
                    <span className="block h-1 w-24 overflow-hidden rounded-sm bg-bg-3">
                      <span
                        className="block h-full bg-brand"
                        style={{ width: `${Math.round(d.contribution_weight * 100)}%` }}
                      />
                    </span>
                    <span className="mono text-ink-2">{Math.round(d.contribution_weight * 100)}%</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}

function Badge({ label, value }: { label: string; value: number }) {
  const tone = value >= 65 ? "pos" : value >= 50 ? "brand" : "neg";
  const toneClass =
    tone === "pos"
      ? "border-pos/40 bg-[oklch(0.32_0.06_175)] text-pos"
      : tone === "neg"
        ? "border-neg/40 bg-[oklch(0.30_0.08_30)] text-neg"
        : "border-brand/40 bg-[var(--brand-soft)] text-brand";
  return (
    <span className={`mono inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] ${toneClass}`}>
      <span className="opacity-75">{label}</span>
      <span className="font-medium">{value}</span>
    </span>
  );
}

function Panel({
  title,
  sub,
  delta,
  children,
}: {
  title: string;
  sub: string;
  delta: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-rule bg-bg-1 p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-[12px] font-medium uppercase tracking-[0.6px] text-ink-3">{title}</h3>
        <div className="mono text-[11.5px] text-ink-2">
          {sub}{" "}
          <span className={delta >= 0 ? "text-pos" : "text-neg"}>
            ({delta >= 0 ? "+" : ""}
            {delta.toFixed(1)})
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}
