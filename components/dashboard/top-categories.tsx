import { formatMMK } from "@/lib/money";
import type { DashboardPayload } from "@/lib/api/dashboard";

type Category = DashboardPayload["topCategories"][number];

export function TopCategories({ categories }: { categories: Category[] }) {
  return (
    <section className="dashboard-panel">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Top Spending This Month
        </h2>
        <p className="text-sm text-muted-foreground">
          Leading categories right now
        </p>
      </div>

      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No spending recorded this month.
        </p>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={`${category.id}-${category.name}`}>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold"
                    style={{
                      backgroundColor: `${category.color || "#9ca3af"}22`,
                      color: category.color || "#9ca3af",
                    }}
                  >
                    {(category.name || "?").slice(0, 1)}
                  </div>
                  <p className="truncate text-sm font-medium text-foreground">
                    {category.name}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-foreground tabular-nums">
                    {formatMMK(category.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {category.percentage}%
                  </p>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(category.percentage, 100)}%`,
                    backgroundColor: category.color || "#9ca3af",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
