import { NextRequest, NextResponse } from "next/server";
import { BigQuery } from "@google-cloud/bigquery";

// ISI (Investment Sentiment Index) for one country, from the teammates' two
// tables:
//   sentiment_isi_bucket_signal — time series (the graph)
//   sentiment_isi_signal_state  — latest rolled-up state (the headline number)
// Server-side only; credentials come from GOOGLE_APPLICATION_CREDENTIALS.
//
// NOTE: these tables key country by INTEGER (1=NG, 2=RW, 3=KE), unlike
// news_articles which uses the string code. We map the incoming code here.

export const dynamic = "force-dynamic";

const PROJECT_ID = "vast-flight-470212-c3";
const COUNTRY_ID: Record<string, number> = { NG: 1, RW: 2, KE: 3 };

let client: BigQuery | null = null;
function bq(): BigQuery {
  if (!client) client = new BigQuery({ projectId: PROJECT_ID });
  return client;
}

type Ts = { value: string } | string | null | undefined;
function flattenTs(t: Ts): string | null {
  if (!t) return null;
  return typeof t === "object" ? t.value : t;
}

interface BucketRow {
  bucket_start?: Ts;
  raw_score_100?: number | null;
  ewma_score_100?: number | null;
  article_count?: number | null;
  volume_z?: number | null;
  momentum?: number | null;
}

interface StateRow {
  model_version?: string;
  last_ewma?: number | null;
  updated_at?: Ts;
}

export async function GET(req: NextRequest) {
  const code = (req.nextUrl.searchParams.get("country") ?? "").toUpperCase();
  const cid = COUNTRY_ID[code];
  if (cid === undefined) {
    return NextResponse.json(
      { error: "Unknown or missing country. Use KE, NG, or RW.", series: [] },
      { status: 400 },
    );
  }

  const seriesQuery = `
    SELECT bucket_start, raw_score_100, ewma_score_100, article_count, volume_z, momentum
    FROM (
      SELECT bucket_start, raw_score_100, ewma_score_100, article_count, volume_z, momentum
      FROM \`vast-flight-470212-c3.sentiment_pulse.sentiment_isi_bucket_signal\`
      WHERE country_id = @cid
      ORDER BY bucket_start DESC
      LIMIT 120
    )
    ORDER BY bucket_start ASC
  `;

  const stateQuery = `
    SELECT model_version, last_ewma, updated_at
    FROM \`vast-flight-470212-c3.sentiment_pulse.sentiment_isi_signal_state\`
    WHERE country_id = @cid
    ORDER BY updated_at DESC
    LIMIT 1
  `;

  try {
    const [[seriesRows], [stateRows]] = await Promise.all([
      bq().query({ query: seriesQuery, params: { cid }, types: { cid: "INT64" } }),
      bq().query({ query: stateQuery, params: { cid }, types: { cid: "INT64" } }),
    ]);

    const series = (seriesRows as BucketRow[]).map((r) => ({
      bucket_start: flattenTs(r.bucket_start),
      raw_score_100: r.raw_score_100 ?? null,
      ewma_score_100: r.ewma_score_100 ?? null,
      article_count: r.article_count ?? null,
      volume_z: r.volume_z ?? null,
      momentum: r.momentum ?? null,
    }));

    const s = (stateRows as StateRow[])[0];
    const state = s
      ? {
          model_version: s.model_version ?? null,
          last_ewma: s.last_ewma ?? null,
          updated_at: flattenTs(s.updated_at),
        }
      : null;

    return NextResponse.json({
      country: code,
      latest: series.length ? series[series.length - 1] : null,
      state,
      series,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "BigQuery query failed.";
    return NextResponse.json({ error: message, series: [] }, { status: 502 });
  }
}
