import { ArrowUpRight } from "lucide-react";
import type { TopDriver } from "@/types";
import { cn } from "@/lib/cn";

interface DriverCardProps {
  driver: TopDriver;
}

function sentimentLabel(score: number) {
  if (score > 0.25) return { text: "Positive", tone: "text-positive" };
  if (score < -0.25) return { text: "Negative", tone: "text-negative" };
  return { text: "Neutral", tone: "text-warning" };
}

export function DriverCard({ driver }: DriverCardProps) {
  const sentiment = sentimentLabel(driver.sentiment_score);
  const weightPct = Math.round(driver.contribution_weight * 100);

  return (
    <a
      href={driver.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg border border-border bg-panel/60 p-5 transition-colors hover:border-border-strong hover:bg-panel"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-subtle">
            <span>{driver.source}</span>
            <span>·</span>
            <span className={cn("font-medium", sentiment.tone)}>
              {sentiment.text}
            </span>
          </div>
          <h3 className="mt-2 text-sm font-medium text-foreground group-hover:text-accent">
            {driver.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {driver.snippet}
          </p>
        </div>
        <ArrowUpRight
          size={15}
          strokeWidth={1.75}
          className="mt-1 shrink-0 text-subtle transition-colors group-hover:text-accent"
        />
      </div>

      <div className="mt-4 flex items-center gap-4 text-[11px] text-subtle">
        <div className="flex flex-1 items-center gap-2">
          <span className="uppercase tracking-wider">Contribution</span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${weightPct}%` }}
            />
          </div>
          <span className="tabular-nums text-muted">{weightPct}%</span>
        </div>
      </div>
    </a>
  );
}
