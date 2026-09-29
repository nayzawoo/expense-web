"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  Coins,
  Landmark,
  SortAsc,
  Tag,
  ToggleLeft,
  User,
} from "lucide-react";
import { AccountIcon } from "@/components/account-icon";
import { AdminGate } from "@/components/admin-gate";
import { PageHeader } from "@/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchAccount,
  updateAccount,
  type Account,
  type AccountType,
} from "@/lib/api/accounts";
import { getErrorMessage, isApiError } from "@/lib/api/client";
import { invalidateQueryKeys, queryKeys } from "@/lib/query-keys";

const typeLabels: Record<AccountType, string> = {
  bank: "Bank",
  wallet: "Wallet",
  cash: "Cash",
};

const inputClassName =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none";

export default function EditAccountPage() {
  return (
    <AdminGate>
      <AccountEditLoader />
    </AdminGate>
  );
}

function AccountEditLoader() {
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
        <Skeleton className="h-40 w-full max-w-lg" />
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
    <AccountEditForm
      key={detail.data.account.id}
      account={detail.data.account}
      types={detail.data.types}
    />
  );
}

function AccountEditForm({
  account,
  types,
}: {
  account: Account;
  types: AccountType[];
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);
  const [name, setName] = useState(account.name);
  const [type, setType] = useState<AccountType>(account.type);
  const [ownerName, setOwnerName] = useState(account.owner_name);
  const [openingBalance, setOpeningBalance] = useState(
    Number(account.opening_balance),
  );
  const [balanceStartedAt, setBalanceStartedAt] = useState(
    account.balance_started_at ?? today,
  );
  const [sortOrder, setSortOrder] = useState(account.sort_order ?? 0);
  const [isActive, setIsActive] = useState(account.is_active);

  const save = useMutation({
    mutationFn: () =>
      updateAccount(account.id, {
        name,
        type,
        owner_name: ownerName,
        opening_balance: openingBalance,
        balance_started_at: balanceStartedAt,
        sort_order: sortOrder,
        is_active: isActive,
      }),
    onSuccess: async () => {
      await invalidateQueryKeys(queryClient, [
        queryKeys.accounts.all,
        queryKeys.dashboard.all,
        queryKeys.expenses.create,
        queryKeys.incomes.create,
        queryKeys.transfers.create,
      ]);
      router.push("/accounts");
    },
  });

  const fieldErrors = isApiError(save.error) ? save.error.errors : undefined;

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    save.mutate();
  }

  return (
    <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Edit Account"
        description="Update household money location"
        backHref="/accounts"
      />

      <div className="mx-auto w-full max-w-lg">
        <form
          onSubmit={onSubmit}
          className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          {save.isError ? (
            <Alert variant="destructive">
              <AlertTitle>Could not update account</AlertTitle>
              <AlertDescription>{getErrorMessage(save.error)}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-1.5">
            <label
              htmlFor="account-name"
              className="flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <Tag className="h-4 w-4 text-muted-foreground" />
              Account Name
            </label>
            <div className="flex items-center gap-3">
              <input
                id="account-name"
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="eg. KBZ, KPay, Cash"
                className={inputClassName}
              />
              <AccountIcon name={name || "Account"} type={type} />
            </div>
            {fieldErrors?.name?.[0] ? (
              <p className="text-xs text-destructive">{fieldErrors.name[0]}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="account-type"
              className="flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <Landmark className="h-4 w-4 text-muted-foreground" />
              Type
            </label>
            <select
              id="account-type"
              value={type}
              onChange={(event) => setType(event.target.value as AccountType)}
              className={inputClassName}
            >
              {types.map((item) => (
                <option key={item} value={item}>
                  {typeLabels[item]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="account-owner"
              className="flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              Owner
            </label>
            <input
              id="account-owner"
              type="text"
              required
              value={ownerName}
              onChange={(event) => setOwnerName(event.target.value)}
              placeholder="eg. Nay Zaw Oo, Wife"
              className={inputClassName}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="account-opening-balance"
              className="flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <Coins className="h-4 w-4 text-muted-foreground" />
              Opening Balance (Ks)
            </label>
            <input
              id="account-opening-balance"
              type="number"
              min={0}
              step="1"
              required
              value={openingBalance}
              onChange={(event) =>
                setOpeningBalance(parseFloat(event.target.value) || 0)
              }
              className={inputClassName}
            />
            <p className="text-xs text-muted-foreground">
              The actual balance this account had on the balance tracking start
              date.
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="account-balance-started-at"
              className="flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              Balance Tracking Start Date
            </label>
            <input
              id="account-balance-started-at"
              type="date"
              required
              value={balanceStartedAt}
              onChange={(event) => setBalanceStartedAt(event.target.value)}
              className={inputClassName}
            />
            <p className="text-xs text-muted-foreground">
              Opening Balance is the actual balance this account had on this
              date. Transactions before this date are kept for history but are
              not included in the current balance.
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="account-sort"
              className="flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <SortAsc className="h-4 w-4 text-muted-foreground" />
              Sort Order
            </label>
            <input
              id="account-sort"
              type="number"
              min={0}
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(parseInt(event.target.value, 10) || 0)
              }
              className={inputClassName}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="account-active"
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <label
              htmlFor="account-active"
              className="flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <ToggleLeft className="h-4 w-4 text-muted-foreground" />
              Active
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={save.isPending}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none disabled:opacity-50"
            >
              {save.isPending ? "Updating..." : "Update Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
