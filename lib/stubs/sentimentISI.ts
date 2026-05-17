import type { SentimentISIPoint } from "@/types";

// 14-day series for Kenya. Hand-tuned to look believable rather than random.
export const sentimentISIKenya: SentimentISIPoint[] = [
  { date: "2026-04-23", sentiment_isi: 64, macro_isi: 60, volume: 142, momentum: 1.2 },
  { date: "2026-04-24", sentiment_isi: 66, macro_isi: 61, volume: 158, momentum: 2.0 },
  { date: "2026-04-25", sentiment_isi: 63, macro_isi: 60, volume: 121, momentum: -0.8 },
  { date: "2026-04-26", sentiment_isi: 61, macro_isi: 59, volume: 98, momentum: -1.4 },
  { date: "2026-04-27", sentiment_isi: 65, macro_isi: 60, volume: 134, momentum: 1.6 },
  { date: "2026-04-28", sentiment_isi: 70, macro_isi: 62, volume: 188, momentum: 4.1 },
  { date: "2026-04-29", sentiment_isi: 73, macro_isi: 63, volume: 204, momentum: 5.3 },
  { date: "2026-04-30", sentiment_isi: 72, macro_isi: 64, volume: 199, momentum: 3.8 },
  { date: "2026-05-01", sentiment_isi: 68, macro_isi: 64, volume: 167, momentum: 1.1 },
  { date: "2026-05-02", sentiment_isi: 66, macro_isi: 65, volume: 153, momentum: -0.4 },
  { date: "2026-05-03", sentiment_isi: 69, macro_isi: 66, volume: 178, momentum: 2.2 },
  { date: "2026-05-04", sentiment_isi: 72, macro_isi: 67, volume: 196, momentum: 3.6 },
  { date: "2026-05-05", sentiment_isi: 74, macro_isi: 68, volume: 221, momentum: 4.7 },
  { date: "2026-05-06", sentiment_isi: 71, macro_isi: 68, volume: 207, momentum: 2.9 },
];

// Convenience accessor for arbitrary country slugs while the API isn't wired.
// Returns Kenya's series for any code other than `ke` so charts always render.
export function getSentimentISI(_countryCode: string): SentimentISIPoint[] {
  return sentimentISIKenya;
}
