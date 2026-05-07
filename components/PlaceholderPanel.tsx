import { Construction } from "lucide-react";

interface PlaceholderPanelProps {
  message?: string;
}

export function PlaceholderPanel({
  message = "This view is part of the dashboard skeleton — it will be wired up once the relevant data contract is finalised.",
}: PlaceholderPanelProps) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-panel/40 p-10 text-center">
      <div className="mx-auto grid h-9 w-9 place-items-center rounded-md bg-accent-soft text-accent">
        <Construction size={16} strokeWidth={1.75} />
      </div>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
        {message}
      </p>
    </div>
  );
}
