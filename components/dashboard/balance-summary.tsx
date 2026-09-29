import { formatMMK } from "@/lib/money";
import type { DashboardPayload } from "@/lib/api/dashboard";

type Balance = DashboardPayload["balance"];

export function BalanceSummary({
  total,
  accounts,
  hasMore,
}: {
  total: number;
  accounts: Balance["accounts"];
  hasMore?: boolean;
}) {
  return (
    <section className="dashboard-panel">
      <p className="text-sm text-muted-foreground">Total Balance</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-foreground tabular-nums">
        {formatMMK(total)}
      </p>

      {accounts.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No accounts yet.</p>
      ) : (
        <div className="mt-5 space-y-2.5 border-t border-border pt-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <p className="truncate text-muted-foreground">
                {account.label}
                {!account.is_active ? (
                  <span className="ml-1 text-xs">(inactive)</span>
                ) : null}
              </p>
              <p className="shrink-0 font-medium text-foreground tabular-nums">
                {formatMMK(account.current_balance)}
              </p>
            </div>
          ))}
          {hasMore ? (
            <p className="text-xs text-muted-foreground">
              Showing top accounts by balance
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}
