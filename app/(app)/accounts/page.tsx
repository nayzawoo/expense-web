"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Banknote,
  Edit2,
  Landmark,
  Plus,
  Power,
  Wallet,
} from "lucide-react";
import { AccountIcon } from "@/components/account-icon";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "@/hooks/use-auth";
import { fetchAccounts, toggleAccountActive } from "@/lib/api/accounts";
import { getErrorMessage } from "@/lib/api/client";
import { formatMMK } from "@/lib/money";
import { invalidateQueryKeys, queryKeys } from "@/lib/query-keys";

const typeMeta = {
  bank: { label: "Bank", icon: Landmark },
  wallet: { label: "Wallet", icon: Wallet },
  cash: { label: "Cash", icon: Banknote },
} as const;

const typeOrder = ["bank", "wallet", "cash"] as const;

export default function AccountsPage() {
  const me = useMe();
  const isAdmin = Boolean(me.data?.user?.is_admin);
  const queryClient = useQueryClient();
  const accounts = useQuery({
    queryKey: queryKeys.accounts.all,
    queryFn: fetchAccounts,
  });

  const toggle = useMutation({
    mutationFn: toggleAccountActive,
    onSuccess: async () => {
      await invalidateQueryKeys(queryClient, [
        queryKeys.accounts.all,
        queryKeys.dashboard.all,
        queryKeys.expenses.create,
        queryKeys.incomes.create,
        queryKeys.transfers.create,
      ]);
    },
  });

  const rows = accounts.data?.accounts ?? [];

  return (
    <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Accounts"
        description="Household money locations"
        action={
          isAdmin ? (
            <Link
              href="/accounts/new"
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Add Account
            </Link>
          ) : null
        }
      />

      {accounts.isLoading ? (
        <Skeleton className="h-28 w-full rounded-xl" />
      ) : accounts.isError ? (
        <p className="text-sm text-destructive">
          {getErrorMessage(accounts.error)}
        </p>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No accounts yet.
            {isAdmin
              ? " Add your first household account to get started."
              : ""}
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:max-w-sm">
            <p className="text-sm text-muted-foreground">
              Total Household Balance
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {formatMMK(accounts.data?.total_balance ?? 0)}
            </p>
          </div>

          <div className="space-y-6">
            {typeOrder.map((type) => {
              const group = rows.filter((account) => account.type === type);
              if (group.length === 0) {
                return null;
              }

              const TypeIcon = typeMeta[type].icon;

              return (
                <section key={type} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TypeIcon className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                      {typeMeta[type].label}
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      ({group.length})
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="divide-y divide-border">
                      {group.map((account) => (
                        <div
                          key={account.id}
                          className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between ${
                            account.is_active
                              ? ""
                              : "bg-muted/30 opacity-70"
                          }`}
                        >
                          <div className="flex min-w-0 items-start gap-3">
                            <AccountIcon
                              name={account.name}
                              type={account.type}
                              className="mt-0.5"
                            />
                            <div className="min-w-0 space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-base font-semibold text-foreground">
                                  {account.name}
                                </h3>
                                <span
                                  className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                                    account.is_active
                                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {account.is_active ? "Active" : "Inactive"}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {account.owner_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {typeMeta[account.type].label}
                              </p>
                              <div className="space-y-0.5 pt-1 text-sm">
                                <p className="text-muted-foreground">
                                  Opening: {formatMMK(account.opening_balance)}
                                </p>
                                {account.balance_started_at ? (
                                  <p className="text-muted-foreground">
                                    Tracking from: {account.balance_started_at}
                                  </p>
                                ) : (
                                  <p className="text-amber-600 dark:text-amber-400">
                                    Balance tracking not started
                                  </p>
                                )}
                                <p className="font-semibold text-foreground">
                                  Balance:{" "}
                                  {formatMMK(account.current_balance ?? 0)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {isAdmin ? (
                            <div className="flex shrink-0 gap-2 self-end sm:self-center">
                              <Link
                                href={`/accounts/${account.id}/edit`}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                title="Edit"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </Link>
                              <button
                                type="button"
                                onClick={() => {
                                  const action = account.is_active
                                    ? "deactivate"
                                    : "activate";
                                  if (
                                    confirm(
                                      `Are you sure you want to ${action} "${account.name}"?`,
                                    )
                                  ) {
                                    toggle.mutate(account.id);
                                  }
                                }}
                                disabled={toggle.isPending}
                                className={`inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background transition-colors ${
                                  account.is_active
                                    ? "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                                    : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                }`}
                                title={
                                  account.is_active ? "Deactivate" : "Activate"
                                }
                              >
                                <Power className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
