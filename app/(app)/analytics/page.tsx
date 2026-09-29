"use client";

import { useQuery } from "@tanstack/react-query";
import { AnalyticsOverviewCards } from "@/components/analytics/analytics-overview";
import { CategoryBreakdown } from "@/components/analytics/category-breakdown";
import { CategoryChangeList } from "@/components/analytics/category-change-list";
import { MonthlyTrendChart } from "@/components/analytics/monthly-trend-chart";
import { SpendingInsight } from "@/components/analytics/spending-insight";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAnalytics } from "@/lib/api/analytics";
import { getErrorMessage } from "@/lib/api/client";
import { queryKeys } from "@/lib/query-keys";

export default function AnalyticsPage() {
  const analytics = useQuery({
    queryKey: queryKeys.analytics.all,
    queryFn: fetchAnalytics,
  });

  if (analytics.isLoading) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (analytics.isError || !analytics.data) {
    return (
      <div className="p-4 md:p-6">
        <p className="text-sm text-destructive">
          {getErrorMessage(analytics.error)}
        </p>
      </div>
    );
  }

  const data = analytics.data;

  return (
    <div className="flex h-full flex-1 flex-col gap-8 p-4 md:p-6">
      <header>
        <h1 className="text-xl font-bold text-foreground">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Understand where your household money is going
        </p>
        <p className="mt-2 text-sm font-medium text-foreground">
          {data.month_label}
        </p>
      </header>

      <AnalyticsOverviewCards
        overview={data.overview}
        monthLabel={data.month_label}
      />

      <MonthlyTrendChart
        data={data.monthlyTrend}
        monthlyAverage={data.overview.monthly_average}
      />

      <CategoryChangeList
        increased={data.categoryChanges.increased}
        decreased={data.categoryChanges.decreased}
      />

      <SpendingInsight message={data.insight.message} />

      <CategoryBreakdown
        items={data.categoryBreakdown}
        totalExpense={data.overview.current_month_expense}
      />
    </div>
  );
}
