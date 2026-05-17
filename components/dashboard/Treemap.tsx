"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Link from "next/link";
import type { Country, Region } from "@/types";
import { countrySlug } from "@/lib/stubs/countries";

interface TreemapProps {
  countries: Country[];
}

// Colour mapping for 1W performance, mirroring the mockup's bin breakpoints.
// Teal-green for positive, burnt-orange for negative.
function perfColor(v: number): string {
  if (v >= 2.5) return "oklch(0.40 0.10 190)";
  if (v >= 1.5) return "oklch(0.50 0.10 188)";
  if (v >= 0.5) return "oklch(0.60 0.10 185)";
  if (v >= 0) return "oklch(0.50 0.05 180)";
  if (v >= -0.3) return "oklch(0.36 0.02 75)";
  if (v >= -1.2) return "oklch(0.62 0.12 40)";
  if (v >= -2.0) return "oklch(0.54 0.14 35)";
  return "oklch(0.44 0.16 30)";
}

const REGIONS: Region[] = [
  "North Africa",
  "West Africa",
  "East Africa",
  "Southern Africa",
  "Central Africa",
];

interface TooltipState {
  show: boolean;
  x: number;
  y: number;
  country?: Country;
}

export function Treemap({ countries }: TreemapProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    show: false,
    x: 0,
    y: 0,
  });
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Observe wrapper size so the treemap re-flows on container resize.
  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize({ w: Math.floor(width), h: Math.floor(height) });
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // Render whenever the data or container size changes.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const { w, h } = size;
    if (!w || !h) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute("width", String(w));
    svg.setAttribute("height", String(h));

    type Datum = Country & { value: number };
    type Node = { name: string; children?: Array<Node | Datum>; value?: number };

    const root: Node = {
      name: "Africa",
      children: REGIONS.map((r) => ({
        name: r,
        children: countries
          .filter((c) => c.region === r)
          .map<Datum>((c) => ({ ...c, value: c.gdp_estimate_usd_b })),
      })),
    };

    const hierarchy = d3
      .hierarchy<Node | Datum>(root)
      // d3 hierarchy uses .value for sizing — fall through to gdp.
      .sum((d) => ("gdp_estimate_usd_b" in d ? d.gdp_estimate_usd_b : 0))
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    d3
      .treemap<Node | Datum>()
      .size([w, h])
      .paddingOuter(8)
      .paddingTop(22)
      .paddingInner(3)
      .round(true)(hierarchy as d3.HierarchyNode<Node | Datum>);

    const ns = "http://www.w3.org/2000/svg";
    const el = (
      tag: string,
      attrs: Record<string, string | number> = {},
      parent?: SVGElement,
    ) => {
      const e = document.createElementNS(ns, tag);
      for (const k in attrs) e.setAttribute(k, String(attrs[k]));
      if (parent) parent.appendChild(e);
      return e;
    };

    // Region group rectangles + label.
    for (const region of (hierarchy.children ?? []) as Array<
      d3.HierarchyRectangularNode<Node | Datum>
    >) {
      el(
        "rect",
        {
          x: region.x0,
          y: region.y0,
          width: region.x1 - region.x0,
          height: region.y1 - region.y0,
          fill: "oklch(0.22 0.012 75)",
          stroke: "oklch(0.30 0.012 75)",
          "stroke-width": 1,
          rx: 5,
        },
        svg as unknown as SVGElement,
      );
      const t = el(
        "text",
        {
          x: region.x0 + 10,
          y: region.y0 + 14,
          fill: "oklch(0.60 0.012 80)",
          "font-family": "Inter, sans-serif",
          "font-size": 10,
          "font-weight": 600,
          "letter-spacing": 1,
        },
        svg as unknown as SVGElement,
      );
      t.textContent = region.data.name.toUpperCase();
    }

    // Leaf tiles (countries).
    for (const leaf of hierarchy.leaves() as Array<
      d3.HierarchyRectangularNode<Datum>
    >) {
      const d = leaf.data;
      const x = leaf.x0,
        y = leaf.y0,
        w0 = leaf.x1 - leaf.x0,
        h0 = leaf.y1 - leaf.y0;

      const a = el("a", {}, svg as unknown as SVGElement);
      a.setAttribute("href", `/sentiment-isi/${countrySlug(d)}`);

      const g = el("g", { cursor: "pointer" }, a as unknown as SVGElement);
      const rect = el(
        "rect",
        {
          x,
          y,
          width: w0,
          height: h0,
          fill: perfColor(d.perf_1w),
          stroke: "rgba(0,0,0,0.25)",
          "stroke-width": 0.5,
          rx: 3,
        },
        g as unknown as SVGElement,
      );

      // ISI ≥ 70 → outlined ISI badge in the corner (signal callout).
      if (d.isi_score >= 70 && w0 > 46) {
        el(
          "rect",
          {
            x: x + w0 - 32,
            y: y + 5,
            width: 28,
            height: 13,
            rx: 3,
            fill: "oklch(0.18 0.012 75)",
            stroke: "oklch(0.78 0.13 75)",
            "stroke-width": 0.8,
          },
          g as unknown as SVGElement,
        );
        const tx = el(
          "text",
          {
            x: x + w0 - 18,
            y: y + 12.5,
            "text-anchor": "middle",
            "dominant-baseline": "middle",
            fill: "oklch(0.78 0.13 75)",
            "font-family": "var(--font-jet), JetBrains Mono, monospace",
            "font-weight": 500,
            "font-size": 8.5,
          },
          g as unknown as SVGElement,
        );
        tx.textContent = `ISI ${d.isi_score}`;
      }

      // ISO-3 code in the middle, scale-tier'd font size.
      if (w0 > 40 && h0 > 28) {
        const fs =
          w0 > 120 && h0 > 90
            ? 30
            : w0 > 80 && h0 > 65
              ? 20
              : w0 > 55 && h0 > 42
                ? 14
                : 10;
        const code = el(
          "text",
          {
            x: x + w0 / 2,
            y: h0 > 64 ? y + h0 / 2 - 6 : y + h0 / 2 + 3,
            "text-anchor": "middle",
            "dominant-baseline": "middle",
            fill: "rgba(255,255,255,0.96)",
            "font-family": "Inter, sans-serif",
            "font-weight": 700,
            "font-size": fs,
            "letter-spacing": -0.4,
          },
          g as unknown as SVGElement,
        );
        code.textContent = d.iso3;
      }

      // Performance number underneath the code on big-enough tiles.
      if (w0 > 50 && h0 > 64) {
        const perfText = el(
          "text",
          {
            x: x + w0 / 2,
            y: y + h0 / 2 + (w0 > 100 ? 20 : 14),
            "text-anchor": "middle",
            "dominant-baseline": "middle",
            fill: "rgba(255,255,255,0.72)",
            "font-family": "var(--font-jet), JetBrains Mono, monospace",
            "font-weight": 400,
            "font-size": w0 > 100 ? 11 : 9.5,
          },
          g as unknown as SVGElement,
        );
        perfText.textContent =
          (d.perf_1w > 0 ? "+" : "") + d.perf_1w.toFixed(2) + "%";
      }

      g.addEventListener("mouseenter", () =>
        rect.setAttribute("stroke", "rgba(255,255,255,0.4)"),
      );
      g.addEventListener("mouseleave", () => {
        rect.setAttribute("stroke", "rgba(0,0,0,0.25)");
        setTooltip((t) => ({ ...t, show: false }));
      });
      g.addEventListener("mousemove", (e) => {
        setTooltip({
          show: true,
          x: (e as MouseEvent).clientX + 16,
          y: (e as MouseEvent).clientY - 30,
          country: d,
        });
      });
    }
  }, [size, countries]);

  return (
    <div
      ref={wrapRef}
      className="relative h-full w-full bg-bg-0"
      style={{ minHeight: 320 }}
    >
      <svg ref={svgRef} className="block h-full w-full" />

      {tooltip.show && tooltip.country ? (
        <TreemapTooltip
          country={tooltip.country}
          x={tooltip.x}
          y={tooltip.y}
        />
      ) : null}

      {/* Hidden link wrappers in the SVG are SVGAElement — wrapped via Next
          Link below for keyboard navigability in a future pass. */}
      <span className="sr-only">
        <Link href="/sentiment-isi/kenya">Open Kenya detail</Link>
      </span>
    </div>
  );
}

