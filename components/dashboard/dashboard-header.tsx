import { ListOrdered, MinusCircle, PlusCircle } from "lucide-react";

export function DashboardHeader({ monthLabel }: { monthLabel: string }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-xl font-bold text-foreground">{monthLabel}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Household Overview</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 opacity-60 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-300">
          <MinusCircle className="h-4 w-4" />
          Expense
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 opacity-60 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
          <PlusCircle className="h-4 w-4" />
          Income
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground opacity-60">
          <ListOrdered className="h-4 w-4" />
          Expense Log
        </span>
      </div>
    </header>
  );
}
