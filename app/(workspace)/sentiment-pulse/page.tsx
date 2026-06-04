"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";

// Sentiment Pulse — positive/negative news flow per country, plus the ISI trend
// (wired next). Data comes from our own server route, which queries the
// BigQuery `news_articles` table (filled by the teammates' scraper) server-side:
//
//   GET /api/sentiment/news?country=KE  →  { country, articles: NewsArticle[] }
//
// Credentials live only in the server route; the browser never touches BigQuery.

// Countries in scope. `id` is the BigQuery `country_id` value (ISO-2 upper).
const COUNTRIES = [
  { id: "KE", label: "Kenya" },
  { id: "NG", label: "Nigeria" },
  { id: "RW", label: "Rwanda" },
];

interface NewsArticle {
  id: string;
  title?: string;
  summary?: string;
  content?: string;
  source?: string;
  url?: string;
  published_at?: string;
  sentiment_score?: number;
  sentiment_label?: string;
  sentiment_confidence?: number;
  relevance_score?: number;
  topics?: string[];
}

interface IsiPoint {
  bucket_start: string | null;
  raw_score_100: number | null;
  ewma_score_100: number | null;
  article_count: number | null;
  volume_z: number | null;
  momentum: number | null;
}

interface IsiData {
  country: string;
  latest: IsiPoint | null;
  state: { model_version: string | null; last_ewma: number | null; updated_at: string | null } | null;
  series: IsiPoint[];
}

// Rows come from a table a third party can write to, so only trust http(s)
// links — this stops a tampered `javascript:` URL from ever becoming a live
// href. (React already escapes the text fields.)
function safeUrl(u?: string): string | undefined {
  if (!u) return undefined;
  try {
    const parsed = new URL(u);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.href
      : undefined;
  } catch {
    return undefined;
  }
}

type LoadState = "loading" | "ready" | "empty" | "error";

