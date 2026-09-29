"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useMe } from "@/hooks/use-auth";
import { useDashboard } from "@/hooks/use-dashboard";

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DashboardPage() {
  const me = useMe();
  const dashboard = useDashboard();

  if (me.isLoading || dashboard.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading dashboard…</p>;
  }

  if (me.isError || dashboard.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Could not load dashboard</AlertTitle>
        <AlertDescription>
          {(me.error ?? dashboard.error)?.message ?? "Unknown error"}
        </AlertDescription>
      </Alert>
    );
  }

  const overview = dashboard.data?.monthOverview;
  const balance = dashboard.data?.balance;
  const topCategories = dashboard.data?.topCategories ?? [];
  const recent = dashboard.data?.recentActivity ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome{me.data?.user?.name ? `, ${me.data.user.name}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {dashboard.data?.month_label ?? "This month"} overview from the Expense API.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Balance</CardDescription>
            <CardTitle className="text-2xl">
              {formatMoney(balance?.total ?? 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Month expense</CardDescription>
            <CardTitle className="text-2xl">
              {formatMoney(overview?.expense ?? 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Month income</CardDescription>
            <CardTitle className="text-2xl">
              {formatMoney(overview?.income ?? 0)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top categories</CardTitle>
            <CardDescription>Where spending concentrated this month</CardDescription>
          </CardHeader>
          <CardContent>
            {topCategories.length === 0 ? (
              <p className="text-sm text-muted-foreground">No category data yet.</p>
            ) : (
              <ul className="space-y-3">
                {topCategories.map((category) => (
                  <li
                    key={`${category.name}-${category.id ?? category.amount}`}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{category.name}</span>
                    <span className="font-medium">{formatMoney(category.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Latest movements across accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            ) : (
              <ul className="space-y-3">
                {recent.slice(0, 6).map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {item.title ?? item.note ?? item.type}
                      </p>
                      <p className="text-muted-foreground">{item.date}</p>
                    </div>
                    <span className="shrink-0 font-medium">
                      {formatMoney(item.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
