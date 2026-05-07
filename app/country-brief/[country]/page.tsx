import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, AlertTriangle, Sparkles } from "lucide-react";
import { BriefSection } from "@/components/BriefSection";
import { PageHeader } from "@/components/PageHeader";
import { countrySlug, findCountry } from "@/lib/stubs/countries";
import { getCountryBrief } from "@/lib/stubs/countryBrief";
import { cn } from "@/lib/cn";

interface PageProps {
  params: Promise<{ country: string }>;
}

const severityToken = {
  low: "text-muted border-border bg-elevated/40",
  medium: "text-warning border-warning/30 bg-warning-soft/60",
  high: "text-negative border-negative/30 bg-negative-soft/60",
} as const;

function formatTimestamp(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function CountryBriefPage({ params }: PageProps) {
  const { country: countryParam } = await params;
  const country = findCountry(countryParam);
  if (!country) notFound();

  const brief = getCountryBrief(country.code);

  return (
    <>
      <Link
        href={`/sentiment-isi/${countrySlug(country)}`}
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground"
      >
        <ArrowLeft size={13} strokeWidth={1.75} />
        Back to {country.name}
      </Link>

      <PageHeader
        eyebrow={`${country.region} · Country Brief`}
        title={brief.title}
        description={`AI-generated · ${formatTimestamp(brief.generated_at)}`}
        actions={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-soft px-2.5 py-1 text-[11px] text-accent">
            <Sparkles size={12} strokeWidth={2} />
            Draft
          </span>
        }
      />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2 lg:row-span-2">
          <BriefSection title="Summary" summary={brief.summary} />
        </div>

        <BriefSection title="Key drivers">
          <ul className="space-y-4">
            {brief.key_drivers.map((d, i) => (
              <li key={i} className="text-sm leading-relaxed text-foreground/90">
                <span>{d.text}</span>{" "}
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-0.5 inline-flex items-baseline gap-1 align-baseline text-xs text-accent hover:underline"
                >
                  [{d.source}]
                </a>
              </li>
            ))}
          </ul>
        </BriefSection>

        <BriefSection title="Risks">
          <ul className="space-y-3">
            {brief.risks.map((r, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm leading-relaxed text-foreground/90"
              >
                <span
                  className={cn(
                    "mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                    severityToken[r.severity],
                  )}
                >
                  <AlertTriangle size={10} strokeWidth={2} />
                  {r.severity}
                </span>
                <span>{r.text}</span>
              </li>
            ))}
          </ul>
        </BriefSection>
      </div>

      <p className="mt-6 text-[11px] text-subtle">
        Briefs are AI-generated drafts pending analyst review. Citations link to
        source articles ingested by the Kilwa pipeline.
      </p>
    </>
  );
}
