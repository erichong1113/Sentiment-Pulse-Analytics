import type { Metadata } from "next";
import "./globals.css";
import { fontClassNames } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Kilwa — African Markets Intelligence",
  description:
    "Investment Suitability Index, Market Entry Timing, sentiment, and AI-grounded briefs for African markets.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontClassNames}>
      {/* Default theme is `theme-ochre` (warm-ink dark) — individual route
          groups override this on their own wrapper. */}
      <body className="theme-ochre antialiased">{children}</body>
    </html>
  );
}
