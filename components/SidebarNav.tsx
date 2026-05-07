"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe2,
  Activity,
  Gauge,
  Waves,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/cn";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/markets", label: "Markets", icon: Globe2 },
  { href: "/sentiment-isi/kenya", label: "ISI", icon: Activity, matches: ["/sentiment-isi"] },
  { href: "/meti", label: "METI", icon: Gauge },
  { href: "/top-drivers", label: "Sentiment Pulse", icon: Waves, matches: ["/top-drivers"] },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-elevated/40 md:flex">
      <div className="flex h-14 items-center gap-2 border-b border-border px-5">
        <div className="grid h-7 w-7 place-items-center rounded-md bg-accent/15 text-accent">
          <span className="text-sm font-semibold">K</span>
        </div>
        <span className="text-sm font-medium tracking-tight text-foreground">
          Kilwa
        </span>
      </div>

      <nav className="flex-1 px-3 py-5">
        <ul className="space-y-1">
          {navItems.map(({ href, label, icon: Icon, matches }) => {
            const isActive =
              pathname === href ||
              (matches?.some((m) => pathname.startsWith(m)) ?? false);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-accent-soft text-foreground"
                      : "text-muted hover:bg-elevated hover:text-foreground",
                  )}
                >
                  <Icon
                    size={16}
                    strokeWidth={1.75}
                    className={cn(isActive ? "text-accent" : "text-subtle")}
                  />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border px-5 py-4 text-[11px] uppercase tracking-wider text-subtle">
        v0.1 · Internal preview
      </div>
    </aside>
  );
}
