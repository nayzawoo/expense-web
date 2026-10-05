"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Scale } from "lucide-react";
import { AccountIcon } from "@/components/account-icon";
import { AdminGate } from "@/components/admin-gate";
import { PageHeader } from "@/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { reconcileAccount } from "@/lib/api/adjustments";
import { fetchAccount, type Account } from "@/lib/api/accounts";
import { getErrorMessage, isApiError } from "@/lib/api/client";
import { formatMMK, formatSignedMMK } from "@/lib/money";
import { invalidateQueryKeys, queryKeys } from "@/lib/query-keys";

const inputClassName =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none";

export default function ReconcileAccountPage() {
  return (
    <AdminGate>
      <ReconcileAccountLoader />
    </AdminGate>
  );
}

function ReconcileAccountLoader() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const detail = useQuery({
    queryKey: [...queryKeys.accounts.all, id],
    queryFn: () => fetchAccount(id),
    enabled: Number.isFinite(id),
  });

  if (detail.isLoading) {
    return (
      <div className="p-4 md:p-6">
        <Skeleton className="mx-auto h-96 w-full max-w-lg" />
      </div>
    );
  }

  if (detail.isError || !detail.data) {
    return (
      <div className="p-4 md:p-6">
        <Alert variant="destructive">
          <AlertTitle>Could not load account</AlertTitle>
          <AlertDescription>{getErrorMessage(detail.error)}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <ReconcileAccountForm
      key={detail.data.account.id}
      account={detail.data.account}
    />
  );
}

function ReconcileAccountForm({ account }: { account: Account }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const calculated = account.current_balance ?? 0;
  const [actualBalance, setActualBalance] = useState("");
  const [note, setNote] = useState("");

  const difference = useMemo(() => {
    if (actualBalance.trim() === "") {
      return null;
    }

    const actual = Number(actualBalance);

    if (!Number.isFinite(actual)) {
      return null;
    }

    return actual - calculated;
  }, [actualBalance, calculated]);

  const reconcile = useMutation({
    mutationFn: () =>
      reconcileAccount(account.id, {
        actual_balance: Number(actualBalance),
        note: note.trim() || null,
      }),
    onSuccess: async () => {
      await invalidateQueryKeys(queryClient, [
        queryKeys.accounts.all,
        queryKeys.dashboard.all,
        queryKeys.adjustments.all,
        queryKeys.transfers.create,
      ]);
      router.push("/accounts");
    },
  });

  const fieldErrors = isApiError(reconcile.error)
    ? reconcile.error.errors
    : undefined;

  function onSubmit(event: FormEvent) {
    event.preventDefault();

    if (difference === null || difference === 0) {
      return;
    }

    reconcile.mutate();
  }

  const differenceClass =
    difference === null || difference === 0
      ? "text-muted-foreground"
      : difference > 0
        ? "text-emerald-700 dark:text-emerald-300"
        : "text-rose-700 dark:text-rose-300";

  return (
    <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Reconcile Balance"
        description="Correct this account to its real-world balance"
        backHref="/accounts"
      />

      <form
        onSubmit={onSubmit}
        className="mx-auto w-full max-w-lg space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <AccountIcon name={account.name} type={account.type} />
          <div>
            <p className="font-semibold">
              {account.name} — {account.owner_name}
            </p>
            <p className="text-sm text-muted-foreground">
              Balance correction, not an expense
            </p>
          </div>
        </div>

        {reconcile.isError ? (
          <Alert variant="destructive">
            <AlertTitle>Could not reconcile</AlertTitle>
            <AlertDescription>
              {getErrorMessage(reconcile.error)}
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="rounded-lg bg-muted/40 px-4 py-3">
          <p className="text-sm text-muted-foreground">Calculated Balance</p>
          <p className="text-lg font-semibold">{formatMMK(calculated)}</p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="actual-balance" className="text-sm font-medium">
            Actual Balance
          </label>
          <input
            id="actual-balance"
            required
            type="number"
            step="1"
            value={actualBalance}
            onChange={(event) => setActualBalance(event.target.value)}
            placeholder="93000"
            className={inputClassName}
          />
          {fieldErrors?.actual_balance?.[0] ? (
            <p className="text-xs text-destructive">
              {fieldErrors.actual_balance[0]}
            </p>
          ) : null}
        </div>

        <div className="rounded-lg border border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">Difference</p>
          <p className={`text-lg font-semibold ${differenceClass}`}>
            {difference === null
              ? "—"
              : difference === 0
                ? "Already matches"
                : formatSignedMMK(difference)}
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="reconcile-note" className="text-sm font-medium">
            Note
          </label>
          <textarea
            id="reconcile-note"
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Physical cash count"
            className={`${inputClassName} resize-none`}
          />
          {fieldErrors?.note?.[0] ? (
            <p className="text-xs text-destructive">{fieldErrors.note[0]}</p>
          ) : null}
        </div>

        {difference !== null && difference !== 0 ? (
          <div className="space-y-1 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
            <p className="flex items-center gap-2 font-medium">
              <Scale className="h-4 w-4" />
              This will record a balance adjustment
            </p>
            <p>Current Balance: {formatMMK(calculated)}</p>
            <p>Actual Balance: {formatMMK(Number(actualBalance))}</p>
            <p>Adjustment: {formatSignedMMK(difference)}</p>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={
            reconcile.isPending || difference === null || difference === 0
          }
          className="w-full cursor-pointer rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {reconcile.isPending ? "Reconciling..." : "Reconcile Balance"}
        </button>
      </form>
    </div>
  );
}
