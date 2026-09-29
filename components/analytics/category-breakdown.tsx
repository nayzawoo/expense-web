"use client";

import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { CategoryIcon } from "@/components/category-icon";
import { ChartContainer } from "@/components/chart-container";
import type { CategoryBreakdownItem } from "@/lib/api/analytics";
import { formatMMK, formatMMKShort } from "@/lib/money";

export function CategoryBreakdown({
  items,
  totalExpense,
}: {
  items: CategoryBreakdownItem[];
  totalExpense: number;
}) {
  const donutData = items.map((item) => ({
    name: item.name,
    value: item.amount,
    color: item.color,
  }));

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-foreground">
          Category Breakdown — This Month
        </h2>
        <p className="text-sm text-muted-foreground">
          Where money went this month
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No spending recorded this month.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-center">
          <div className="mx-auto hidden h-52 w-52 lg:block">
            <ChartContainer
              className="h-full"
              initialDimension={{ width: 208, height: 208 }}
            >
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={84}
                  paddingAngle={2}
                  strokeWidth={0}
                  isAnimationActive
                >
                  {donutData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatMMK(Number(value ?? 0))}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    color: "var(--foreground)",
                    fontSize: 12,
                  }}
                />
                <text
                  x="50%"
                  y="46%"
                  textAnchor="middle"
                  fill="var(--muted-foreground)"
                  fontSize={11}
                >
                  This Month
                </text>
                <text
                  x="50%"
                  y="58%"
                  textAnchor="middle"
                  fill="var(--foreground)"
                  fontSize={14}
                  fontWeight={600}
                >
                  {formatMMKShort(totalExpense)}
                </text>
              </PieChart>
            </ChartContainer>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={`${item.id}-${item.name}`}>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${item.color}22` }}
                    >
                      <CategoryIcon
                        name={item.icon}
                        className="h-3.5 w-3.5"
                        style={{ color: item.color }}
                      />
                    </div>
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.name}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {formatMMK(item.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.percentage}%
                    </p>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(item.percentage, 100)}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
