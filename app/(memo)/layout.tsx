// Memo group runs the light "paper" theme by swapping the body theme class
// for this route group. The dashboard chrome is intentionally omitted — IC
// briefs read like printed documents, not terminal panels.
export default function MemoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="theme-paper min-h-screen bg-bg-1 px-7 pb-8 text-ink-1">
      {children}
    </div>
  );
}
