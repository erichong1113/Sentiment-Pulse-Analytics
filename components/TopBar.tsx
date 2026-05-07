"use client";

import { usePathname } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import { useMemo } from "react";

function titleFromPath(pathname: string): string {
  if (pathname === "/" || pathname === "/dashboard") return "Dashboard";
  if (pathname.startsWith("/sentiment-isi")) return "Sentiment ISI";
  if (pathname.startsWith("/country-brief")) return "Country Brief";
  if (pathname.startsWith("/top-drivers")) return "Top Drivers";
  if (pathname.startsWith("/markets")) return "Markets";
  if (pathname.startsWith("/meti")) return "METI";
  if (pathname.startsWith("/settings")) return "Settings";
  return "Kilwa";
}

export function TopBar() {
  const pathname = usePathname();
  const title = useMemo(() => titleFromPath(pathname), [pathname]);

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="text-sm text-subtle">Kilwa</span>
        <span className="text-subtle">/</span>
        <h1 className="text-sm font-medium text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-md border border-border bg-elevated/60 px-3 py-1.5 text-xs text-muted md:flex">
          <Search size={13} strokeWidth={1.75} />
          <span>Search markets, briefs, drivers…</span>
          <kbd className="ml-3 rounded border border-border bg-background/60 px-1.5 py-0.5 font-mono text-[10px] text-subtle">
            ⌘K
          </kbd>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-md border border-border bg-elevated/60 px-2 py-1.5 text-xs text-foreground hover:bg-elevated"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full bg-accent/20 text-[11px] font-medium text-accent">
            AD
          </span>
          <span className="hidden md:inline">Adeshvir</span>
          <ChevronDown size={13} strokeWidth={1.75} className="text-subtle" />
        </button>
      </div>
    </header>
  );
}
