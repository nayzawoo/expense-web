import { formatMMK } from "@/lib/money";
import type { DashboardPayload } from "@/lib/api/dashboard";

type Item = DashboardPayload["spendingByPerson"][number];

export function SpendingForSummary({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="dashboard-panel bg-muted/20 p-4 shadow-none">
      <h2 className="text-sm font-semibold text-foreground">Spending For</h2>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div
            key={item.person_name}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <p className="text-muted-foreground">
              {item.person_name === "All" ? "Household" : item.person_name}
            </p>
            <p className="font-medium text-foreground tabular-nums">
              {formatMMK(item.total)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
