import { cn } from "@/lib/cn";

interface KpiTileProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  sub?: React.ReactNode;
  foot?: React.ReactNode;
  tone?: "pos" | "neg" | "brand" | "neutral";
}

export function KpiTile({
  label,
  value,
  unit,
  sub,
  foot,
  tone = "neutral",
}: KpiTileProps) {
  return (
    <div className="relative border-r border-rule px-[22px] py-4 last:border-r-0">
      <span
        className={cn(
          "absolute inset-x-0 top-0 h-0.5",
          tone === "pos" &&
            "bg-[linear-gradient(90deg,var(--pos),transparent)]",
          tone === "neg" &&
            "bg-[linear-gradient(90deg,var(--neg),transparent)]",
          tone === "brand" &&
            "bg-[linear-gradient(90deg,var(--brand),transparent)]",
          tone === "neutral" &&
            "bg-[linear-gradient(90deg,var(--rule-2),transparent)]",
        )}
      />
      <div className="flex justify-between text-[10px] uppercase tracking-[0.4px] text-ink-3">
        <span>{label}</span>
        <span className="cursor-help">ⓘ</span>
      </div>
      <div
        className={cn(
          "mono mt-1 text-[26px] font-medium leading-tight tracking-[-0.6px]",
          tone === "pos" && "text-pos",
          tone === "neg" && "text-neg",
        )}
      >
        {value}
        {unit ? (
          <span className="ml-1 text-[13px] font-normal text-ink-2">
            {unit}
          </span>
        ) : null}
      </div>
      {sub ? <div className="mt-1 text-[11px] text-ink-2">{sub}</div> : null}
      {foot ? (
        <div className="mt-2 border-t border-dashed border-rule pt-1.5 text-[10px] text-ink-3">
          {foot}
        </div>
      ) : null}
    </div>
  );
}
