"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExpenseForm } from "@/components/expense-form";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/api/client";
import { fetchExpense } from "@/lib/api/expenses";
import { queryKeys } from "@/lib/query-keys";

export default function ExpenseEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const expenseId = Number(id);
  const query = useQuery({
    queryKey: [...queryKeys.expenses.all, "detail", expenseId],
    queryFn: () => fetchExpense(expenseId),
    enabled: Number.isInteger(expenseId) && expenseId > 0,
  });

  if (!Number.isInteger(expenseId) || expenseId <= 0) {
    return <p className="p-4 text-sm text-destructive md:p-6">Invalid expense.</p>;
  }

  if (query.isLoading) {
    return (
      <div className="p-4 md:p-6">
        <Skeleton className="mx-auto h-96 w-full max-w-lg" />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <p className="p-4 text-sm text-destructive md:p-6">
        {getErrorMessage(query.error)}
      </p>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border px-4 py-4 md:px-6">
        <h1 className="text-xl font-bold">Edit Expense</h1>
        <p className="text-sm text-muted-foreground">
          Correct a household spending record
        </p>
      </header>
      <div className="p-4 md:p-6">
        <div className="mx-auto max-w-lg">
          <ExpenseForm
            key={query.data.expense.id}
            accounts={query.data.accounts}
            categories={query.data.categories}
            forWhomOptions={query.data.for_whom_options}
            initial={query.data.expense}
          />
        </div>
      </div>
    </div>
  );
}
