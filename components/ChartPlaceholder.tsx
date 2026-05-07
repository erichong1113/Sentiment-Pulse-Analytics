"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface ChartSeriesConfig {
  dataKey: string;
  label: string;
  color: string;
}

interface ChartPlaceholderProps<T> {
  data: ReadonlyArray<T>;
  series: ChartSeriesConfig[];
  xKey: keyof T & string;
  yDomain?: [number, number];
  height?: number;
}

export function ChartPlaceholder<T extends object>({
  data,
  series,
  xKey,
  yDomain = [0, 100],
  height = 280,
}: ChartPlaceholderProps<T>) {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 8, right: 16, left: -8, bottom: 0 }}
        >
          <CartesianGrid
            stroke="var(--border)"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey={xKey as string}
            stroke="var(--fg-subtle)"
            tick={{ fontSize: 11, fill: "var(--fg-muted)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            minTickGap={24}
          />
          <YAxis
            domain={yDomain}
            stroke="var(--fg-subtle)"
            tick={{ fontSize: 11, fill: "var(--fg-muted)" }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            cursor={{ stroke: "var(--border-strong)", strokeWidth: 1 }}
            contentStyle={{
              background: "var(--panel)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
              color: "var(--fg)",
              padding: "8px 10px",
            }}
            labelStyle={{ color: "var(--fg-muted)", marginBottom: 4 }}
          />
          {series.map((s) => (
            <Line
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.label}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted">
        {series.map((s) => (
          <span key={s.dataKey} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: s.color }}
            />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
