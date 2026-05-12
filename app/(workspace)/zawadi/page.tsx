import {
  Send,
  Paperclip,
  Quote,
  Radio,
  Save,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
} from "lucide-react";

// Zawadi is the conversational AI workspace. We render the gold terminal
// theme and a 3-column shell (threads · chat · workbench) directly in the
// page so it doesn't fight the workspace layout's main flex.

export default function ZawadiPage() {
  const sources = [
    { n: 1, tier: "t1", name: "CBK May MPC communique", org: "Central Bank of Kenya", date: "2026-05-04", type: "Official", quote: "The Committee will remain data-dependent through Q3 and continues to view the FX band as anchored." },
    { n: 2, tier: "t2", name: "IMF Article IV — Kenya 2026", org: "International Monetary Fund", date: "2026-04-22", type: "Research", quote: "Tranche-2 disbursement is contingent on meeting the prior-action benchmarks on revenue mobilisation." },
    { n: 3, tier: "t1", name: "Reuters — Gulf-backed funds commit $180M", org: "Reuters Africa", date: "2026-05-05", type: "News", quote: "The consortium cited Kenya's revised digital lending framework as a key gating factor." },
    { n: 4, tier: "t2", name: "NSE Q1 issuer fact sheet", org: "Nairobi Securities Exchange", date: "2026-04-30", type: "Press release", quote: "Bank rerating drove the index +1.9% w/w; non-bank financials lagged." },
    { n: 5, tier: "t3", name: "FT — Africa fintech licensing rebound", org: "Financial Times", date: "2026-05-02", type: "News", quote: "Three new PSB authorisations were granted in the quarter, the highest count since 2022." },
  ];
  const drivers = [
    ["FX band stability", 84, "pos"],
    ["Fiscal credibility", 62, "wat"],
    ["Capital inflows", 78, "pos"],
    ["Political risk", 58, "wat"],
    ["External debt", 54, "wat"],
    ["Sector rotation", 71, "pos"],
  ] as const;

  return (
    <div className="theme-gold flex min-w-0 flex-1 overflow-hidden bg-bg-0 text-ink-1">
      {/* THREADS panel */}
      <aside className="hidden w-[248px] shrink-0 overflow-y-auto border-r border-rule bg-bg-1 px-3 py-3.5 md:block">
        <button className="display mb-3 flex w-full items-center justify-center gap-2 rounded-md bg-[linear-gradient(135deg,var(--brand-deep),var(--brand))] px-3 py-2 text-[12px] font-semibold text-bg-0">
          ＋ New thread
        </button>

        <input
          type="text"
          placeholder="Search threads…"
          className="mb-3 w-full rounded-md border border-rule bg-bg-2 px-3 py-1.5 text-[12px] text-ink-1 placeholder:text-ink-3"
        />

        {/* Catalyst ticker */}
        <div className="mb-4 rounded-md border border-brand/30 bg-[var(--brand-soft)]/30 px-3 py-2">
          <div className="display flex items-baseline gap-2">
            <span className="text-[18px] font-bold text-brand">12</span>
            <span className="text-[10px] uppercase tracking-[0.4px] text-ink-3">days</span>
          </div>
          <div className="mt-0.5 text-[11.5px] text-ink-1">CBN MPC rate decision</div>
          <div className="mono text-[10px] text-ink-3">NGA · expected hawkish</div>
        </div>

        <ThreadGroup
          label="Today · 3"
          items={[
            { title: "Kenya infrastructure bonds Q2 2026 — entry conviction", sig: "opt", conf: 84, tag: "IC PACK", active: true },
            { title: "ZAF coalition risk — stress test", sig: "avd", conf: 71 },
            { title: "EGY renewables capex — sector view", sig: "wat", conf: 62, tag: "DRAFT" },
          ]}
        />
        <ThreadGroup
          label="Yesterday · 2"
          items={[
            { title: "Nigeria Eurobond rollover — base case", sig: "wat", conf: 69, tag: "SHARED 2" },
            { title: "Mauritius DTAA framework — Q&A", sig: null },
          ]}
        />
        <ThreadGroup
          label="Earlier · 4"
          items={[
            { title: "Morocco green hydrogen pipeline", sig: "opt", conf: 78 },
            { title: "Ethiopia debt restructuring — read-out", sig: "avd", conf: 54 },
            { title: "CIV cocoa cycle — sector watch", sig: "wat", conf: 60 },
            { title: "Ghana fintech licensing — outlook", sig: "opt", conf: 73 },
          ]}
        />
      </aside>

      {/* CHAT main */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Context strip */}
        <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-rule bg-bg-1 px-5 py-2.5 text-[10.5px] text-ink-3">
          <span className="uppercase tracking-[0.6px]">Mandate</span>
          <Chip>SSA Infra Fund III</Chip>
          <Chip>BB− min</Chip>
          <Chip>5y horizon</Chip>
          <Chip>IFC PS-aligned</Chip>
          <span className="mx-2 h-3 w-px bg-rule" />
          <span className="uppercase tracking-[0.6px]">Portfolio</span>
          <Chip>$420M NAV</Chip>
          <Chip tone="pos">+11.8% YTD</Chip>
          <span className="mono ml-auto inline-flex items-center gap-1 rounded-full border border-pos/40 bg-[rgba(0,179,126,0.1)] px-2 py-0.5 text-[10px] text-pos">
            <span className="h-1.5 w-1.5 rounded-full bg-pos blink" />
            LIVE · now
          </span>
        </div>

        {/* Mode bar */}
        <div className="flex shrink-0 items-center gap-3 border-b border-rule bg-bg-0 px-5 py-2.5">
          <input
            type="text"
            defaultValue="Kenya infrastructure bonds Q2 2026 — entry conviction"
            className="flex-1 bg-transparent text-[13px] font-medium text-ink-1 outline-none"
          />
          <div className="flex rounded-md border border-rule bg-bg-1 p-0.5">
            {["Analysis", "Comparison", "Scenario", "Report"].map((m, i) => (
              <button
                key={m}
                className={`rounded-sm px-2.5 py-1 text-[11px] ${
                  i === 0 ? "bg-bg-2 text-ink-1" : "text-ink-3 hover:text-ink-2"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="flex rounded-md border border-rule bg-bg-1 p-0.5">
            {["Quick", "Standard", "Deep"].map((m, i) => (
              <button
                key={m}
                className={`rounded-sm px-2.5 py-1 text-[11px] ${
                  i === 1 ? "bg-bg-2 text-ink-1" : "text-ink-3 hover:text-ink-2"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {/* User msg */}
          <div className="flex justify-end">
            <div className="max-w-[640px] rounded-2xl rounded-tr-sm border border-rule bg-bg-2 px-4 py-2.5 text-[13px]">
              Should we add Kenya 10Y infra paper to the SSA Fund III? What&apos;s the entry conviction at current spread, and what&apos;s the
              steel-man case against?
              <div className="mono mt-1 text-[10px] text-ink-3">14:18 UTC · 47 tokens</div>
            </div>
          </div>

          {/* Zawadi response */}
          <div className="max-w-[820px] rounded-2xl rounded-tl-sm border border-rule border-l-[3px] border-l-pos bg-bg-1 px-4 py-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="display grid h-7 w-7 place-items-center rounded-full bg-[linear-gradient(135deg,var(--brand-deep),var(--brand))] text-[12px] font-bold text-bg-0">
                Z
              </span>
              <span className="display text-[13px] font-semibold">Zawadi</span>
              <span className="display inline-flex items-center gap-1.5 rounded-md border border-pos/40 bg-[rgba(0,179,126,0.1)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.4px] text-pos">
                <span className="h-1.5 w-1.5 rounded-full bg-pos shadow-[0_0_6px_var(--pos)]" />
                Optimal
              </span>
              <span className="mono ml-auto text-[10.5px] text-ink-3">
                conf 0.84 · CI [0.76 – 0.91]
              </span>
            </div>
            <div className="mono mb-2 rounded-md bg-bg-2 px-2 py-1 text-[10px] text-ink-3">
              METI v3.2.1 · ISI v2.3 · sha 0x4d31…a7c1 · ✓ reproducible · 14 sources · 8 reasoning steps · ✓ mandate-compliant
            </div>

            {/* Verdict history strip */}
            <div className="mb-3">
              <div className="mb-1 flex items-center justify-between text-[10px] text-ink-3">
                <span>Verdict history · 30d</span>
                <a className="cursor-pointer text-brand">vs 7d ago</a>
              </div>
              <div className="flex h-2 overflow-hidden rounded-sm">
                <span className="block bg-amber" style={{ width: "40%" }} />
                <span className="block bg-pos" style={{ width: "55%" }} />
                <span className="block bg-pos/60" style={{ width: "5%" }} />
              </div>
            </div>

            <p className="text-[13px] leading-[1.6]">
              <strong>Yes — initiate a 2–2.4% position</strong> in KEN 10Y infra paper at current spreads.{" "}
              <Cite>S1</Cite> CBK is data-dependent through Q3 and FX has held within ±0.4% for 60d,{" "}
              <Cite>S2</Cite> IMF tranche-2 is on schedule, and{" "}
              <Cite>S3</Cite> Gulf-backed inflows of $180M reset the demand baseline. The entry window opens late June and stays
              constructive into Q4.
            </p>

            {/* Premium row */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <PremCard
                title="Portfolio impact"
                rows={[
                  ["Kenya weight after", "8.4%"],
                  ["VaR 95%", "−1.4%"],
                  ["ρ to book", "0.31"],
                  ["Headroom", "1.6% NAV"],
                ]}
                foot="Within mandate · BB− floor not breached"
              />
              <PremCard
                title="Position sizing"
                rows={[
                  ["Notional", "$10.1M"],
                  ["Tranche split", "60 / 40"],
                  ["Hedge cost", "32 bps"],
                  ["IRR (base)", "14.2%"],
                ]}
                foot="Sharpe target ≥ 1.4 over 24M window"
              />
            </div>

            {/* Findings */}
            <ul className="mt-3 space-y-1.5">
              {[
                { sig: "pos", label: "FX band stable", text: "±0.4% over 60d, IMF EFF prior actions met", det: "CBK Apr report" },
                { sig: "pos", label: "Fintech licensing rebound", text: "3 new PSB authorisations vs. 1 prior", det: "FT · NSE memo" },
                { sig: "wat", label: "Pre-election noise rising", text: "VAT debate amplifying coalition stress", det: "Reuters · Standard" },
              ].map((f) => (
                <li key={f.label} className="flex items-start gap-2 text-[12px]">
                  <span
                    className="mt-1 inline-block h-1.5 w-1.5 rounded-full"
                    style={{
                      background:
                        f.sig === "pos" ? "var(--pos)" : f.sig === "wat" ? "var(--amber)" : "var(--neg)",
                    }}
                  />
                  <span className="font-medium text-ink-1">{f.label}</span>
                  <span className="text-ink-2">— {f.text}</span>
                  <span className="mono ml-auto text-[10px] text-ink-3">{f.det}</span>
                </li>
              ))}
            </ul>

            {/* Drivers grid */}
            <div className="mt-3 rounded-md border border-rule bg-bg-2 p-3">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="display text-[11px] font-semibold uppercase tracking-[0.4px] text-ink-2">
                  Driver weights (vs peers)
                </span>
                <div className="flex gap-1 text-[10px]">
                  {["Weighted", "Equal", "vs peer"].map((m, i) => (
                    <button
                      key={m}
                      className={`rounded px-1.5 py-0.5 ${i === 0 ? "bg-bg-3 text-ink-1" : "text-ink-3"}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <ul className="space-y-2">
                {drivers.map(([name, v, sig]) => {
                  const c =
                    sig === "pos" ? "var(--pos)" : sig === "wat" ? "var(--amber)" : "var(--neg)";
                  return (
                    <li key={name} className="text-[11.5px]">
                      <div className="mb-1 flex items-baseline justify-between">
                        <span className="text-ink-1">{name}</span>
                        <span className="mono text-ink-3">{v as number}</span>
                      </div>
                      <div className="relative h-1.5 overflow-hidden rounded-sm bg-bg-3">
                        <span className="block h-full" style={{ width: `${v}%`, background: c }} />
                        <span className="absolute top-0 h-full w-px bg-ink-1/40" style={{ left: "65%" }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Dissent */}
            <div className="mt-3 rounded-md border border-neg/30 bg-[rgba(224,69,90,0.06)] p-3">
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="display text-[11px] font-semibold uppercase tracking-[0.4px] text-neg">
                  What would change this view
                </span>
                <span className="mono text-[10.5px] text-ink-3">flip prob 14%</span>
              </div>
              <ul className="space-y-1.5 text-[12px]">
                {[
                  { head: "FX shock", text: "USDKES > 145 sustained for 10 trading days" },
                  { head: "Tranche slip", text: "IMF disbursement delayed beyond Aug 1" },
                  { head: "Political escalation", text: "Coalition reshuffle before budget vote" },
                ].map((d) => (
                  <li key={d.head} className="text-ink-1">
                    <strong>{d.head}.</strong> <span className="text-ink-2">{d.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button className="display rounded-md bg-[linear-gradient(135deg,var(--brand-deep),var(--brand))] px-2.5 py-1 text-[11px] font-semibold text-bg-0">
                ＋ Add to IC pack
              </button>
              <button className="rounded-md border border-rule bg-bg-2 px-2.5 py-1 text-[11px] text-ink-2 hover:text-ink-1">
                Red-team this
              </button>
              <button className="rounded-md border border-rule bg-bg-2 px-2.5 py-1 text-[11px] text-ink-2 hover:text-ink-1">
                Alert on flip
              </button>
              <button className="rounded-md border border-rule bg-bg-2 px-2.5 py-1 text-[11px] text-ink-2 hover:text-ink-1">
                Snapshot
              </button>
              <span className="ml-auto flex items-center gap-1.5 text-ink-3">
                <button className="rounded-md p-1 hover:bg-bg-2"><ThumbsUp size={12} /></button>
                <button className="rounded-md p-1 hover:bg-bg-2"><ThumbsDown size={12} /></button>
              </span>
            </div>
          </div>
        </div>

        {/* Suggestion bar */}
        <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-t border-rule bg-bg-1 px-5 py-2 text-[11px]">
          {[
            "Stress-test if KES depreciates 12%",
            "Compare against MAR + EGY infra paper",
            "Build IC memo from this thread",
            "Snapshot for July review cycle",
          ].map((s) => (
            <button
              key={s}
              className="shrink-0 rounded-full border border-rule bg-bg-2 px-3 py-1.5 text-ink-2 hover:border-brand hover:text-brand"
            >
              {s}
              <span className="ml-1.5 text-ink-3">↳</span>
            </button>
          ))}
        </div>

        {/* Composer */}
        <div className="shrink-0 border-t border-rule bg-bg-0 p-3">
          <div className="rounded-lg border border-rule bg-bg-1 p-3">
            <textarea
              rows={2}
              placeholder="Ask Zawadi anything about the mandate, a market, or a deal…"
              className="block w-full resize-none bg-transparent text-[13px] text-ink-1 outline-none placeholder:text-ink-3"
            />
            <div className="mt-2 flex items-center gap-3 text-[11px] text-ink-3">
              <button className="flex items-center gap-1.5 hover:text-ink-1"><Paperclip size={11} /> Attach</button>
              <button className="flex items-center gap-1.5 hover:text-ink-1"><Quote size={11} /> Cite sources</button>
              <button className="flex items-center gap-1.5 hover:text-ink-1"><Radio size={11} /> All signals</button>
              <button className="flex items-center gap-1.5 hover:text-ink-1"><Save size={11} /> Save snippet</button>
              <span className="mono ml-auto">~12k tokens · est. $0.04</span>
              <button className="display flex items-center gap-1.5 rounded-md bg-[linear-gradient(135deg,var(--brand-deep),var(--brand))] px-2.5 py-1.5 text-bg-0">
                <Send size={11} /> Send
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* WORKBENCH */}
      <aside className="hidden w-[312px] shrink-0 overflow-y-auto border-l border-rule bg-bg-1 lg:block">
        <div className="flex border-b border-rule bg-bg-0">
          {["Sources", "Market", "Audit"].map((t, i) => (
            <button
              key={t}
              className={`flex-1 py-2.5 text-[11.5px] font-medium ${
                i === 0
                  ? "border-b-2 border-brand text-ink-1"
                  : "text-ink-3 hover:text-ink-1"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="p-3">
          <div className="mb-2 text-[10px] uppercase tracking-[0.6px] text-ink-3">14 sources cited</div>
          <ul className="space-y-2">
            {sources.map((s) => (
              <li key={s.n} className="rounded-md border border-rule bg-bg-2 px-3 py-2.5 text-[12px]">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`mono inline-block h-5 w-5 rounded-md text-center leading-5 ${
                      s.tier === "t1"
                        ? "bg-[var(--brand-soft)] text-brand"
                        : s.tier === "t2"
                          ? "bg-pos/20 text-pos"
                          : "bg-blue/20 text-[var(--blue)]"
                    }`}
                  >
                    {s.n}
                  </span>
                  <span className="text-[12.5px] font-medium text-ink-1">{s.name}</span>
                </div>
                <div className="mono mt-1 flex items-center gap-2 pl-7 text-[10px] text-ink-3">
                  <span
                    className={`rounded-sm border px-1 ${
                      s.tier === "t1"
                        ? "border-brand text-brand"
                        : "border-rule text-ink-3"
                    }`}
                  >
                    {s.tier.toUpperCase()}
                  </span>
                  <span>{s.type}</span>
                  <span>·</span>
                  <span>{s.date}</span>
                </div>
                <p className="mt-2 pl-7 text-[11.5px] italic leading-snug text-ink-2">
                  “{s.quote}”
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-4 text-[10px] uppercase tracking-[0.6px] text-ink-3">Related queries</div>
          <ul className="mt-2 space-y-1 text-[11.5px]">
            {[
              "Compare KEN vs. CIV infra paper at same horizon",
              "How would a 50bp SARB cut change the picture?",
              "Show 2018 entry analog drawdown profile",
            ].map((q) => (
              <li key={q}>
                <button className="rounded-md py-1 text-left text-ink-2 hover:text-brand">
                  → {q}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Sparkles is reserved for future "AI" affordances */}
      <span className="sr-only">
        <Sparkles size={10} />
      </span>
    </div>
  );
}

function Chip({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone?: "pos";
}) {
  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-0.5 ${
        tone === "pos"
          ? "border-pos/40 bg-[rgba(0,179,126,0.1)] text-pos"
          : "border-rule bg-bg-2 text-ink-2"
      }`}
    >
      {children}
    </span>
  );
}

function Cite({ children }: { children: React.ReactNode }) {
  return (
    <span className="mono mx-px cursor-pointer rounded-sm border border-brand/40 bg-[var(--brand-soft)] px-1 py-px text-[9.5px] text-brand">
      {children}
    </span>
  );
}

function ThreadGroup({
  label,
  items,
}: {
  label: string;
  items: {
    title: string;
    sig: "opt" | "wat" | "avd" | null;
    conf?: number;
    tag?: string;
    active?: boolean;
  }[];
}) {
  return (
    <div className="mb-3">
      <div className="mb-1.5 px-1 text-[10px] uppercase tracking-[0.6px] text-ink-3">{label}</div>
      <ul className="space-y-1">
        {items.map((t) => {
          const sigColor =
            t.sig === "opt" ? "var(--pos)" : t.sig === "wat" ? "var(--amber)" : t.sig === "avd" ? "var(--neg)" : "var(--ink-3)";
          return (
            <li
              key={t.title}
              className={`relative cursor-pointer rounded-md border bg-bg-2 px-2.5 py-2 text-[11.5px] hover:bg-bg-3 ${
                t.active ? "border-brand shadow-[inset_3px_0_0_var(--brand)]" : "border-rule"
              }`}
            >
              <div className="flex items-start gap-1.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: sigColor }} />
                <span className="line-clamp-2 text-ink-1">{t.title}</span>
              </div>
              <div className="mono mt-1 flex items-center gap-2 pl-3 text-[10px] text-ink-3">
                {t.conf ? <span>conf {t.conf}%</span> : null}
                {t.tag ? (
                  <span
                    className={`rounded-sm px-1 py-px text-[9px] ${
                      t.tag === "IC PACK"
                        ? "bg-[var(--brand-soft)] text-brand"
                        : t.tag === "SHARED 2"
                          ? "bg-blue/20 text-[var(--blue)]"
                          : "bg-bg-3 text-ink-3"
                    }`}
                  >
                    {t.tag}
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PremCard({
  title,
  rows,
  foot,
}: {
  title: string;
  rows: [string, string][];
  foot: string;
}) {
  return (
    <div className="rounded-md border border-brand/30 bg-[var(--brand-soft)]/30 p-2.5">
      <div className="display mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.4px] text-brand">
        {title}
      </div>
      <ul className="space-y-1">
        {rows.map(([k, v]) => (
          <li key={k} className="flex justify-between border-b border-dashed border-rule/40 pb-1 text-[11px]">
            <span className="text-ink-3">{k}</span>
            <span className="mono text-ink-1">{v}</span>
          </li>
        ))}
      </ul>
      <div className="mt-2 text-[10px] italic text-ink-3">{foot}</div>
    </div>
  );
}
