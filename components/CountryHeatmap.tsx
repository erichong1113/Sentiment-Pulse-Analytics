"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Country } from "@/types";
import { isiTierToken } from "@/lib/isi";
import { cn } from "@/lib/cn";
import { countrySlug } from "@/lib/stubs/countries";

interface CountryHeatmapProps {
  countries: Country[];
}

export function CountryHeatmap({ countries }: CountryHeatmapProps) {
  // Sort by GDP so the largest economies anchor the top-left of the grid —
  // gives the page a natural reading order without needing a real treemap lib.
  const sorted = [...countries].sort(
    (a, b) => b.gdp_estimate_usd_b - a.gdp_estimate_usd_b,
  );

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {sorted.map((country) => {
        const t = isiTierToken(country.isi_score);
        return (
          <Link
            key={country.code}
            href={`/sentiment-isi/${countrySlug(country)}`}
            className={cn(
              "group relative flex h-32 flex-col justify-between rounded-lg border bg-panel/60 p-4 transition-all hover:bg-panel hover:shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]",
              t.border,
            )}
          >
            <div
              className="absolute inset-x-0 top-0 h-[2px] rounded-t-lg opacity-70"
              style={{ background: t.swatch }}
            />

            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-foreground">
                  {country.name}
                </div>
                <div className="mt-0.5 text-[11px] uppercase tracking-wider text-subtle">
                  {country.region}
                </div>
              </div>
              <ArrowUpRight
                size={14}
                strokeWidth={1.75}
                className="text-subtle opacity-0 transition-opacity group-hover:opacity-100"
              />
            </div>

            <div className="flex items-end justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-subtle">
                  ISI
                </span>
                <span
                  className="text-2xl font-semibold tabular-nums"
                  style={{ color: t.swatch }}
                >
                  {country.isi_score}
                </span>
              </div>
              <span className="text-[11px] tabular-nums text-muted">
                ${country.gdp_estimate_usd_b.toFixed(1)}B
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