function TreemapTooltip({
  country,
  x,
  y,
}: {
  country: Country;
  x: number;
  y: number;
}) {
  const p = country.perf_1w;
  return (
    <div
      className="pointer-events-none fixed z-50 min-w-[200px] rounded-lg border border-rule-2 bg-bg-2 px-3.5 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
      style={{ left: x, top: y }}
    >
      <div className="text-[13.5px] font-semibold text-ink-1">
        {country.name} · {country.iso3}
      </div>
      <div className="mb-2 text-[10px] uppercase tracking-[0.6px] text-ink-3">
        {country.region}
      </div>
      <Row k="1W perf" v={`${p > 0 ? "+" : ""}${p.toFixed(2)}%`} tone={p >= 0 ? "pos" : "neg"} />
      <Row k="ISI" v={`${country.isi_score} / 100`} tone="brand" />
      <Row k="GDP (USD)" v={`$${country.gdp_estimate_usd_b}B`} />
      <div className="mt-2.5">
        <div className="mb-1 flex items-center justify-between text-[10px] text-ink-3">
          <span>ISI score</span>
          <span className="mono text-ink-2">{country.isi_score}/100</span>
        </div>
        <div className="h-[3px] overflow-hidden rounded-sm bg-rule">
          <div
            className="h-full"
            style={{
              width: `${country.isi_score}%`,
              background:
                "linear-gradient(90deg, var(--brand-soft), var(--brand))",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function Row({
  k,
  v,
  tone,
}: {
  k: string;
  v: string;
  tone?: "pos" | "neg" | "brand";
}) {
  const toneClass =
    tone === "pos"
      ? "text-pos"
      : tone === "neg"
        ? "text-neg"
        : tone === "brand"
          ? "text-brand"
          : "text-ink-1";
  return (
    <div className="mt-1 flex justify-between text-[11px]">
      <span className="text-ink-3">{k}</span>
      <span className={`mono ${toneClass}`}>{v}</span>
    </div>
  );
}
