import Link from "next/link";
import { Bell, Pin, Camera, Sparkles } from "lucide-react";
import { countries } from "@/lib/stubs/countries";

// METI page is the "When to invest" surface. We render this in the gold
// terminal theme to match the mockup. Wrapper div applies `theme-gold` —
// nested scopes win over the body-level `theme-ochre` default.

function ScoreRing({ value }: { value: number }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg viewBox="0 0 108 108" className="h-[108px] w-[108px]">
      <circle cx="54" cy="54" r={r} fill="none" stroke="var(--rule)" strokeWidth="8" />
      <circle
        cx="54"
        cy="54"
        r={r}
        fill="none"
        stroke="var(--brand)"
        strokeWidth="8"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 54 54)"
      />
      <text
        x="54"
        y="58"
        textAnchor="middle"
        fontFamily="var(--font-jakarta), system-ui"
        fontWeight={700}
        fontSize={26}
        fill="var(--ink-1)"
      >
        {value}
      </text>
      <text x="54" y="76" textAnchor="middle" fontSize={9} fill="var(--ink-3)">
        /100
      </text>
    </svg>
  );
}

export default function METIPage() {
  const focus = countries.find((c) => c.code === "ke")!;
  const drivers = [
    { name: "Infrastructure pipeline", weight: 22, value: 78, delta: "+4" },
    { name: "Monetary policy", weight: 18, value: 62, delta: "−2" },
    { name: "Fiscal position", weight: 17, value: 58, delta: "+1" },
    { name: "Political stability", weight: 16, value: 71, delta: "+3" },
    { name: "FX & trade", weight: 14, value: 80, delta: "+6" },
    { name: "External debt", weight: 13, value: 54, delta: "−1" },
  ];
  const catalysts = [
    { days: 4, event: "VAT amendments, parliament reads", type: "Political", sig: "wat" },
    { days: 9, event: "CBK MPC rate decision", type: "Monetary", sig: "opt" },
    { days: 18, event: "FY26 budget reading", type: "Fiscal", sig: "wat" },
    { days: 31, event: "Eurobond rollover window opens", type: "Markets", sig: "opt" },
    { days: 58, event: "IMF Article IV mission", type: "Macro", sig: "wat" },
  ];

  return (
    <div className="theme-gold flex min-w-0 flex-1 flex-col overflow-y-auto bg-bg-0 text-ink-1">
      {/* KPI bar */}
      <div className="grid grid-cols-5 border-b border-rule">
        <KBar tone="pos" label="Optimal markets" value="14" unit="/36" sub="ISI ≥ 70 · METI in entry-window" />
        <KBar tone="amber" label="Watch markets" value="11" unit="/36" sub="conditions forming" />
        <KBar tone="neg" label="Avoid markets" value="6" unit="/36" sub="hold / underweight" />
        <KBar tone="gold" label="Avg METI · East Africa" value="71.4" unit="/100" sub="GDP-weighted across 7 markets" />
        <KBar tone="gold" label="Catalysts next 90d" value="14" sub="6 monetary · 5 political · 3 fiscal" />
      </div>

      {/* Hero block */}
      <div className="flex items-center gap-8 border-b border-rule px-7 py-5">
        <ScoreRing value={71} />
        <div className="flex-1">
          <div className="mono text-[10.5px] uppercase tracking-[0.4px] text-ink-3">
            METI Score · Equity · Base case
          </div>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="display text-[28px] font-bold tracking-tight">{focus.name}</h1>
            <span className="display inline-flex items-center gap-1.5 rounded-md border border-[var(--brand)]/40 bg-[var(--brand-soft)] px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.6px] text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_6px_var(--brand)]" />
              Optimal
            </span>
          </div>
          <div className="mt-2 text-[12px] text-ink-2">
            {focus.region} · {focus.iso3} · sectors: {focus.sectors.slice(0, 3).join(", ")}.
          </div>
        </div>
        <div className="flex gap-3">
          <HM k="Entry window" v="6–18 mo" sub="confidence 0.74" />
          <HM k="Confidence" v="0.74" sub="6 driver factors" />
          <HM k="Position sizing" v="2.4% NAV" sub="vs. 1.8% benchmark" />
        </div>
        <div className="flex flex-col gap-2">
          <ActionBtn icon={<Pin size={11} />}>Pinned</ActionBtn>
          <ActionBtn icon={<Bell size={11} />}>Alert</ActionBtn>
          <ActionBtn icon={<Camera size={11} />}>Snapshot</ActionBtn>
          <Link
            href="/country-brief/kenya"
            className="display inline-flex items-center gap-1.5 rounded-md bg-[linear-gradient(135deg,var(--brand-deep),var(--brand))] px-2.5 py-1.5 text-[11px] font-semibold text-bg-0"
          >
            ＋ Add to IC pack
          </Link>
        </div>
      </div>

      {/* Audit bar */}
      <div className="flex items-center gap-3 border-b border-rule bg-bg-1 px-7 py-2 text-[10.5px] text-ink-3">
        <span className="uppercase tracking-[0.4px]">Snapshot</span>
        <span className="mono rounded-md border border-rule bg-bg-2 px-1.5 py-0.5 text-ink-2">
          0x4d31…a7c1
        </span>
        <span className="mono rounded-md border border-pos/40 bg-[rgba(0,179,126,0.1)] px-1.5 py-0.5 text-pos">
          ✓ Hash verified · reproducible
        </span>
        <span className="ml-auto">METI v3.2.1 · 6 drivers · Brier 0.18 · Sharpe 1.42</span>
      </div>

      {/* Trajectory block */}
      <Block title="METI trajectory" sub="History + 12-month projection · 80% confidence cone">
        <Trajectory />
        <div className="mt-3 flex items-start gap-3 rounded-md border border-[var(--brand)]/30 bg-[var(--brand-soft)]/40 px-3 py-2.5">
          <span className="display grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-bg-0 text-[11px] font-bold">
            Z
          </span>
          <div className="flex-1">
            <div className="mb-1 flex items-baseline justify-between">
              <span className="display text-[10.5px] font-semibold uppercase tracking-[0.6px] text-brand">
                Zawadi insight · conf 0.78
              </span>
              <span className="mono text-[10px] text-ink-3">drafted 14:18 UTC</span>
            </div>
            <p className="text-[12px] leading-[1.55]">
              Trajectory is gated by{" "}
              <Cite>S1</Cite> the CBK rate path and{" "}
              <Cite>S2</Cite> external-debt servicing through Q3. Optimal entry window opens late June, conditional on
              continued FX stability and the IMF disbursement landing on schedule.
            </p>
          </div>
        </div>
      </Block>

      {/* Row 3: lead-lag · analog · triggers */}
      <div className="grid grid-cols-3 gap-3 border-b border-rule p-3">
        <Block title="Lead-lag indicators" subtle>
          <ul className="space-y-2">
            {[
              { name: "M3 money supply", v: 0.6, s: 0.7 },
              { name: "FX reserves Δ", v: 0.3, s: 0.4 },
              { name: "Eurobond spread", v: -0.4, s: 0.6 },
              { name: "PMI manufacturing", v: 0.5, s: 0.5 },
              { name: "Energy capex", v: 0.7, s: 0.8 },
            ].map((r) => (
              <li key={r.name} className="grid grid-cols-[1fr_120px_40px] items-center gap-2 text-[11.5px]">
                <span className="text-ink-2">{r.name}</span>
                <span className="relative block h-2 rounded-sm bg-bg-2">
                  <span className="absolute inset-y-0 left-1/2 w-px bg-rule-2" />
                  <span
                    className={`absolute inset-y-0 ${r.v >= 0 ? "left-1/2 bg-pos" : "right-1/2 bg-neg"}`}
                    style={{ width: `${Math.abs(r.v) * 50}%` }}
                  />
                </span>
                <span className={`mono text-right text-[10px] ${r.v >= 0 ? "text-pos" : "text-neg"}`}>
                  {r.v >= 0 ? "+" : ""}
                  {r.v.toFixed(1)}
                </span>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Most similar historical entry" subtle>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="display text-[14px] font-semibold">KEN · H2 2018</span>
            <span className="mono text-[11px] text-brand">match 87%</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-[10.5px]">
            <Stat l="24M return" v="+38%" />
            <Stat l="Max DD" v="−12%" />
            <Stat l="Hit hurdle" v="Yes" />
            <Stat l="Sharpe" v="1.62" />
          </div>
          <svg viewBox="0 0 240 50" className="mt-3 h-12 w-full">
            <path
              d="M0,40 L40,38 L80,30 L120,24 L160,16 L200,10 L240,6"
              fill="none"
              stroke="var(--brand)"
              strokeWidth={1.6}
            />
          </svg>
        </Block>

        <Block title="What would flip the signal" subtle>
          <ul className="space-y-2 text-[11.5px]">
            {[
              { sig: "opt", text: "FX band holds <0.6% σ for 60d", out: "stays optimal" },
              { sig: "wat", text: "IMF tranche slips past July", out: "watch" },
              { sig: "avd", text: "Eurobond rollover fails", out: "avoid" },
              { sig: "wat", text: "Coalition reshuffle pre-budget", out: "watch" },
            ].map((t) => (
              <li key={t.text} className="flex items-start gap-2">
                <span
                  className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{
                    background:
                      t.sig === "opt" ? "var(--pos)" : t.sig === "wat" ? "var(--amber)" : "var(--neg)",
                  }}
                />
                <span className="text-ink-1">
                  {t.text} <em className="not-italic text-ink-3">→ {t.out}</em>
                </span>
              </li>
            ))}
          </ul>
        </Block>
      </div>

      {/* Row 2: drivers + catalysts */}
      <div className="grid grid-cols-2 gap-3 border-b border-rule p-3">
        <Block title="Key drivers" sub="Weighted contribution to METI score">
          <ul className="space-y-2.5">
            {drivers.map((d) => (
              <li key={d.name} className="text-[11.5px]">
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="text-ink-1">{d.name}</span>
                  <span className="mono text-ink-3">
                    {d.value}
                    <span className={`ml-1.5 ${d.delta.startsWith("+") ? "text-pos" : "text-neg"}`}>
                      {d.delta}
                    </span>
                  </span>
                </div>
                <div className="relative h-1.5 overflow-hidden rounded-sm bg-bg-2">
                  <span className="block h-full bg-brand" style={{ width: `${d.value}%` }} />
                  <span className="absolute top-0 h-full w-px bg-ink-1/40" style={{ left: "65%" }} />
                </div>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Upcoming catalysts · 90d" sub="All · Macro · Political (filter)">
          <ul className="space-y-2">
            {catalysts.map((c) => (
              <li key={c.event} className="flex items-center gap-3 rounded-md border border-rule bg-bg-2 px-2.5 py-2">
                <div className="display flex w-10 flex-col items-center">
                  <span className="text-[18px] font-bold leading-none">{c.days}</span>
                  <span className="text-[9px] text-ink-3">days</span>
                </div>
                <div className="flex-1 text-[11.5px]">
                  <div className="text-ink-1">{c.event}</div>
                  <div className="mono mt-0.5 text-[10px] text-ink-3">{c.type}</div>
                </div>
                <span
                  className="rounded border px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.4px]"
                  style={{
                    color:
                      c.sig === "opt"
                        ? "var(--pos)"
                        : c.sig === "wat"
                          ? "var(--amber)"
                          : "var(--neg)",
                    borderColor:
                      c.sig === "opt"
                        ? "var(--pos)"
                        : c.sig === "wat"
                          ? "var(--amber)"
                          : "var(--neg)",
                  }}
                >
                  {c.sig === "opt" ? "Opt" : c.sig === "wat" ? "Watch" : "Avoid"}
                </span>
                <button className="text-ink-3 hover:text-ink-1">
                  <Bell size={12} />
                </button>
              </li>
            ))}
          </ul>
        </Block>
      </div>

      {/* Market matrix */}
      <Block title="Market matrix" sub="All 30 markets · METI composite + 6 drivers" noBorder>
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-rule text-ink-3">
              <th className="px-2 py-2 text-left font-medium uppercase tracking-[0.4px]">Market</th>
              <th className="px-2 py-2 text-right font-medium uppercase tracking-[0.4px]">GDP</th>
              <th className="px-2 py-2 text-right font-medium uppercase tracking-[0.4px]">ISI</th>
              <th className="px-2 py-2 text-right font-medium uppercase tracking-[0.4px]">1W</th>
              {drivers.map((d) => (
                <th key={d.name} className="px-2 py-2 text-center font-medium uppercase tracking-[0.4px]">
                  {d.name.split(" ")[0]}
                </th>
              ))}
              <th className="px-2 py-2 text-center font-medium uppercase tracking-[0.4px]">Signal</th>
            </tr>
          </thead>
          <tbody>
            {countries.slice(0, 18).map((m) => {
              const sig = m.isi_score >= 70 ? "opt" : m.isi_score >= 50 ? "wat" : "avd";
              const sigColor =
                sig === "opt" ? "var(--pos)" : sig === "wat" ? "var(--amber)" : "var(--neg)";
              return (
                <tr key={m.code} className="border-b border-rule">
                  <td className="px-2 py-2">
                    <span className="display font-semibold">{m.iso3}</span>{" "}
                    <span className="text-ink-3">{m.name}</span>
                  </td>
                  <td className="mono px-2 py-2 text-right text-ink-2">${m.gdp_estimate_usd_b}B</td>
                  <td className="mono px-2 py-2 text-right text-brand">{m.isi_score}</td>
                  <td
                    className={`mono px-2 py-2 text-right ${m.perf_1w >= 0 ? "text-pos" : "text-neg"}`}
                  >
                    {m.perf_1w >= 0 ? "+" : ""}
                    {m.perf_1w.toFixed(2)}
                  </td>
                  {drivers.map((d, i) => {
                    const v = ((m.isi_score + i * 7) % 100) / 100;
                    return (
                      <td key={d.name} className="p-1 text-center">
                        <span
                          className="mono inline-block w-10 rounded px-1 py-0.5 text-[10px]"
                          style={{
                            background:
                              v >= 0.7
                                ? "rgba(0,179,126,0.16)"
                                : v >= 0.5
                                  ? "rgba(229,160,32,0.16)"
                                  : "rgba(224,69,90,0.16)",
                            color: v >= 0.7 ? "var(--pos)" : v >= 0.5 ? "var(--amber)" : "var(--neg)",
                          }}
                        >
                          {Math.round(v * 100)}
                        </span>
                      </td>
                    );
                  })}
                  <td className="p-2 text-center">
                    <span
                      className="display inline-block rounded-sm border px-1.5 py-0.5 text-[9.5px] font-semibold uppercase"
                      style={{ color: sigColor, borderColor: sigColor }}
                    >
                      {sig === "opt" ? "Opt" : sig === "wat" ? "Watch" : "Avoid"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Block>
    </div>
  );
}

function KBar({
  tone,
  label,
  value,
  unit,
  sub,
}: {
  tone: "pos" | "neg" | "amber" | "gold";
  label: string;
  value: string;
  unit?: string;
  sub?: string;
}) {
  const stripe =
    tone === "pos"
      ? "var(--pos)"
      : tone === "neg"
        ? "var(--neg)"
        : tone === "amber"
          ? "var(--amber)"
          : "var(--brand)";
  return (
    <div className="relative h-[72px] border-r border-rule px-4 py-3 last:border-r-0">
      <span className="absolute inset-x-0 top-0 h-0.5" style={{ background: stripe }} />
      <div className="text-[10px] uppercase tracking-[0.4px] text-ink-3">{label}</div>
      <div className="mono mt-1 text-[20px] font-medium leading-tight tracking-[-0.4px] text-ink-1">
        {value}
        {unit ? <span className="ml-1 text-[12px] text-ink-3">{unit}</span> : null}
      </div>
      <div className="text-[10px] text-ink-3">{sub}</div>
    </div>
  );
}

function HM({ k, v, sub }: { k: string; v: string; sub: string }) {
  return (
    <div className="px-3">
      <div className="text-[10px] uppercase tracking-[0.4px] text-ink-3">{k}</div>
      <div className="display mt-1 text-[16px] font-semibold">{v}</div>
      <div className="text-[10px] text-ink-3">{sub}</div>
    </div>
  );
}

function ActionBtn({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-md border border-rule bg-bg-1 px-2.5 py-1 text-[11px] text-ink-2 hover:bg-bg-2">
      {icon}
      {children}
    </button>
  );
}

function Block({
  title,
  sub,
  children,
  subtle,
  noBorder,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
  subtle?: boolean;
  noBorder?: boolean;
}) {
  return (
    <section
      className={`${noBorder ? "" : "border-b border-rule"} ${subtle ? "rounded-md border border-rule bg-bg-1 p-3" : "p-5"}`}
    >
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="display text-[14px] font-semibold">{title}</h2>
        {sub ? <span className="text-[10.5px] text-ink-3">{sub}</span> : null}
      </div>
      {children}
    </section>
  );
}

function Stat({ l, v }: { l: string; v: string }) {
  return (
    <div className="rounded-md bg-bg-2 px-2 py-1.5 text-center">
      <div className="text-[9px] text-ink-3">{l}</div>
      <div className="display mt-0.5 text-[13px] font-semibold">{v}</div>
    </div>
  );
}

function Cite({ children }: { children: React.ReactNode }) {
  return (
    <span className="mono mx-px rounded-sm border border-brand/40 bg-[var(--brand-soft)] px-1 py-px text-[9.5px] text-brand">
      {children}
    </span>
  );
}

function Trajectory() {
  const w = 760;
  const h = 200;
  const history = [40, 42, 45, 48, 52, 55, 58, 62, 65, 68, 70, 71];
  const proj = [71, 73, 76, 78, 79, 80, 81, 80, 79, 80, 82, 84];
  const xs = (i: number, total: number) => (i / (total - 1)) * (w - 24) + 12;
  const ys = (v: number) => h - 24 - (v / 100) * (h - 40);

  // Confidence cone for projection
  const coneTop = proj.map((v) => Math.min(100, v + 6 + 0.5 * proj.indexOf(v)));
  const coneBot = proj.map((v) => Math.max(0, v - 6 - 0.5 * proj.indexOf(v)));

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-[200px] w-full">
      {/* horizontal grid */}
      {[0, 25, 50, 75, 100].map((v) => (
        <line key={v} x1={12} x2={w - 12} y1={ys(v)} y2={ys(v)} stroke="var(--rule)" strokeDasharray="2 3" />
      ))}
      {/* optimal window shading */}
      <rect
        x={xs(11, history.length)}
        y={20}
        width={xs(5, history.length + proj.length) - xs(11, history.length)}
        height={h - 44}
        fill="var(--brand)"
        fillOpacity={0.08}
      />
      {/* projection confidence cone */}
      <polygon
        fill="var(--brand)"
        fillOpacity={0.16}
        points={[
          ...coneTop.map((v, i) => `${xs(history.length - 1 + i, history.length + proj.length)},${ys(v)}`),
          ...coneBot.slice().reverse().map((v, i) => `${xs(history.length + proj.length - 1 - i, history.length + proj.length)},${ys(v)}`),
        ].join(" ")}
      />
      {/* history line */}
      <path
        d={history.map((v, i) => (i === 0 ? "M" : "L") + xs(i, history.length + proj.length) + "," + ys(v)).join(" ")}
        fill="none"
        stroke="var(--ink-1)"
        strokeWidth={2}
      />
      {/* projection line */}
      <path
        d={proj.map((v, i) => (i === 0 ? "M" : "L") + xs(history.length - 1 + i, history.length + proj.length) + "," + ys(v)).join(" ")}
        fill="none"
        stroke="var(--brand)"
        strokeWidth={2}
        strokeDasharray="4 3"
      />
      {/* now marker */}
      <circle cx={xs(history.length - 1, history.length + proj.length)} cy={ys(history[history.length - 1])} r={4} fill="var(--brand)" />
      <text x={xs(history.length - 1, history.length + proj.length) + 8} y={ys(history[history.length - 1]) - 6} fontSize={9} fill="var(--brand)">
        NOW
      </text>
    </svg>
  );
}

// reserve Sparkles import for the Zawadi insight chip — explicit consume
void Sparkles;
