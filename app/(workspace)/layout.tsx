import { SidebarNav } from "@/components/shell/SidebarNav";
import { TopBar } from "@/components/shell/TopBar";

// The workspace shell wraps every "terminal" page: sidebar + top bar, then a
// flex container that lets each page bring its own filter/secondary column
// alongside the main canvas.
export default function WorkspaceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen overflow-hidden bg-bg-0 text-ink-1">
      <SidebarNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <div className="flex min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
