"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Sparkles, ChevronRight } from "lucide-react";

// Resolve the breadcrumb trail and current page label from the pathname. Kept
// here (not as a generic util) because the crumb copy is page-specific.
function breadcrumb(pathname: string): {
  trail: string[];
  here: string;
} {
  if (pathname === "/" || pathname.startsWith("/dashboard")) {
    return {
      trail: ["Africa", "All Regions"],
      here: "Investment Suitability",
    };
  }
  if (pathname.startsWith("/sentiment-isi")) {
    return {
      trail: ["Workspace", "Markets"],
      here: "Sentiment ISI",
    };
  }
  if (pathname.startsWith("/sentiment-pulse")) {
    return {
      trail: ["Workspace", "Markets"],
      here: "Sentiment Pulse",
    };
  }
  if (pathname.startsWith("/meti")) {
    return {
      trail: ["Workspace", "Models"],
      here: "Market Entry Timing",
    };
  }
  if (pathname.startsWith("/zawadi")) {
    return { trail: ["Workspace", "AI"], here: "Zawadi" };
  }
  if (pathname.startsWith("/markets")) {
    return { trail: ["Workspace"], here: "Markets" };
  }
  if (pathname.startsWith("/settings")) {
    return { trail: ["Account"], here: "Settings" };
  }
  return { trail: ["Workspace"], here: "Overview" };
}

export function TopBar() {
  const pathname = usePathname();
  const { trail, here } = breadcrumb(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center gap-5 border-b border-rule bg-bg-1 px-[22px]">
      {/* Brand mark */}
      <div className="flex h-full items-center gap-2.5 border-r border-rule pr-[22px]">
        <div className="grid h-7 w-7 place-items-center rounded-md bg-brand text-bg-0 text-sm font-extrabold tracking-tight">
          K
        </div>
        <div className="text-[14.5px] font-semibold tracking-tight">
          Kilwa<span className="font-medium text-ink-3">.io</span>
        </div>
        <span className="ml-1 rounded border border-rule px-1.5 py-0.5 mono text-[10px] text-ink-3">
          ISI v2.3
        </span>
      </div>

      {/* Breadcrumb */}
      <nav className="hidden items-center gap-2 text-[12px] text-ink-2 lg:flex">
        {trail.map((t) => (
          <span key={t} className="flex items-center gap-2">
            <span>{t}</span>
            <ChevronRight size={11} className="text-ink-3" />
          </span>
        ))}
        <span className="font-medium text-ink-1">{here}</span>
      </nav>

      {/* Search */}
      <div className="relative hidden max-w-[420px] flex-1 md:block">
        <Search
          size={14}
          strokeWidth={2}
          className="pointer-events-none absolute left-[11px] top-1/2 -translate-y-1/2 text-ink-3"
        />
        <input
          type="text"
          placeholder="Search ISI scores, signals, or insights…"
          className="w-full rounded-md border border-rule bg-bg-0 py-[7px] pl-8 pr-12 text-[12.5px] text-ink-1 outline-none placeholder:text-ink-3 focus:border-[var(--brand-soft)] focus:shadow-[0_0_0_3px_oklch(0.40_0.08_70/0.18)]"
        />
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-rule bg-bg-2 px-1.5 py-0.5 mono text-[10px] text-ink-3">
          ⌘ K
        </span>
      </div>

      {/* Right cluster */}
      <div className="ml-auto flex items-center gap-2.5">
        <div className="hidden text-right text-[10.5px] leading-tight text-ink-3 lg:block">
          <div className="font-medium text-ink-2 mono">14:22:08 UTC</div>
          <div className="mono">refresh in 00:00:52</div>
        </div>

        <div className="hidden items-center gap-1.5 rounded-full border border-[oklch(0.36_0.08_175)] bg-[oklch(0.32_0.06_175)] px-2.5 py-1 text-[11px] font-medium text-pos md:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-pos shadow-[0_0_6px_var(--pos)] blink" />
          Live
        </div>

        <Link
          href="/zawadi"
          className="flex items-center gap-2 rounded-md border border-brand bg-bg-2 px-3 py-1.5 text-[12px] font-medium text-brand hover:bg-[var(--brand-soft)]"
        >
          <Sparkles size={12} strokeWidth={2} />
          Ask Zawadi
        </Link>

        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-rule bg-bg-1 py-1 pl-3 pr-1 text-[12px] text-ink-1 hover:bg-bg-2"
        >
          <span className="hidden md:inline">Adeshvir D.</span>
          <span className="hidden rounded-full border border-[var(--brand-soft)] px-1.5 py-0.5 text-[9.5px] font-semibold tracking-[0.5px] text-brand md:inline">
            PREMIUM
          </span>
          <span className="grid h-[26px] w-[26px] place-items-center rounded-full bg-brand text-[10px] font-bold text-bg-0">
            AD
          </span>
        </button>
      </div>
    </header>
  );
}
