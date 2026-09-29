import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatSignedMMK } from "@/lib/money";
import type { DashboardPayload } from "@/lib/api/dashboard";

type Change = DashboardPayload["categoryChanges"]["increased"][number];

function ChangeRow({
  change,
  tone,
}: {
  change: Change;
  tone: "up" | "down";
}) {
  const Icon = tone === "up" ? ArrowUpRight : ArrowDownRight;
  const toneClass =
    tone === "up"
      ? "text-rose-600 dark:text-rose-400"
      : "text-emerald-600 dark:text-emerald-400";

  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex min-w-0 items-center gap-2.5">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold"
          style={{
            backgroundColor: `${change.color || "#9ca3af"}22`,
            color: change.color || "#9ca3af",
          }}
        >
          {(change.name || "?").slice(0, 1)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {change.name}
          </p>
          {change.is_new ? (
            <p className="text-xs text-muted-foreground">New this month</p>
          ) : null}
        </div>
      </div>
      <div
        className={`flex items-center gap-1 text-sm font-semibold tabular-nums ${toneClass}`}
      >
        <Icon className="h-3.5 w-3.5" />
        {formatSignedMMK(change.difference_amount)}
      </div>
    </div>
  );
}

export function CategoryChangeSummary({
  increased,
  decreased,
}: {
  increased: Change[];
  decreased: Change[];
}) {
  const empty = increased.length === 0 && decreased.length === 0;

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">What Changed</h2>
        <p className="text-sm text-muted-foreground">
          vs same period last month
        </p>
      </div>

      {empty ? (
        <p className="text-sm text-muted-foreground">
          No category changes to highlight.
        </p>
      ) : (
        <div className="space-y-4">
          {increased.length > 0 ? (
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-rose-600 dark:text-rose-400">
                Increased
              </p>
              {increased.map((change) => (
                <ChangeRow key={`up-${change.id}`} change={change} tone="up" />
              ))}
            </div>
          ) : null}
          {decreased.length > 0 ? (
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                Decreased
              </p>
              {decreased.map((change) => (
                <ChangeRow
                  key={`down-${change.id}`}
                  change={change}
                  tone="down"
                />
              ))}
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
