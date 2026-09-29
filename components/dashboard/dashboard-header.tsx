import Link from "next/link";
import { ListOrdered, MinusCircle, PlusCircle } from "lucide-react";

export function DashboardHeader({ monthLabel }: { monthLabel: string }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-xl font-bold text-foreground">{monthLabel}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Household Overview</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/expenses/new"
          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-300 dark:hover:bg-rose-900/40"
        >
          <MinusCircle className="h-4 w-4" />
          Expense
        </Link>
        <Link
          href="/incomes/new"
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
        >
          <PlusCircle className="h-4 w-4" />
          Income
        </Link>
        <Link
          href="/expenses"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <ListOrdered className="h-4 w-4" />
          Expense Log
        </Link>
      </div>
    </header>
  );
}
