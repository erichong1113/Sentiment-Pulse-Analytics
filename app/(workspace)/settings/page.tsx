import { Construction } from "lucide-react";

export default function SettingsPage() {
  return (
    <main className="min-w-0 flex-1 overflow-y-auto bg-bg-0 p-6">
      <h1 className="text-[22px] font-semibold tracking-tight">Settings</h1>
      <p className="mb-6 text-[12px] text-ink-2">
        Workspace preferences, model version pinning, and notification controls.
      </p>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {[
          { k: "Account", v: "Adeshvir D. · PREMIUM · admin" },
          { k: "Mandate", v: "SSA Infra Fund III · BB− min · 5y horizon" },
          { k: "Default currency", v: "USD" },
          { k: "Default horizon", v: "1W" },
          { k: "Models", v: "ISI v2.3 (pinned) · METI v3.2.1 (pinned)" },
          { k: "Alert delivery", v: "Email + Slack #kilwa-alerts" },
        ].map((row) => (
          <div
            key={row.k}
            className="flex items-center justify-between rounded-lg border border-rule bg-bg-1 px-4 py-3"
          >
            <div>
              <div className="text-[10px] uppercase tracking-[0.4px] text-ink-3">{row.k}</div>
              <div className="mt-0.5 text-[13px]">{row.v}</div>
            </div>
            <button className="rounded-md border border-rule bg-bg-2 px-2.5 py-1 text-[11px] text-ink-2 hover:text-ink-1">
              Edit
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-dashed border-rule bg-bg-1 p-8 text-center">
        <div className="mx-auto grid h-9 w-9 place-items-center rounded-md bg-[var(--brand-soft)] text-brand">
          <Construction size={16} strokeWidth={1.8} />
        </div>
        <p className="mx-auto mt-4 max-w-md text-[12px] leading-snug text-ink-3">
          Detailed settings (model overrides, retention policy, audit export, SSO, role assignments) will land once the platform
          surfaces stabilise.
        </p>
      </div>
    </main>
  );
}
