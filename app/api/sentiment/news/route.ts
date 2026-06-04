import { NextRequest, NextResponse } from "next/server";
import { BigQuery } from "@google-cloud/bigquery";

// Reads the BigQuery `news_articles` table (filled by the teammates' scraper
// job) and returns positive + negative articles for one country. Runs entirely
// server-side: credentials come from GOOGLE_APPLICATION_CREDENTIALS (a
// read-only service-account key) and never reach the browser. The country is a
// bound query parameter — never string-concatenated into SQL.

export const dynamic = "force-dynamic";

const PROJECT_ID = "vast-flight-470212-c3";
const ALLOWED_COUNTRIES = new Set(["KE", "NG", "RW"]);

let client: BigQuery | null = null;
function bq(): BigQuery {
  if (!client) client = new BigQuery({ projectId: PROJECT_ID });
  return client;
}

interface Row {
  id: string;
  title?: string;
  summary?: string;
  content?: string;
  source?: string;
  url?: string;
  published_at?: { value: string } | string | null;
  sentiment_score?: number;
  sentiment_label?: string;
  sentiment_confidence?: number;
  relevance_score?: number;
  topics?: string[];
}

export async function GET(req: NextRequest) {
  const country = (req.nextUrl.searchParams.get("country") ?? "").toUpperCase();
  if (!ALLOWED_COUNTRIES.has(country)) {
    return NextResponse.json(
      { error: "Unknown or missing country. Use KE, NG, or RW.", articles: [] },
      { status: 400 },
    );
  }

  // English articles only, top 6 per sentiment, ranked by most-recent then
  // confidence. ROW_NUMBER partitioned by label gives a balanced 6 + 6 even
  // when recent news skews one way.
  const query = `
    SELECT id, title, summary, content, source, url, published_at,
           sentiment_score, sentiment_label, sentiment_confidence,
           relevance_score, topics
    FROM (
      SELECT *,
             ROW_NUMBER() OVER (
               PARTITION BY sentiment_label
               ORDER BY published_at DESC, sentiment_confidence DESC
             ) AS rn
      FROM \`vast-flight-470212-c3.sentiment_pulse.news_articles\`
      WHERE country_id = @country
        AND language = 'en'
        AND sentiment_label IN ('positive', 'negative')
    )
    WHERE rn <= 6
    ORDER BY sentiment_label, published_at DESC, sentiment_confidence DESC
  `;

  try {
    const [rows] = await bq().query({
      query,
      params: { country },
      types: { country: "STRING" },
    });

    const articles = (rows as Row[]).map((r) => ({
      ...r,
      // BigQuery TIMESTAMP rows come back as { value: "ISO string" } — flatten.
      published_at:
        r.published_at && typeof r.published_at === "object"
          ? r.published_at.value
          : (r.published_at ?? null),
    }));

    return NextResponse.json({ country, articles });
  } catch (err) {
    const message = err instanceof Error ? err.message : "BigQuery query failed.";
    return NextResponse.json({ error: message, articles: [] }, { status: 502 });
  }
}
