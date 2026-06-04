"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { Country } from "@/types";

interface TreemapProps {
  countries: Country[];
}

// Colour by real GDP growth: teal for expanding economies, burnt-orange for
// contracting ones. Deeper shade = stronger move in that direction.
function growthColor(v: number): string {
  if (v >= 6) return "oklch(0.40 0.10 190)";
  if (v >= 4) return "oklch(0.50 0.10 188)";
  if (v >= 2) return "oklch(0.60 0.10 185)";
  if (v >= 0) return "oklch(0.50 0.05 180)";
  if (v >= -2) return "oklch(0.62 0.12 40)";
  if (v >= -4) return "oklch(0.54 0.14 35)";
  return "oklch(0.44 0.16 30)";
}

// "$434B" / "$1.2T" from a USD-billions figure.
function fmtGdp(b: number): string {
  return b >= 1000 ? `$${(b / 1000).toFixed(2)}T` : `$${Math.round(b)}B`;
}

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

    // Only group by the regions actually present in the data, so we don't draw
    // empty "section of Africa" boxes.
    const presentRegions = Array.from(new Set(countries.map((c) => c.region)));

    const root: Node = {
      name: "Africa",
      children: presentRegions.map((r) => ({
        name: r,
        children: countries
          .filter((c) => c.region === r)
          .map<Datum>((c) => ({ ...c, value: c.gdp_usd_b })),
      })),
    };

    const hierarchy = d3
      .hierarchy<Node | Datum>(root)
      // Area ∝ √GDP. A plain GDP scale makes small economies (Rwanda) a
      // sliver next to Nigeria; the sqrt scale keeps the ordering but gives
      // smaller markets enough room to read.
      .sum((d) => ("gdp_usd_b" in d ? Math.sqrt(d.gdp_usd_b) : 0))
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

      const g = el("g", { cursor: "pointer" }, svg as unknown as SVGElement);
      const rect = el(
        "rect",
        {
          x,
          y,
          width: w0,
          height: h0,
          fill: growthColor(d.gdp_growth),
          stroke: "rgba(0,0,0,0.25)",
          "stroke-width": 0.5,
          rx: 3,
        },
        g as unknown as SVGElement,
      );

      // ISI score — boxed badge in the top-right corner, orange.
      if (d.isi_score != null && w0 > 66 && h0 > 26) {
        const label = `ISI ${d.isi_score.toFixed(1)}`;
        const fs = 10;
        const boxW = label.length * (fs * 0.6) + 12;
        const boxH = 15;
        const bx = x + w0 - boxW - 6;
        const by = y + 6;
        el(
          "rect",
          {
            x: bx,
            y: by,
            width: boxW,
            height: boxH,
            rx: 4,
            fill: "rgba(0,0,0,0.28)",
            stroke: "#fb923c",
            "stroke-width": 0.8,
          },
          g as unknown as SVGElement,
        );
        const isiText = el(
          "text",
          {
            x: bx + boxW / 2,
            y: by + boxH / 2 + 0.5,
            "text-anchor": "middle",
            "dominant-baseline": "middle",
            fill: "#fb923c",
            "font-family": "var(--font-jet), JetBrains Mono, monospace",
            "font-weight": 500,
            "font-size": fs,
          },
          g as unknown as SVGElement,
        );
        isiText.textContent = label;
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
            y: h0 > 64 ? y + h0 / 2 - 8 : y + h0 / 2 + 3,
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

      // GDP figure under the code on big-enough tiles.
      if (w0 > 50 && h0 > 64) {
        const gdpText = el(
          "text",
          {
            x: x + w0 / 2,
            y: y + h0 / 2 + (w0 > 100 ? 16 : 12),
            "text-anchor": "middle",
            "dominant-baseline": "middle",
            fill: "rgba(255,255,255,0.92)",
            "font-family": "var(--font-jet), JetBrains Mono, monospace",
            "font-weight": 500,
            "font-size": w0 > 100 ? 14 : 11,
          },
          g as unknown as SVGElement,
        );
        gdpText.textContent = fmtGdp(d.gdp_usd_b);

        // Growth line below the GDP figure on the largest tiles.
        if (h0 > 96) {
          const growthText = el(
            "text",
            {
              x: x + w0 / 2,
              y: y + h0 / 2 + (w0 > 100 ? 36 : 28),
              "text-anchor": "middle",
              "dominant-baseline": "middle",
              fill: "rgba(255,255,255,0.7)",
              "font-family": "var(--font-jet), JetBrains Mono, monospace",
              "font-weight": 400,
              "font-size": 10,
            },
            g as unknown as SVGElement,
          );
          growthText.textContent =
            (d.gdp_growth > 0 ? "+" : "") + d.gdp_growth.toFixed(1) + "% GDP growth";
        }
      }

      g.addEventListener("mouseenter", () =>
        rect.setAttribute("stroke", "rgba(255,255,255,0.4)"),
      );
      g.addEventListener("mouseleave", () => {
        rect.setAttribute("stroke", "rgba(0,0,0,0.25)");
        setTooltip((t) => ({ ...t, show: false }));
      });
      g.addEventListener("mousemove", (e) => {
        const me = e as MouseEvent;
        // Keep the tooltip fully on-screen: flip left near the right edge and
        // up near the bottom, so it never covers the legend or clips off-frame.
        const ttW = 250;
        const ttH = 300;
        let tx = me.clientX + 16;
        let ty = me.clientY - 30;
        if (tx + ttW > window.innerWidth) tx = me.clientX - ttW - 16;
        if (ty + ttH > window.innerHeight) ty = window.innerHeight - ttH - 8;
        if (ty < 8) ty = 8;
        setTooltip({ show: true, x: tx, y: ty, country: d });
      });
    }
  }, [size, countries]);

  return (
    <div
      ref={wrapRef}
      className="relative h-full w-full bg-bg-0"
      style={{ minHeight: 160 }}
    >
      <svg ref={svgRef} className="block h-full w-full" />

      {tooltip.show && tooltip.country ? (
        <TreemapTooltip
          country={tooltip.country}
          x={tooltip.x}
          y={tooltip.y}
        />
      ) : null}
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
  const g = country.gdp_growth;
  const num = (v: number | null | undefined, suffix = "", dp = 1) =>
    v == null ? "—" : `${v.toFixed(dp)}${suffix}`;
  return (
    <div
      className="pointer-events-none fixed z-50 min-w-[230px] rounded-lg border border-rule-2 bg-bg-2 px-3.5 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
      style={{ left: x, top: y }}
    >
      <div className="text-[13.5px] font-semibold text-ink-1">
        {country.name} · {country.iso3}
      </div>
      <div className="mb-2 text-[10px] uppercase tracking-[0.6px] text-ink-3">
        {country.region}
      </div>
      {country.isi_score != null ? (
        <div className="mt-1 flex justify-between gap-4 text-[11px]">
          <span className="text-ink-3">ISI score</span>
          <span className="mono font-medium" style={{ color: "#fb923c" }}>
            {country.isi_score.toFixed(1)}
          </span>
        </div>
      ) : null}
      <Row k="GDP (USD)" v={`$${country.gdp_usd_b.toLocaleString()}B`} />
      <Row
        k="Real GDP growth"
        v={`${g > 0 ? "+" : ""}${g.toFixed(1)}%`}
        tone={g >= 0 ? "pos" : "neg"}
      />
      <Row k="GDP per capita" v={country.gdp_per_capita == null ? "—" : `$${country.gdp_per_capita.toLocaleString()}`} />
      <Row k="Inflation" v={num(country.inflation, "%")} />
      <Row k="Population" v={num(country.population, "M")} />
      <Row k="Govt debt" v={num(country.govt_debt_pct, "% of GDP")} />
      <Row k="Unemployment" v={num(country.unemployment, "%")} />
      <Row k="Current account" v={num(country.current_account_pct, "% of GDP")} />
      <div className="mt-2.5 border-t border-dashed border-rule pt-1.5 text-[9.5px] text-ink-3">
        Source: IMF WEO{country.data_year ? ` · ${country.data_year}` : ""}
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
    <div className="mt-1 flex justify-between gap-4 text-[11px]">
      <span className="text-ink-3">{k}</span>
      <span className={`mono ${toneClass}`}>{v}</span>
    </div>
  );
}
