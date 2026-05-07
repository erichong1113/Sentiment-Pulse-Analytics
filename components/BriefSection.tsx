import { cn } from "@/lib/cn";

interface BriefSectionProps {
  title: string;
  summary?: string;
  children?: React.ReactNode;
  className?: string;
}

export function BriefSection({
  title,
  summary,
  children,
  className,
}: BriefSectionProps) {
  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-panel/60 p-6",
        className,
      )}
    >
      <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-subtle">
        {title}
      </h2>
      {summary ? (
        <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">
          {summary}
        </p>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}
