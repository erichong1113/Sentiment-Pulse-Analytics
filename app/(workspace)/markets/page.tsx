import Link from "next/link";
import { countries, countrySlug } from "@/lib/stubs/countries";
import { FiltersPanel } from "@/components/shell/FiltersPanel";

// Markets list — flat table of the whole universe. We render this as the
// "List" alternative to the dashboard's treemap view.
export default function MarketsPage() {
  return (
    <>
      <FiltersPanel />
      <main className="min-w-0 flex-1 overflow-y-auto bg-bg-0 p-4">
        <div className="mb-4">
          <h1 className="text-[22px] font-semibold tracking-tight">Markets</h1>
          <p className="text-[12px] text-ink-2">
            Coverage universe — 30 markets, ranked by ISI. Click any row to open the per-country detail.
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-rule bg-bg-1">
          <table className="w-full border-collapse text-[12px]">
            <thead className="bg-bg-2 text-[10px] uppercase tracking-[0.4px] text-ink-3">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium">Market</th>
                <th className="px-4 py-2.5 text-left font-medium">Region</th>
                <th className="px-4 py-2.5 text-right font-medium">ISI</th>
                <th className="px-4 py-2.5 text-right font-medium">1W</th>
                <th className="px-4 py-2.5 text-right font-medium">GDP (USD)</th>
                <th className="px-4 py-2.5 text-left font-medium">Sectors</th>
              </tr>
            </thead>
            <tbody>
              {[...countries]
                .sort((a, b) => b.isi_score - a.isi_score)
                .map((c) => (
                  <tr key={c.code} className="border-t border-rule hover:bg-bg-2">
                    <td className="px-4 py-2.5">
                      <Link
                        href={`/sentiment-isi/${countrySlug(c)}`}
                        className="flex items-baseline gap-2 hover:text-brand"
                      >
                        <span className="mono text-[10px] text-ink-3">{c.iso3}</span>
                        <span className="font-medium text-ink-1">{c.name}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-ink-2">{c.region}</td>
                    <td
                      className={`mono px-4 py-2.5 text-right ${
                        c.isi_score >= 70 ? "text-pos" : c.isi_score >= 50 ? "text-brand" : "text-neg"
                      }`}
                    >
                      {c.isi_score}
                    </td>
                    <td
                      className={`mono px-4 py-2.5 text-right ${c.perf_1w >= 0 ? "text-pos" : "text-neg"}`}
                    >
                      {c.perf_1w >= 0 ? "+" : ""}
                      {c.perf_1w.toFixed(2)}%
                    </td>
                    <td className="mono px-4 py-2.5 text-right text-ink-2">
                      ${c.gdp_estimate_usd_b}B
                    </td>
                    <td className="px-4 py-2.5 text-[11px] text-ink-3">
                      {c.sectors.slice(0, 3).join(" · ")}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
