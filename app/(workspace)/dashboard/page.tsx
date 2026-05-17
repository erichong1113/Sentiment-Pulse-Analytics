import { FiltersPanel } from "@/components/shell/FiltersPanel";
import { Treemap } from "@/components/dashboard/Treemap";
import { KpiTile } from "@/components/dashboard/KpiTile";
import { countries } from "@/lib/stubs/countries";

export default function DashboardPage() {
  return (
    <>
      <FiltersPanel />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Scenario bar */}
        <div className="flex h-[42px] items-center gap-4 border-b border-rule bg-bg-1 px-[22px]">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--brand-soft)] px-2.5 py-1 text-[11.5px] font-medium text-ink-1">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Base case
          </span>
          <span className="mono text-[11px] text-ink-3">
            As of <span className="font-medium text-ink-2">11 May 2026 · 14:22 UTC</span> · 1W horizon
          </span>
          <div className="ml-auto flex rounded-md border border-rule bg-bg-0 p-0.5">
            {(["Compact", "Standard", "Present"] as const).map((d, i) => (
              <button
                key={d}
                type="button"
                className={`rounded-sm px-2.5 py-1 text-[11px] ${i === 1 ? "bg-bg-2 text-ink-1" : "text-ink-3 hover:text-ink-2"}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Coverage row */}
        <div className="flex items-baseline gap-7 border-b border-rule bg-bg-0 px-[22px] py-3">
          <CovItem n="39" l="Markets" />
          <CovItem n="8" l="Sectors" />
          <CovItem n="12" l="Currencies" />
          <CovItem n="4" l="Risk indices" />
          <div className="flex-1" />
          <div className="max-w-[320px] text-right text-[10.5px] leading-snug text-ink-3">
            <span className="dotted-u">Methodology</span> · ISI v2.3 — macro 30% · political 25% · FX 20% · capital depth 15% · ESG 10%
          </div>
        </div>

        {/* KPI tiles */}
        <div className="grid grid-cols-4 border-b border-rule bg-bg-0">
          <KpiTile
            label="Top performer · 1W"
            value={<span className="text-pos">KEN</span>}
            unit="+2.30%"
            tone="pos"
            sub={
              <>
                Kenya · East Africa · <span className="mono text-pos-deep">▲ 2.30</span> vs. region 0.42
              </>
            }
            foot={
              <>
                USD index · vs. prior week close · <span className="dotted-u">method</span>
              </>
            }
          />
          <KpiTile
            label="Universe avg · 1W"
            value="+0.62"
            unit="%"
            tone="brand"
            sub="GDP-weighted across 36 tracked markets"
            foot={
              <>
                Excludes ZWE, SSD, ERI · <span className="dotted-u">method</span>
              </>
            }
          />
          <KpiTile
            label="Highest vol · σ"
            value={<span className="text-neg">ZAF</span>}
            unit="3.21σ"
            tone="neg"
            sub={
              <>
                South Africa · <span className="mono text-neg-deep">▼ 3.33</span> · 2 SD from mean
              </>
            }
            foot={
              <>
                Realized 1W vol, USD terms · <span className="dotted-u">method</span>
              </>
            }
          />
          <KpiTile
            label="Active ISI signals ≥ 70"
            value="14"
            unit=" / 39"
            tone="brand"
            sub={
              <>
                <span className="mono text-pos-deep">▲ 3</span> new since yesterday · 36% coverage
              </>
            }
            foot={
              <>
                Threshold configurable · <span className="dotted-u">method</span>
              </>
            }
          />
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3.5 border-b border-rule bg-bg-1 px-[22px] py-2">
          <p className="flex-1 text-[11.5px] text-ink-2">
            African markets · grouped by <strong className="font-medium text-ink-1">region</strong>{" "}
            · area = <strong className="font-medium text-ink-1">nominal GDP (USD)</strong> · colour ={" "}
            <strong className="font-medium text-ink-1">1W performance</strong>
          </p>
          <Seg options={["▦ Treemap", "⋮ List", "◐ Compare"]} active={0} />
          <Seg options={["Default", "CB-safe"]} active={0} />
          <button
            type="button"
            className="rounded-md border border-dashed border-rule-2 px-2.5 py-1 text-[11px] text-ink-2 hover:border-solid hover:border-brand hover:text-brand"
          >
            ＋ Add metric
          </button>
        </div>

        {/* Treemap canvas */}
        <div className="min-h-0 flex-1">
          <Treemap countries={countries} />
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3.5 border-t border-rule bg-bg-1 px-[22px] py-2 text-[10.5px] text-ink-3">
          <span>1W performance</span>
          <div className="flex items-center gap-px">
            <span className="mono pr-1">−3.5</span>
            {[
              "oklch(0.46 0.16 30)",
              "oklch(0.56 0.15 35)",
              "oklch(0.66 0.13 40)",
              "oklch(0.30 0.014 75)",
              "oklch(0.60 0.10 180)",
              "oklch(0.50 0.10 185)",
              "oklch(0.40 0.10 190)",
            ].map((c, i) => (
              <span
                key={i}
                className="block h-2 w-[18px]"
                style={{ background: c }}
              />
            ))}
            <span className="mono pl-1">+3.5%</span>
          </div>
          <span className="h-3.5 w-px bg-rule" />
          <span>Area = GDP</span>
          <span className="h-3.5 w-px bg-rule" />
          <span className="mono inline-flex items-center gap-1 rounded border border-brand px-1.5 py-px text-[9.5px] font-medium text-brand">
            ISI 70+
          </span>
          <span>= signal</span>
          <span className="ml-auto italic">Tabular figures · last tick 14:22 UTC</span>
        </div>
      </main>
    </>
  );
}

function CovItem({ n, l }: { n: string; l: string }) {
  return (
    <div className="flex flex-col gap-px">
      <span className="mono text-[16px] font-medium leading-tight tracking-[-0.2px] text-ink-1">
        {n}
      </span>
      <span className="text-[10px] uppercase tracking-[0.4px] text-ink-3">
        {l}
      </span>
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
