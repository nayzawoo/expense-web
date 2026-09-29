"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { BalanceSummary } from "@/components/dashboard/balance-summary";
import { CategoryChangeSummary } from "@/components/dashboard/category-change-summary";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { MonthOverviewCards } from "@/components/dashboard/month-overview";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { SpendingForSummary } from "@/components/dashboard/spending-for-summary";
import { TopCategories } from "@/components/dashboard/top-categories";
import { useClientToken } from "@/hooks/use-client-token";
import { useDashboard } from "@/hooks/use-dashboard";

export default function DashboardPage() {
  const { ready } = useClientToken();
  const dashboard = useDashboard();

  if (
    !ready ||
    dashboard.isLoading ||
    dashboard.isPending
  ) {
    return (
      <div className="flex h-full flex-1 flex-col gap-6 p-4 md:gap-8 md:p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    );
  }

  if (dashboard.isError || !dashboard.data) {
    return (
      <div className="p-4 md:p-6">
        <Alert variant="destructive">
          <AlertTitle>Could not load dashboard</AlertTitle>
          <AlertDescription>
            {dashboard.error?.message ?? "Unknown error"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const data = dashboard.data;
  const categoryChanges = data.categoryChanges ?? {
    increased: [],
    decreased: [],
  };

  return (
    <div className="flex h-full flex-1 flex-col gap-6 p-4 md:gap-8 md:p-6">
      <DashboardHeader monthLabel={data.month_label} />

      <BalanceSummary
        total={data.balance.total}
        accounts={data.balance.accounts}
        hasMore={data.balance.has_more}
      />

      <MonthOverviewCards overview={data.monthOverview} />

      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryChangeSummary
          increased={categoryChanges.increased ?? []}
          decreased={categoryChanges.decreased ?? []}
        />
        <TopCategories categories={data.topCategories ?? []} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <RecentActivity items={data.recentActivity ?? []} />
        <SpendingForSummary items={data.spendingByPerson ?? []} />
      </div>
    </div>
  );
}
