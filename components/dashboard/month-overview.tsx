import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { formatMMK, formatPercent, formatSignedMMK } from "@/lib/money";
import type { DashboardPayload } from "@/lib/api/dashboard";

type Overview = DashboardPayload["monthOverview"];

export function MonthOverviewCards({ overview }: { overview: Overview }) {
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
    <section className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm text-muted-foreground">Spent This Month</p>
        <p className="mt-2 text-2xl font-bold text-foreground tabular-nums">
          {formatMMK(overview.expense)}
        </p>
        <div className={`mt-3 flex items-start gap-1.5 ${comparisonTone}`}>
          <ComparisonIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="text-sm font-semibold tabular-nums">
              {overview.previous_same_period_expense === 0 && overview.expense > 0
                ? formatSignedMMK(overview.difference_amount)
                : `${formatSignedMMK(overview.difference_amount)}${percentLabel ? ` (${percentLabel})` : ""}`}
            </p>
            <p className="text-xs text-muted-foreground">
              {overview.previous_same_period_expense === 0 && overview.expense > 0
                ? "New spending this month"
                : overview.comparison_label}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm text-muted-foreground">Income This Month</p>
        <p className="mt-2 text-2xl font-bold text-emerald-700 tabular-nums dark:text-emerald-400">
          {formatMMK(overview.income)}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm text-muted-foreground">Net This Month</p>
        <p
          className={`mt-2 text-2xl font-bold tabular-nums ${
            overview.net >= 0
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-rose-700 dark:text-rose-400"
          }`}
        >
          {formatSignedMMK(overview.net)}
        </p>
      </div>
    </section>
  );
}
