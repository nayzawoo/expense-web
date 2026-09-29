"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  Calendar,
  Plus,
  StickyNote,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteTransfer, fetchTransfers } from "@/lib/api/transfers";
import { getErrorMessage } from "@/lib/api/client";
import { formatMMK } from "@/lib/money";
import { invalidateQueryKeys, queryKeys } from "@/lib/query-keys";

export default function TransferLogPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const transfers = useQuery({
    queryKey: [...queryKeys.transfers.all, page],
    queryFn: () => fetchTransfers(page),
  });

  const remove = useMutation({
    mutationFn: deleteTransfer,
    onSuccess: async () => {
      await invalidateQueryKeys(queryClient, [
        queryKeys.transfers.all,
        queryKeys.accounts.all,
        queryKeys.dashboard.all,
        queryKeys.transfers.create,
      ]);
    },
  });

  const rows = transfers.data?.data ?? [];
  const meta = transfers.data?.meta;

  return (
    <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Transfer Log"
        description="အကောင့်ချင်း ငွေလွှဲ မှတ်တမ်းများ"
        action={
          <Link
            href="/transfers/new"
            className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
          >
            <Plus className="h-4 w-4" />
            Transfer
          </Link>
        }
      />

      {transfers.isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      ) : transfers.isError ? (
        <p className="text-sm text-destructive">
          {getErrorMessage(transfers.error)}
        </p>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center">
          <p className="text-muted-foreground">ငွေလွှဲ မှတ်တမ်း မရှိသေးပါ။</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {rows.map((transfer) => (
              <div
                key={transfer.id}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {transfer.from_account}
                      </p>
                      <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
                        <ArrowDown className="h-4 w-4" />
                      </div>
                      <p className="font-medium text-foreground">
                        {transfer.to_account}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {transfer.date}
                      </div>
                      {transfer.recorded_by ? (
                        <span>by {transfer.recorded_by}</span>
                      ) : null}
                    </div>
                    {transfer.note ? (
                      <div className="flex items-start gap-1.5 pt-1 text-xs text-muted-foreground italic">
                        <StickyNote className="mt-0.5 h-3 w-3 shrink-0" />
                        {transfer.note}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-border pt-3 sm:border-t-0 sm:pt-0">
                    <div className="text-lg font-bold text-sky-600 dark:text-sky-400">
                      {formatMMK(transfer.amount)}
                    </div>
                    {transfer.can_delete ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this transfer?",
                            )
                          ) {
                            remove.mutate(transfer.id);
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
                disabled={page <= 1 || transfers.isFetching}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="cursor-pointer rounded-md border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
              >
                Previous
              </button>
              <span className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground">
                {meta.current_page} / {meta.last_page}
              </span>
              <button
                type="button"
                disabled={page >= meta.last_page || transfers.isFetching}
                onClick={() =>
                  setPage((current) => Math.min(meta.last_page, current + 1))
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
