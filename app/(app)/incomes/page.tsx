"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Plus,
  StickyNote,
  Trash2,
  TrendingUp,
  User,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteIncome, fetchIncomes } from "@/lib/api/incomes";
import { getErrorMessage } from "@/lib/api/client";
import { formatMMK } from "@/lib/money";
import { invalidateQueryKeys, queryKeys } from "@/lib/query-keys";

export default function IncomeLogPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const incomes = useQuery({
    queryKey: [...queryKeys.incomes.all, page],
    queryFn: () => fetchIncomes(page),
  });

  const remove = useMutation({
    mutationFn: deleteIncome,
    onSuccess: async () => {
      await invalidateQueryKeys(queryClient, [
        queryKeys.incomes.all,
        queryKeys.accounts.all,
        queryKeys.dashboard.all,
        queryKeys.analytics.all,
      ]);
    },
  });

  const rows = incomes.data?.data ?? [];
  const meta = incomes.data?.meta;

  return (
    <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Income Log"
        description="ဝင်ငွေ မှတ်တမ်းများ"
        action={
          <Link
            href="/incomes/new"
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add Income
          </Link>
        }
      />

      {incomes.isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      ) : incomes.isError ? (
        <p className="text-sm text-destructive">
          {getErrorMessage(incomes.error)}
        </p>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center">
          <p className="text-muted-foreground">ဝင်ငွေ မှတ်တမ်း မရှိသေးပါ။</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {rows.map((income) => (
              <div
                key={income.id}
                className="overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-900/20 dark:bg-emerald-900/10">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] tracking-wider text-emerald-700 uppercase dark:bg-emerald-900/30 dark:text-emerald-400">
                          Income
                        </span>
                        <span>
                          {income.account}
                          {income.account_is_historical ? (
                            <span className="ml-1 text-[10px] text-amber-600 dark:text-amber-400">
                              (legacy)
                            </span>
                          ) : null}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          {income.date}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="h-3 w-3" />
                          {income.for_whom}
                        </div>
                      </div>
                      {income.note ? (
                        <div className="flex items-start gap-1.5 pt-1 text-xs text-muted-foreground italic">
                          <StickyNote className="mt-0.5 h-3 w-3 shrink-0" />
                          {income.note}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-border pt-3 sm:border-t-0 sm:pt-0">
                    <div className="text-lg font-bold text-emerald-600">
                      + {formatMMK(income.amount)}
                    </div>
                    {income.can_delete ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this income record?",
                            )
                          ) {
                            remove.mutate(income.id);
                          }
                        }}
                        disabled={remove.isPending}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-background text-rose-600 transition-colors hover:bg-rose-50 dark:hover:bg-rose-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {meta && meta.last_page > 1 ? (
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <button
                type="button"
                disabled={page <= 1 || incomes.isFetching}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="cursor-pointer rounded-md border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
              >
                Previous
              </button>
              <span className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground">
                {meta.current_page} / {meta.last_page}
              </span>
              <button
                type="button"
                disabled={page >= meta.last_page || incomes.isFetching}
                onClick={() =>
                  setPage((p) => Math.min(meta.last_page, p + 1))
                }
                className="cursor-pointer rounded-md border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
