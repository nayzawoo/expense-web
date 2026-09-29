"use client";

import { BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ExpenseForm } from "@/components/expense-form";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/api/client";
import { fetchExpenseCreateOptions } from "@/lib/api/expenses";
import { formatMMK } from "@/lib/money";

export default function ExpenseCreatePage() {
  const query = useQuery({
    queryKey: ["expenses", "create"],
    queryFn: fetchExpenseCreateOptions,
  });

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

  return <ExpenseCreateContent data={query.data} />;
}

function ExpenseCreateContent({
  data,
}: {
  data: Awaited<ReturnType<typeof fetchExpenseCreateOptions>>;
}) {
  const maxSpending = Math.max(
    0,
    ...data.category_spending.map((item) => item.total),
  );

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border px-4 py-4 md:px-6">
        <h1 className="text-xl font-bold">Add Expense</h1>
        <p className="text-sm text-muted-foreground">ထွက်ငွေ ထည့်သွင်းရန်</p>
      </header>
      <div className="p-4 md:p-6">
        <div className="mx-auto max-w-lg space-y-8">
          <ExpenseForm
            key={data.accounts.map((account) => account.id).join("-")}
            accounts={data.accounts}
            categories={data.categories}
            forWhomOptions={data.for_whom_options}
          />

          {data.category_spending.length > 0 ? (
            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">
                  ဒီလ ထွက်ငွေ အကျဥ်းချုပ်
                </h2>
              </div>
              <div className="space-y-3">
                {data.category_spending.map((item) => (
                  <div key={item.name}>
                    <div className="mb-1 flex justify-between gap-3 text-xs">
                      <span>{item.name}</span>
                      <span className="font-medium">
                        {formatMMK(item.total)}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${maxSpending ? (item.total / maxSpending) * 100 : 0}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
