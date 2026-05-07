import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { ChartPlaceholder } from "@/components/ChartPlaceholder";
import { ISIScoreBadge } from "@/components/ISIScoreBadge";
import { PageHeader } from "@/components/PageHeader";
import { countrySlug, findCountry } from "@/lib/stubs/countries";
import { getSentimentISI } from "@/lib/stubs/sentimentISI";
import { topDrivers } from "@/lib/stubs/topDrivers";
import { DriverCard } from "@/components/DriverCard";

interface PageProps {
  params: Promise<{ country: string }>;
}

export default async function SentimentISIPage({ params }: PageProps) {
  const { country: countryParam } = await params;
  const country = findCountry(countryParam);
  if (!country) notFound();

  const series = getSentimentISI(country.code);
  const latest = series[series.length - 1];
  const first = series[0];
  const sentimentDelta = latest.sentiment_isi - first.sentiment_isi;
  const macroDelta = latest.macro_isi - first.macro_isi;

  return (
    <>
      <Link
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground"
      >
        <ArrowLeft size={13} strokeWidth={1.75} />
        Back to dashboard
      </Link>

      <PageHeader
        eyebrow={country.region}
        title={country.name}
        description={`14-day Sentiment ISI vs Macro ISI for ${country.name}. Sectors in coverage: ${country.sectors.join(", ")}.`}
        actions={
          <>
            <ISIScoreBadge score={latest.sentiment_isi} label="Sentiment" />
            <ISIScoreBadge score={latest.macro_isi} label="Macro" />
            <Link
              href={`/country-brief/${countrySlug(country)}`}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-elevated/60 px-3 py-1.5 text-xs text-foreground hover:bg-elevated"
            >
              <FileText size={13} strokeWidth={1.75} />
              View brief
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-panel/60 p-5">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-sm font-medium text-foreground">
              Sentiment ISI
            </h2>
            <div className="text-xs tabular-nums text-muted">
              {latest.sentiment_isi}{" "}
              <span
                className={
                  sentimentDelta >= 0 ? "text-positive" : "text-negative"
                }
              >
                ({sentimentDelta >= 0 ? "+" : ""}
                {sentimentDelta.toFixed(1)})
              </span>
            </div>
          </div>
          <ChartPlaceholder
            data={series}
            xKey="date"
            series={[
              {
                dataKey: "sentiment_isi",
                label: "Sentiment ISI",
                color: "var(--accent)",
              },
            ]}
          />
        </div>

        <div className="rounded-lg border border-border bg-panel/60 p-5">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-sm font-medium text-foreground">Macro ISI</h2>
            <div className="text-xs tabular-nums text-muted">
              {latest.macro_isi}{" "}
              <span
                className={macroDelta >= 0 ? "text-positive" : "text-negative"}
              >
                ({macroDelta >= 0 ? "+" : ""}
                {macroDelta.toFixed(1)})
              </span>
            </div>
          </div>
          <ChartPlaceholder
            data={series}
            xKey="date"
            series={[
              {
                dataKey: "macro_isi",
                label: "Macro ISI",
                color: "var(--positive)",
              },
            ]}
          />
        </div>
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">Top drivers</h2>
          <Link
            href="/top-drivers"
            className="text-xs text-muted hover:text-foreground"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {topDrivers.slice(0, 4).map((d) => (
            <DriverCard key={d.id} driver={d} />
          ))}
        </div>
      </section>
    </>
  );
}
