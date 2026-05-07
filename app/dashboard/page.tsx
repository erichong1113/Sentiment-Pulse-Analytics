import { CountryHeatmap } from "@/components/CountryHeatmap";
import { PageHeader } from "@/components/PageHeader";
import { countries } from "@/lib/stubs/countries";

function StatCard({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-panel/60 p-5">
      <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">
        {label}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-2xl font-semibold tabular-nums text-foreground">
          {value}
        </div>
        {delta ? (
          <span className="text-xs tabular-nums text-positive">{delta}</span>
        ) : null}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const avg =
    countries.reduce((acc, c) => acc + c.isi_score, 0) / countries.length;
  const strong = countries.filter((c) => c.isi_score >= 65).length;
  const weak = countries.filter((c) => c.isi_score < 50).length;

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="African Markets — ISI Heatmap"
        description="Live snapshot of the Investment Sentiment Index across our 15-country coverage. Click any tile to drill into the per-country detail view."
      />

      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Coverage" value={`${countries.length} markets`} />
        <StatCard label="Avg ISI" value={avg.toFixed(1)} delta="+1.2" />
        <StatCard label="Strong (≥65)" value={String(strong)} />
        <StatCard label="Weak (<50)" value={String(weak)} />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">Heatmap</h2>
          <div className="flex items-center gap-3 text-[11px] text-subtle">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-positive" />
              ≥ 65
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-warning" />
              50–64
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-negative" />
              &lt; 50
            </span>
          </div>
        </div>
        <CountryHeatmap countries={countries} />
      </section>
    </>
  );
}
