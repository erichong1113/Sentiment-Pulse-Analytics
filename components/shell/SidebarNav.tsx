"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Star,
  BarChart3,
  Radio,
  FileText,
  Briefcase,
  Globe,
  FolderOpen,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";

type Item = {
  href: string;
  label: string;
  icon: typeof LayoutGrid;
  count?: string;
  pill?: string;
  matches?: string[];
};

type Group = {
  label: string;
  items: Item[];
};

const groups: Group[] = [
  {
    label: "Workspace",
    items: [
      {
        href: "/dashboard",
        label: "Market Map",
        icon: LayoutGrid,
        count: "39",
        matches: ["/dashboard"],
      },
      { href: "/markets", label: "Watchlist", icon: Star, count: "7" },
      { href: "/meti", label: "METI", icon: BarChart3, matches: ["/meti"] },
      {
        href: "/sentiment-pulse",
        label: "Sentiment Pulse",
        icon: Radio,
        pill: "14",
        matches: ["/sentiment-pulse"],
      },
      {
        href: "/country-brief/kenya",
        label: "Memos",
        icon: FileText,
        count: "3",
        matches: ["/country-brief"],
      },
      {
        href: "/zawadi",
        label: "Zawadi",
        icon: Sparkles,
        pill: "AI",
        matches: ["/zawadi"],
      },
    ],
  },
  {
    label: "Portfolio",
    items: [
      { href: "/sentiment-isi/kenya", label: "Pipeline", icon: Briefcase, count: "12", matches: ["/sentiment-isi"] },
      { href: "/markets", label: "Holdings", icon: Globe, count: "28" },
    ],
  },
  {
    label: "Reference",
    items: [
      { href: "/markets", label: "Reports", icon: FolderOpen, count: "42" },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

function isActive(pathname: string, item: Item) {
  if (pathname === item.href) return true;
  if (item.matches?.some((m) => pathname.startsWith(m))) return true;
  return false;
}

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[220px] shrink-0 flex-col border-r border-rule bg-bg-1 md:flex">
      <div className="flex-1 overflow-y-auto px-2.5 py-3.5">
        {groups.map((g, gi) => (
          <div
            key={g.label}
            className={cn(
              gi > 0 && "mt-4 border-t border-rule pt-3.5",
            )}
          >
            <div className="px-2 pb-2 text-[9.5px] font-semibold uppercase tracking-[0.8px] text-ink-3">
              {g.label}
            </div>
            <ul>
              {g.items.map((item) => {
                const active = isActive(pathname, item);
                const Icon = item.icon;
                return (
                  <li key={`${g.label}-${item.label}`} className="my-px">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-[11px] rounded-md px-2.5 py-[7px] text-[12.5px] text-ink-2 transition-colors",
                        active
                          ? "bg-bg-2 text-ink-1 font-medium shadow-[inset_2px_0_0_var(--brand)]"
                          : "hover:bg-bg-2 hover:text-ink-1",
                      )}
                    >
                      <Icon
                        size={14}
                        strokeWidth={1.8}
                        className="shrink-0 opacity-70"
                      />
                      <span className="truncate">{item.label}</span>
                      {item.count ? (
                        <span className="ml-auto mono text-[10px] text-ink-3">
                          {item.count}
                        </span>
                      ) : null}
                      {item.pill ? (
                        <span className="ml-auto rounded border border-[var(--brand-soft)] px-[5px] py-px text-[9.5px] text-brand">
                          {item.pill}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-rule px-4 py-3 text-[10px] uppercase tracking-[0.4px] text-ink-3">
        v0.2 · Internal preview
      </div>
    </aside>
  );
}
