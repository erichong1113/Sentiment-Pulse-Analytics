import {
  Inter,
  JetBrains_Mono,
  Source_Serif_4,
  Plus_Jakarta_Sans,
  DM_Mono,
} from "next/font/google";

// Body sans / numeric mono — used everywhere.
export const fontInter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const fontJet = JetBrains_Mono({
  variable: "--font-jet",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Editorial serif for IC memo / brief titles.
export const fontSerifDisplay = Source_Serif_4({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: ["400", "600"],
});

// Display sans for the gold/terminal pages (METI, Zawadi).
export const fontJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

// Code-mono for the gold/terminal pages.
export const fontDmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const fontClassNames = [
  fontInter.variable,
  fontJet.variable,
  fontSerifDisplay.variable,
  fontJakarta.variable,
  fontDmMono.variable,
].join(" ");
