"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { AdminGate } from "@/components/admin-gate";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteAdjustment, fetchAdjustments } from "@/lib/api/adjustments";
import { getErrorMessage } from "@/lib/api/client";
import { formatMMK, formatSignedMMK } from "@/lib/money";
import { invalidateQueryKeys, queryKeys } from "@/lib/query-keys";

export default function AdjustmentsPage() {
  return (
    <AdminGate>
      <AdjustmentsContent />
    </AdminGate>
  );
}

function AdjustmentsContent() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const adjustments = useQuery({
    queryKey: [...queryKeys.adjustments.all, page],
    queryFn: () => fetchAdjustments(page),
  });

  const remove = useMutation({
    mutationFn: deleteAdjustment,
    onSuccess: async () => {
      await invalidateQueryKeys(queryClient, [
        queryKeys.adjustments.all,
        queryKeys.accounts.all,
        queryKeys.dashboard.all,
        queryKeys.transfers.create,
      ]);
    },
  });

  const rows = adjustments.data?.data ?? [];
  const meta = adjustments.data?.meta;

  return (
    <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Adjustments"
        description="Admin balance reconciliations"
        backHref="/accounts"
      />

      {adjustments.isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ) : adjustments.isError ? (
        <p className="text-sm text-destructive">
          {getErrorMessage(adjustments.error)}
        </p>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
          No balance adjustments yet.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="divide-y divide-border">
              {rows.map((adjustment) => (
                <div
                  key={adjustment.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0 space-y-1 text-sm">
                    <p className="font-semibold">{adjustment.account}</p>
                    <p className="text-muted-foreground">{adjustment.date}</p>
                    <p className="text-muted-foreground">
                      Before: {formatMMK(adjustment.balance_before)}
                    </p>
                    <p className="text-muted-foreground">
                      Actual: {formatMMK(adjustment.actual_balance)}
                    </p>
                    <p
                      className={
                        adjustment.amount > 0
                          ? "font-semibold text-emerald-700 dark:text-emerald-300"
                          : adjustment.amount < 0
                            ? "font-semibold text-rose-700 dark:text-rose-300"
                            : "font-semibold"
                      }
                    >
                      Adjustment: {formatSignedMMK(adjustment.amount)}
                    </p>
                    {adjustment.note ? (
                      <p className="text-muted-foreground">{adjustment.note}</p>
                    ) : null}
                    <p className="text-muted-foreground">
                      Recorded by {adjustment.recorded_by ?? "—"}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={remove.isPending}
                    onClick={() => {
                      if (
                        confirm(
                          "Delete this adjustment? The account balance will be recalculated without it.",
                        )
                      ) {
                        remove.mutate(adjustment.id);
                      }
                    }}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center self-end rounded-md border border-border text-rose-600 hover:bg-rose-50 disabled:opacity-50 sm:self-start dark:hover:bg-rose-950/30"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {meta && meta.last_page > 1 ? (
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || adjustments.isFetching}
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
                disabled={page >= meta.last_page || adjustments.isFetching}
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
