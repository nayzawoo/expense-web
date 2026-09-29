import { formatMMK, formatSignedMMK } from "@/lib/money";
import type { DashboardPayload } from "@/lib/api/dashboard";

type Item = DashboardPayload["recentActivity"][number];

function groupByDateLabel(items: Item[]) {
  const today = new Date().toISOString().slice(0, 10);
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().slice(0, 10);

  const groups: Array<{ label: string; items: Item[] }> = [];

  for (const item of items) {
    const label =
      item.date === today
        ? "Today"
        : item.date === yesterday
          ? "Yesterday"
          : new Date(`${item.date}T00:00:00`).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });

    const existing = groups.find((group) => group.label === label);
    if (existing) {
      existing.items.push(item);
    } else {
      groups.push({ label, items: [item] });
    }
  }

  return groups;
}

function amountDisplay(item: Item): string {
  if (item.type === "expense") {
    return formatSignedMMK(-Math.abs(item.amount));
  }
  if (item.type === "income") {
    return formatSignedMMK(Math.abs(item.amount));
  }
  return formatMMK(item.amount);
}

function amountClass(item: Item): string {
  if (item.type === "expense") {
    return "text-rose-600 dark:text-rose-400";
  }
  if (item.type === "income") {
    return "text-emerald-600 dark:text-emerald-400";
  }
  return "text-sky-700 dark:text-sky-300";
}

export function RecentActivity({ items }: { items: Item[] }) {
  const groups = groupByDateLabel(items);

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Recent Activity
        </h2>
        <p className="text-sm text-muted-foreground">
          Latest household movements
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No recent activity.</p>
      ) : (
        <div className="space-y-5">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {group.label}
              </p>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {item.title ?? item.note ?? item.type}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.subtitle ?? item.type}
                      </p>
                    </div>
                    <p
                      className={`shrink-0 text-sm font-semibold tabular-nums ${amountClass(item)}`}
                    >
                      {amountDisplay(item)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
