"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "@/components/chart-container";
import { formatMMK, formatMMKShort } from "@/lib/money";
import type { DashboardPayload } from "@/lib/api/dashboard";

type SpendingPacePoint = DashboardPayload["spendingPace"][number];

type PaceTooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: ReadonlyArray<{
    dataKey?: string | number;
    value?: number | string;
    color?: string;
  }>;
};

function PaceTooltip({ active, payload, label }: PaceTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const current = payload.find((item) => item.dataKey === "current");
  const previous = payload.find((item) => item.dataKey === "previous");

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-sm font-medium text-foreground">Day {label}</p>
      <p className="mt-1.5 text-sm text-foreground">
        Current{" "}
        <span className="font-semibold tabular-nums">
          {formatMMK(Number(current?.value ?? 0))}
        </span>
      </p>
      <p className="text-sm text-muted-foreground">
        Previous Month{" "}
        <span className="font-medium tabular-nums">
          {formatMMK(Number(previous?.value ?? 0))}
        </span>
      </p>
    </div>
  );
}

export function SpendingPaceChart({ data }: { data: SpendingPacePoint[] }) {
  const hasData = data.some((point) => point.current > 0 || point.previous > 0);

  return (
    <section className="dashboard-panel">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Spending This Month
          </h2>
          <p className="text-sm text-muted-foreground">
            Cumulative pace vs same period last month
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded bg-primary" />
            Current
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-px w-4 border-t border-dashed border-muted-foreground" />
            Previous
          </span>
        </div>
      </div>

      {!hasData ? (
        <div className="flex h-52 items-center justify-center rounded-lg border border-dashed border-border">
          <p className="text-sm text-muted-foreground">
            No spending recorded this month.
          </p>
        </div>
      ) : (
        <div className="h-56 w-full">
          <ChartContainer
            className="h-full"
            initialDimension={{ width: 640, height: 224 }}
          >
            <LineChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="var(--border)"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: "var(--muted-foreground)",
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={48}
                tickFormatter={formatMMKShort}
                tick={{
                  fontSize: 12,
                  fill: "var(--muted-foreground)",
                }}
              />
              <Tooltip content={<PaceTooltip />} />
              <Line
                type="monotone"
                dataKey="previous"
                stroke="var(--muted-foreground)"
                strokeWidth={2}
                strokeDasharray="5 5"
                strokeOpacity={0.75}
                dot={false}
                isAnimationActive
                animationDuration={500}
              />
              <Line
                type="monotone"
                dataKey="current"
                stroke="var(--primary)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive
                animationDuration={500}
              />
            </LineChart>
          </ChartContainer>
        </div>
      )}
    </section>
  );
}