export default function SentimentPulsePage() {
  const [country, setCountry] = useState("KE");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [isi, setIsi] = useState<IsiData | null>(null);
  const [isiState, setIsiState] = useState<LoadState>("loading");

  const load = useCallback(async (c: string) => {
    setState("loading");
    try {
      const res = await fetch(
        `/api/sentiment/news?country=${encodeURIComponent(c)}`,
      );
      if (!res.ok) {
        setState("error");
        return;
      }
      const json = await res.json();
      const list: NewsArticle[] = Array.isArray(json?.articles)
        ? json.articles
        : Array.isArray(json)
          ? json
          : [];
      setArticles(list);
      setState(list.length > 0 ? "ready" : "empty");
    } catch {
      setState("error");
    }
  }, []);

  const loadIsi = useCallback(async (c: string) => {
    setIsiState("loading");
    try {
      const res = await fetch(`/api/sentiment/isi?country=${encodeURIComponent(c)}`);
      if (!res.ok) {
        setIsiState("error");
        return;
      }
      const json: IsiData = await res.json();
      const series = Array.isArray(json?.series) ? json.series : [];
      setIsi(json);
      setIsiState(series.length > 0 ? "ready" : "empty");
    } catch {
      setIsiState("error");
    }
  }, []);

  useEffect(() => {
    void load(country);
    void loadIsi(country);
  }, [country, load, loadIsi]);

  const positive = articles.filter(
    (a) => (a.sentiment_label ?? "").toLowerCase() === "positive",
  );
  const negative = articles.filter(
    (a) => (a.sentiment_label ?? "").toLowerCase() === "negative",
  );
  const activeLabel = COUNTRIES.find((c) => c.id === country)?.label ?? country;

  return (
    <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
      {/* Country selector */}
      <div className="flex h-[46px] shrink-0 items-center gap-3 overflow-x-auto border-b border-rule bg-bg-1 px-[22px]">
        <span className="text-[10px] uppercase tracking-[0.6px] text-ink-3">Country</span>
        {COUNTRIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCountry(c.id)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] ${
              country === c.id
                ? "border-brand bg-[var(--brand-soft)] text-ink-1"
                : "border-rule bg-bg-2 text-ink-2 hover:text-ink-1"
            }`}
          >
            {c.label}
          </button>
        ))}
        <span className="ml-auto mono text-[10px] text-ink-3">
          Source: BigQuery · news_articles
        </span>
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-bg-0 p-4">
        {/* ISI trend & score */}
        <IsiSection status={isiState} data={isi} country={activeLabel} />

        {/* News flow: positive / negative columns */}
        {state !== "ready" ? (
          <Message state={state} />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <NewsFlow tone="pos" title="Positive flow" items={positive} />
            <NewsFlow tone="neg" title="Negative flow" items={negative} />
          </div>
        )}
      </div>
    </main>
  );
}

function Message({ state }: { state: LoadState }) {
  const text =
    state === "loading"
      ? "Loading news…"
      : state === "error"
        ? "Couldn't load news. Check that BigQuery credentials are set (GOOGLE_APPLICATION_CREDENTIALS in .env.local)."
        : "No articles for this country yet.";
  return (
    <div className="flex h-40 items-center justify-center rounded-lg border border-rule bg-bg-1 px-6 text-center text-[12px] text-ink-3">
      {text}
    </div>
  );
}

function IsiSection({
  status,
  data,
  country,
}: {
  status: LoadState;
  data: IsiData | null;
  country: string;
}) {
  if (status !== "ready" || !data || data.series.length === 0) {
    const text =
      status === "loading"
        ? "Loading ISI…"
        : status === "error"
          ? "Couldn't load ISI data."
          : "No ISI data for this country yet.";
    return (
      <section className="flex h-[180px] items-center justify-center rounded-lg border border-rule bg-bg-1 text-[12px] text-ink-3">
        {text}
      </section>
    );
  }

  const latest = data.latest;
  const score = latest?.ewma_score_100 ?? data.state?.last_ewma ?? null;
  const momentum = latest?.momentum ?? null;
  const raw = latest?.raw_score_100 ?? null;
  const updated = data.state?.updated_at ?? latest?.bucket_start ?? null;
  const tone =
    score == null ? "text-ink-1" : score >= 66 ? "text-pos" : score >= 40 ? "text-ink-1" : "text-neg";

  return (
    <section className="rounded-lg border border-rule bg-bg-1 p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.6px] text-ink-3">
            Investment Sentiment Index · {country}
          </span>
          <div className="text-[12px] text-ink-2">
            EWMA-smoothed · 0–100 · {data.series.length} buckets
          </div>
        </div>
        {data.state?.model_version ? (
          <span className="mono text-[10px] text-ink-3">{data.state.model_version}</span>
        ) : null}
      </div>
      <div className="flex gap-6">
        {/* Headline numbers */}
        <div className="w-[180px] shrink-0">
          <div className="text-[10px] uppercase tracking-[0.6px] text-ink-3">ISI score</div>
          <div className={`mono text-[46px] font-medium leading-none tracking-[-1px] ${tone}`}>
            {score == null ? "—" : score.toFixed(1)}
            <span className="ml-1 text-[14px] text-ink-3">/100</span>
          </div>
          <dl className="mt-4 space-y-2 text-[11.5px]">
            <KvRow k="Momentum" v={momentum == null ? "—" : `${momentum >= 0 ? "+" : ""}${momentum.toFixed(2)}`} tone={momentum == null ? "" : momentum >= 0 ? "text-pos" : "text-neg"} />
            <KvRow k="Raw" v={raw == null ? "—" : raw.toFixed(0)} />
            <KvRow
              k="Updated"
              v={updated ? new Date(updated).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—"}
            />
          </dl>
          <div className="mt-3.5 space-y-2 border-t border-dashed border-rule pt-3 text-[10.5px]">
            <div className="flex items-center gap-2">
              <span className="inline-block h-[2px] w-4 shrink-0 rounded-full bg-brand" />
              <span className="font-semibold text-ink-1">EWMA</span>
              <span className="text-ink-3">smoothed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 shrink-0 border-t border-dashed border-ink-3" />
              <span className="font-semibold text-ink-1">Raw</span>
              <span className="text-ink-3">per bucket</span>
            </div>
          </div>
        </div>
        {/* Trend chart */}
        <div className="min-w-0 flex-1">
          <IsiChart series={data.series} />
        </div>
      </div>
    </section>
  );
}

function KvRow({ k, v, tone = "" }: { k: string; v: string; tone?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="font-semibold text-ink-1">{k}</dt>
      <dd className={`mono ${tone || "text-ink-1"}`}>{v}</dd>
    </div>
  );
}

function IsiChart({ series }: { series: IsiPoint[] }) {
  const w = 720;
  const h = 180;
  const pad = { l: 24, r: 10, t: 12, b: 18 };
  const n = series.length;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const x = (i: number) => pad.l + (n <= 1 ? 0 : (i / (n - 1)) * (w - pad.l - pad.r));
  const y = (v: number) => pad.t + (1 - v / 100) * (h - pad.t - pad.b);

  const line = (key: "ewma_score_100" | "raw_score_100") =>
    series
      .map((p, i) => ({ i, v: p[key] }))
      .filter((p) => p.v != null)
      .map((p, idx) => (idx === 0 ? "M" : "L") + x(p.i).toFixed(1) + "," + y(p.v as number).toFixed(1))
      .join(" ");

  const ewmaPath = line("ewma_score_100");
  const rawPath = line("raw_score_100");
  const lastIdx = [...series].map((p, i) => ({ p, i })).reverse().find((o) => o.p.ewma_score_100 != null);
  const fmt = (t: string | null | undefined) =>
    t ? new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "";

  // Map mouse position to the nearest bucket. The SVG is stretched
  // (preserveAspectRatio none), so we work in element-relative fractions and
  // back out the data region (inside the left/right padding).
  function onMove(e: React.MouseEvent) {
    const el = wrapRef.current;
    if (!el || n === 0) return;
    const rect = el.getBoundingClientRect();
    const frac = (e.clientX - rect.left) / rect.width;
    const dataLeft = pad.l / w;
    const dataRight = (w - pad.r) / w;
    const t = (frac - dataLeft) / (dataRight - dataLeft);
    const idx = Math.round(Math.min(1, Math.max(0, t)) * (n - 1));
    setHover(idx);
  }

  const hp = hover != null ? series[hover] : null;
  const hx = hover != null ? x(hover) : 0;
  const leftPct = Math.min(96, Math.max(4, (hx / w) * 100));

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseMove={onMove}
      onMouseLeave={() => setHover(null)}
    >
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="block h-[180px] w-full">
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={w - pad.r} y1={y(v)} y2={y(v)} stroke="var(--rule)" strokeDasharray="2 3" />
            <text x={2} y={y(v) + 3} fill="var(--ink-3)" fontSize={9}>
              {v}
            </text>
          </g>
        ))}
        {rawPath ? (
          <path d={rawPath} fill="none" stroke="var(--ink-3)" strokeWidth={1} strokeDasharray="3 2" opacity={0.45} />
        ) : null}
        {ewmaPath ? <path d={ewmaPath} fill="none" stroke="var(--brand)" strokeWidth={1.8} /> : null}

        {/* Hover crosshair + point */}
        {hp ? (
          <line x1={hx} x2={hx} y1={pad.t} y2={h - pad.b} stroke="var(--brand)" strokeWidth={1} opacity={0.55} />
        ) : null}
        {hp && hp.ewma_score_100 != null ? (
          <circle cx={hx} cy={y(hp.ewma_score_100)} r={3.5} fill="var(--brand)" stroke="var(--bg-1)" strokeWidth={1} />
        ) : !hp && lastIdx ? (
          <circle cx={x(lastIdx.i)} cy={y(lastIdx.p.ewma_score_100 as number)} r={3} fill="var(--brand)" />
        ) : null}

        <text x={pad.l} y={h - 4} fill="var(--ink-3)" fontSize={9}>
          {fmt(series[0]?.bucket_start)}
        </text>
        <text x={w - pad.r} y={h - 4} fill="var(--ink-3)" fontSize={9} textAnchor="end">
          {fmt(series[series.length - 1]?.bucket_start)}
        </text>
      </svg>

      {/* Hover readout */}
      {hp ? (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-md border border-rule-2 bg-bg-2 px-2 py-1 text-[10px] shadow-[0_6px_18px_rgba(0,0,0,0.4)]"
          style={{ left: `${leftPct}%` }}
        >
          <div className="mono font-bold text-ink-1">
            score: {hp.ewma_score_100 != null ? hp.ewma_score_100.toFixed(1) : "—"}
          </div>
          {hp.raw_score_100 != null ? (
            <div className="mono font-bold text-ink-1">
              raw: {hp.raw_score_100.toFixed(0)}
            </div>
          ) : null}
          <div className="font-bold text-ink-1">
            {hp.bucket_start
              ? new Date(hp.bucket_start).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "—"}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function tierFor(a: NewsArticle): "t1" | "t2" | "t3" {
  const r = a.relevance_score ?? a.sentiment_confidence ?? 0;
  return r >= 0.66 ? "t1" : r >= 0.33 ? "t2" : "t3";
}

// First one or two sentences of the article body, so cards stay short.
function firstSentences(text: string, max = 2): string {
  const trimmed = (text ?? "").trim();
  if (!trimmed) return "";
  const sentences = trimmed.match(/[^.!?]+[.!?]+/g);
  if (!sentences) {
    return trimmed.length > 240 ? trimmed.slice(0, 237).trimEnd() + "…" : trimmed;
  }
  return sentences.slice(0, max).join(" ").trim();
}

function NewsFlow({
  tone,
  title,
  items,
}: {
  tone: "pos" | "neg";
  title: string;
  items: NewsArticle[];
}) {
  const ribbon =
    tone === "pos"
      ? "border-pos/40 bg-[oklch(0.32_0.06_175)]/30"
      : "border-neg/40 bg-[oklch(0.30_0.08_30)]/40";
  return (
    <div className="rounded-md border border-rule bg-bg-1">
      <div className={`flex items-center gap-2 border-b border-rule px-3 py-2 ${ribbon}`}>
        <span className={`mono h-1.5 w-1.5 rounded-full ${tone === "pos" ? "bg-pos" : "bg-neg"}`} />
        <span className="text-[12px] font-medium text-ink-1">{title}</span>
        <span className="mono ml-auto text-[10px] text-ink-3">{items.length}</span>
      </div>
      <ul className="divide-y divide-rule">
        {items.length > 0 ? (
          items.map((a) => {
            const href = safeUrl(a.url);
            const tier = tierFor(a);
            const snippet = firstSentences(a.summary || a.content || "");
            const score = a.sentiment_score;
            return (
              <li key={a.id} className="px-3 py-2.5 text-[12px] hover:bg-bg-2">
                <div className="flex items-baseline gap-2">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: tone === "pos" ? "var(--pos)" : "var(--neg)" }}
                  />
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-ink-1 hover:text-brand"
                    >
                      {a.title || "Untitled"}
                    </a>
                  ) : (
                    <span className="flex-1 text-ink-1">{a.title || "Untitled"}</span>
                  )}
                  {href ? <ExternalLink size={11} className="text-ink-3" /> : null}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 pl-3.5 text-[10.5px] text-ink-3">
                  <span
                    className={`mono rounded border px-1.5 py-px text-[9.5px] ${
                      tier === "t1" ? "border-[var(--accent)] text-[var(--accent)]" : "border-rule text-ink-3"
                    }`}
                  >
                    {tier.toUpperCase()}
                  </span>
                  {a.source ? <span>{a.source}</span> : null}
                  {a.published_at ? (
                    <>
                      <span>·</span>
                      <span className="mono">
                        {new Date(a.published_at).toLocaleString(undefined, { dateStyle: "short" })}
                      </span>
                    </>
                  ) : null}
                  <span className="ml-auto flex items-center gap-2 mono">
                    {typeof a.sentiment_confidence === "number" ? (
                      <span className="text-ink-3">conf {a.sentiment_confidence.toFixed(2)}</span>
                    ) : null}
                    {typeof score === "number" ? (
                      <span className={score >= 0 ? "text-pos" : "text-neg"}>
                        {score >= 0 ? "+" : ""}
                        {score.toFixed(2)}
                      </span>
                    ) : null}
                  </span>
                </div>
                {snippet ? (
                  <p className="mt-1.5 pl-3.5 text-[11px] leading-snug text-ink-2">{snippet}</p>
                ) : null}
              </li>
            );
          })
        ) : (
          <li className="px-3 py-6 text-center text-[11px] text-ink-3">No items in window.</li>
        )}
      </ul>
    </div>
  );
}
