"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2, Plus, Power, Wallet } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "@/hooks/use-auth";
import { fetchAccounts, toggleAccountActive } from "@/lib/api/accounts";
import { getErrorMessage } from "@/lib/api/client";
import { formatMMK } from "@/lib/money";
import { cn } from "@/lib/utils";

const typeOrder = ["bank", "wallet", "cash"] as const;

export default function AccountsPage() {
  const me = useMe();
  const isAdmin = Boolean(me.data?.user?.is_admin);
  const queryClient = useQueryClient();
  const accounts = useQuery({ queryKey: ["accounts"], queryFn: fetchAccounts });

  const toggle = useMutation({
    mutationFn: toggleAccountActive,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  const grouped = typeOrder.map((type) => ({
    type,
    items: (accounts.data?.accounts ?? []).filter((account) => account.type === type),
  }));

  return (
    <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Accounts"
        description="Household balances by account"
        action={
          isAdmin ? (
            <Link href="/accounts/new" className={cn(buttonVariants(), "gap-2")}>
              <Plus className="size-4" />
              Add Account
            </Link>
          ) : null
        }
      />

      {accounts.isLoading ? (
        <Skeleton className="h-28 w-full rounded-xl" />
      ) : accounts.isError ? (
        <p className="text-sm text-destructive">{getErrorMessage(accounts.error)}</p>
      ) : (
        <>
          <section className="dashboard-panel">
            <p className="text-sm text-muted-foreground">Total Balance</p>
            <p className="mt-2 text-3xl font-bold tabular-nums">
              {formatMMK(accounts.data?.total_balance ?? 0)}
            </p>
          </section>

          {grouped.map((group) =>
            group.items.length === 0 ? null : (
              <section key={group.type} className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {group.type}
                </h2>
                <div className="space-y-3">
                  {group.items.map((account) => (
                    <div key={account.id} className="dashboard-panel">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Wallet className="size-4 text-muted-foreground" />
                            <p className="font-semibold text-foreground">
                              {account.name}
                            </p>
                            <Badge
                              variant={account.is_active ? "default" : "secondary"}
                            >
                              {account.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {account.owner_name} · opening{" "}
                            {formatMMK(account.opening_balance)}
                            {account.balance_started_at
                              ? ` · from ${account.balance_started_at}`
                              : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-semibold tabular-nums">
                            {formatMMK(account.current_balance ?? 0)}
                          </p>
                          {isAdmin ? (
                            <>
                              <Link
                                href={`/accounts/${account.id}/edit`}
                                className={cn(
                                  buttonVariants({
                                    variant: "ghost",
                                    size: "icon-sm",
                                  }),
                                )}
                              >
                                <Edit2 className="size-4" />
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                disabled={toggle.isPending}
                                onClick={() => toggle.mutate(account.id)}
                              >
                                <Power className="size-4" />
                              </Button>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ),
          )}
        </>
      )}
    </div>
  );
}
