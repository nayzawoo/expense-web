"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AnalyticsTooltip } from "@/components/analytics/analytics-tooltip";
import { ChartContainer } from "@/components/chart-container";
import type { MonthlyTrendPoint } from "@/lib/api/analytics";
import { formatMMKShort } from "@/lib/money";

export function MonthlyTrendChart({
  data,
  monthlyAverage,
}: {
  data: MonthlyTrendPoint[];
  monthlyAverage: number;
}) {
  const hasSpending = data.some((point) => point.total > 0);

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Last 6 Months
          </h2>
          <p className="text-sm text-muted-foreground">
            Household expense trend
          </p>
        </div>
        {monthlyAverage > 0 ? (
          <p className="text-xs text-muted-foreground">
            Avg {formatMMKShort(monthlyAverage)}
          </p>
        ) : null}
      </div>

      {!hasSpending ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
          <p className="text-sm text-muted-foreground">
            No spending recorded in the last 6 months.
          </p>
        </div>
      ) : (
        <div className="h-72 w-full">
          <ChartContainer
            className="h-full"
            initialDimension={{ width: 640, height: 288 }}
          >
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="var(--border)"
              />
              <XAxis
                dataKey="short_label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={48}
                tickFormatter={formatMMKShort}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)", opacity: 0.45 }}
                content={<AnalyticsTooltip />}
              />
              {monthlyAverage > 0 ? (
                <ReferenceLine
                  y={monthlyAverage}
                  stroke="var(--muted-foreground)"
                  strokeDasharray="4 4"
                  strokeOpacity={0.7}
                />
              ) : null}
              <Bar
                dataKey="total"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
                isAnimationActive
                animationDuration={500}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.month_key}
                    fill="var(--primary)"
                    fillOpacity={entry.is_current ? 0.65 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      )}
    </section>
  );
}
