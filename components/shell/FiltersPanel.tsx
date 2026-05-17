"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

// Three signal cards mirror the mockup's "what are you screening for?" pattern.
// Click-to-select is local state — the routing decision (which page to land
// on per signal) will come once we wire real data flows.
const signals = [
  {
    id: "isi",
    name: "Where to invest",
    version: "ISI v2.3",
    desc: "Investment Suitability — macro, political, FX, capital depth.",
    foot: [
      { k: "39", v: "markets" },
      { k: "14", v: "sources" },
      { k: "0.87", v: "conf." },
    ],
  },
  {
    id: "meti",
    name: "When to invest",
    version: "METI v1.4",
    desc: "Market Entry Timing — z-scored momentum + macro turning points.",
  },
  {
    id: "sentiment",
    name: "Sentiment Index",
    version: "SI v3.0",
    desc: "NLP across 11.4k sources, 28-day rolling.",
  },
];

const horizons = ["1D", "1W", "1M", "3M", "1Y"] as const;

const sectors = [
  { name: "Energy & Renewables", pct: "28%", on: true },
  { name: "Technology & Fintech", pct: "19%", on: true },
  { name: "Infrastructure", pct: "14%", on: false },
  { name: "Agriculture", pct: "11%", on: false },
  { name: "Manufacturing", pct: "9%", on: false },
  { name: "Healthcare", pct: "8%", on: false },
  { name: "Financial Markets", pct: "7%", on: false },
  { name: "Tourism", pct: "4%", on: false },
];

export function FiltersPanel() {
  const [activeSignal, setActiveSignal] = useState("isi");
  const [horizon, setHorizon] = useState<(typeof horizons)[number]>("1W");
  const [selectedSectors, setSelectedSectors] = useState<Set<string>>(
    new Set(sectors.filter((s) => s.on).map((s) => s.name)),
  );
  const [currency, setCurrency] = useState<"USD" | "EUR" | "Local">("USD");

  return (
    <aside className="hidden w-[280px] shrink-0 overflow-y-auto border-r border-rule bg-bg-1 px-[14px] py-4 pb-6 lg:block">
      <SectionLabel>What are you screening for?</SectionLabel>
      <div className="space-y-1.5">
        {signals.map((s) => {
          const on = activeSignal === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSignal(s.id)}
              className={cn(
                "relative w-full overflow-hidden rounded-lg border bg-bg-2 px-3 py-2.5 text-left",
                on ? "border-brand" : "border-rule",
              )}
            >
              {on ? (
                <span className="absolute inset-y-0 left-0 w-0.5 bg-brand" />
              ) : null}
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-[12.5px] font-medium text-ink-1">
                  {s.name}
                </span>
                <span className="mono text-[9.5px] text-ink-3">{s.version}</span>
              </div>
              <p className="text-[11px] leading-snug text-ink-3">{s.desc}</p>
              {s.foot ? (
                <div className="mt-2 flex gap-3 border-t border-dashed border-rule-2 pt-2 text-[10px] text-ink-3">
                  {s.foot.map((f) => (
                    <span key={f.v}>
                      <strong className="font-medium text-ink-2">{f.k}</strong>{" "}
                      {f.v}
                    </span>
                  ))}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>

      <SectionLabel className="mt-4">As-of horizon</SectionLabel>
      <div className="grid grid-cols-5 gap-px rounded-md bg-rule p-0.5">
        {horizons.map((h) => (
          <button
            key={h}
            type="button"
            onClick={() => setHorizon(h)}
            className={cn(
              "mono rounded-sm py-1.5 text-[11px] transition-colors",
              horizon === h
                ? "bg-bg-3 text-ink-1"
                : "text-ink-3 hover:text-ink-2",
            )}
          >
            {h}
          </button>
        ))}
      </div>

      <SectionLabel
        className="mt-4 flex items-baseline justify-between"
        hint={`${selectedSectors.size} / ${sectors.length}`}
      >
        Sector universe
      </SectionLabel>
      <ul>
        {sectors.map((s) => {
          const on = selectedSectors.has(s.name);
          return (
            <li
              key={s.name}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1.5 hover:bg-bg-2"
              onClick={() => {
                setSelectedSectors((prev) => {
                  const next = new Set(prev);
                  if (next.has(s.name)) next.delete(s.name);
                  else next.add(s.name);
                  return next;
                });
              }}
            >
              <span
                className={cn(
                  "grid h-[14px] w-[14px] place-items-center rounded-[3px] border-[1.5px]",
                  on
                    ? "border-brand bg-brand"
                    : "border-ink-3",
                )}
              >
                {on ? (
                  <span className="block h-[3px] w-[6px] -translate-y-px rotate-[-45deg] border-b-[1.5px] border-l-[1.5px] border-bg-0" />
                ) : null}
              </span>
              <span
                className={cn(
                  "flex-1 text-[11.5px]",
                  on ? "text-ink-1" : "text-ink-2",
                )}
              >
                {s.name}
              </span>
              <span className="mono text-[10px] text-ink-3">{s.pct}</span>
            </li>
          );
        })}
      </ul>

      <SectionLabel className="mt-4">Currency</SectionLabel>
      <div className="grid grid-cols-3 gap-px rounded-md bg-rule p-0.5">
        {(["USD", "EUR", "Local"] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCurrency(c)}
            className={cn(
              "rounded-sm py-1.5 text-[11px]",
              currency === c
                ? "bg-bg-3 text-ink-1"
                : "text-ink-3 hover:text-ink-2",
            )}
          >
            {c}
          </button>
        ))}
      </div>
    </aside>
  );
}

function SectionLabel({
  children,
  hint,
  className,
}: {
  children: React.ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-2.5 mt-4 text-[10px] font-semibold uppercase tracking-[0.8px] text-ink-3 first:mt-0",
        className,
      )}
    >
      <span>{children}</span>
      {hint ? (
        <span className="font-medium normal-case tracking-normal text-ink-3">
          {" "}
          {hint}
        </span>
      ) : null}
    </div>
  );
}
