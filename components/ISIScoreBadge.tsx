import { cn } from "@/lib/cn";
import { isiTierToken } from "@/lib/isi";

interface ISIScoreBadgeProps {
  score: number;
  label?: string;
  className?: string;
}

export function ISIScoreBadge({ score, label, className }: ISIScoreBadgeProps) {
  const t = isiTierToken(score);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
        t.bg,
        t.text,
        t.border,
        className,
      )}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: t.swatch }}
      />
      {label ? <span className="opacity-80">{label}</span> : null}
      <span className="tabular-nums">{Math.round(score)}</span>
    </span>
  );
}
