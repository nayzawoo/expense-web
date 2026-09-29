"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { CategoryIcon } from "@/components/category-icon";
import type { CategoryChange } from "@/lib/api/analytics";
import { formatPercent, formatSignedMMK } from "@/lib/money";

function ChangeRow({
  change,
  tone,
}: {
  change: CategoryChange;
  tone: "up" | "down";
}) {
  const Icon = tone === "up" ? ArrowUpRight : ArrowDownRight;
  const toneClass =
    tone === "up"
      ? "text-rose-600 dark:text-rose-400"
      : "text-emerald-600 dark:text-emerald-400";
  const percent = formatPercent(change.difference_percent);

  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${change.color}22` }}
        >
          <CategoryIcon
            name={change.icon}
            className="h-4 w-4"
            style={{ color: change.color }}
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {change.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {change.is_new ? "New this month" : percent ? percent : "Changed"}
          </p>
        </div>
      </div>
      <div className={`flex items-center gap-1 text-sm font-semibold ${toneClass}`}>
        <Icon className="h-3.5 w-3.5" />
        {formatSignedMMK(change.difference_amount)}
      </div>
    </div>
  );
}

export function CategoryChangeList({
  increased,
  decreased,
}: {
  increased: CategoryChange[];
  decreased: CategoryChange[];
}) {
  const empty = increased.length === 0 && decreased.length === 0;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">
          What Changed This Month
        </h2>
        <p className="text-sm text-muted-foreground">
          Compared with the same days last month
        </p>
      </div>

      {empty ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">
            No meaningful category changes yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-rose-700 dark:text-rose-300">
              Spending Increased
            </h3>
            <div className="mt-2 divide-y divide-border">
              {increased.length === 0 ? (
                <p className="py-4 text-sm text-muted-foreground">
                  No increases this period.
                </p>
              ) : (
                increased.map((change) => (
                  <ChangeRow key={change.id} change={change} tone="up" />
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              Spending Decreased
            </h3>
            <div className="mt-2 divide-y divide-border">
              {decreased.length === 0 ? (
                <p className="py-4 text-sm text-muted-foreground">
                  No decreases this period.
                </p>
              ) : (
                decreased.map((change) => (
                  <ChangeRow key={change.id} change={change} tone="down" />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
