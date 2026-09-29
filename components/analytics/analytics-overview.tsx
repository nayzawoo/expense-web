"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { formatMMK, formatPercent, formatSignedMMK } from "@/lib/money";
import type { AnalyticsOverview } from "@/lib/api/analytics";

export function AnalyticsOverviewCards({
  overview,
  monthLabel,
}: {
  overview: AnalyticsOverview;
  monthLabel: string;
}) {
  const ComparisonIcon =
    overview.direction === "up"
      ? ArrowUpRight
      : overview.direction === "down"
        ? ArrowDownRight
        : Minus;

  const comparisonTone =
    overview.direction === "up"
      ? "text-rose-600 dark:text-rose-400"
      : overview.direction === "down"
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-muted-foreground";

  const percentLabel = formatPercent(overview.difference_percent);

  return (
    <section className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:col-span-2 xl:col-span-2">
          <p className="text-sm text-muted-foreground">This Month</p>
          <p className="mt-1 text-xs text-muted-foreground">{monthLabel}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">
            {formatMMK(overview.current_month_expense)}
          </p>
          <div className={`mt-3 flex items-start gap-2 ${comparisonTone}`}>
            <ComparisonIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="text-sm font-semibold">
                {formatSignedMMK(overview.difference_amount)}
                {percentLabel ? ` (${percentLabel})` : ""}
              </p>
              <p className="text-xs text-muted-foreground">
                {overview.comparison_label}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Monthly Average</p>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {formatMMK(overview.monthly_average)}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {overview.average_label}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Daily Average</p>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {formatMMK(overview.daily_average)}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Month to date</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border/80 bg-muted/30 px-4 py-3">
          <p className="text-xs text-muted-foreground">Income this month</p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {formatMMK(overview.current_month_income)}
          </p>
        </div>
        <div className="rounded-xl border border-border/80 bg-muted/30 px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Net cash flow this month
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {formatSignedMMK(overview.current_month_net)}
          </p>
        </div>
      </div>
    </section>
  );
}
