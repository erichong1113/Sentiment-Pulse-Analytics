// Helpers for translating an ISI score (0-100) into the visual grammar used
// across the dashboard. Centralised here so the heatmap, badge, and chart
// callouts stay in sync if thresholds change.

export type ISITier = "strong" | "neutral" | "weak";

export function isiTier(score: number): ISITier {
  if (score >= 65) return "strong";
  if (score >= 50) return "neutral";
  return "weak";
}

export function isiTierToken(score: number): {
  bg: string;
  text: string;
  border: string;
  swatch: string;
} {
  const tier = isiTier(score);
  if (tier === "strong") {
    return {
      bg: "bg-positive-soft/70",
      text: "text-positive",
      border: "border-positive/30",
      swatch: "var(--positive)",
    };
  }
  if (tier === "neutral") {
    return {
      bg: "bg-warning-soft/70",
      text: "text-warning",
      border: "border-warning/30",
      swatch: "var(--warning)",
    };
  }
  return {
    bg: "bg-negative-soft/70",
    text: "text-negative",
    border: "border-negative/30",
    swatch: "var(--negative)",
  };
}
