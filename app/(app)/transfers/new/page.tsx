"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRightLeft,
  CalendarDays,
  DollarSign,
  StickyNote,
  Wallet,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createTransfer,
  fetchTransferCreateOptions,
  type TransferAccountOption,
} from "@/lib/api/transfers";
import { getErrorMessage, isApiError } from "@/lib/api/client";
import { formatMMK } from "@/lib/money";

const inputClassName =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none";

export default function TransferCreatePage() {
  const options = useQuery({
    queryKey: ["transfers", "create"],
    queryFn: fetchTransferCreateOptions,
  });

  if (options.isLoading) {
    return (
      <div className="p-4 md:p-6">
        <Skeleton className="mx-auto h-80 w-full max-w-lg" />
      </div>
    );
  }

  if (options.isError) {
    return (
      <div className="p-4 md:p-6">
        <Alert variant="destructive">
          <AlertTitle>Could not load accounts</AlertTitle>
          <AlertDescription>{getErrorMessage(options.error)}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const accounts = options.data?.accounts ?? [];

  return (
    <TransferCreateForm
      key={accounts.map((account) => account.id).join("-")}
      accounts={accounts}
    />
  );
}

function TransferCreateForm({
  accounts,
}: {
  accounts: TransferAccountOption[];
}) {
  const queryClient = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [fromAccountId, setFromAccountId] = useState(
    accounts[0] ? String(accounts[0].id) : "",
  );
  const [toAccountId, setToAccountId] = useState(
    accounts[1] ? String(accounts[1].id) : "",
  );
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fromAccount = useMemo(
    () => accounts.find((account) => String(account.id) === fromAccountId),
    [accounts, fromAccountId],
  );

  const toAccounts = useMemo(
    () => accounts.filter((account) => String(account.id) !== fromAccountId),
    [accounts, fromAccountId],
  );

  const create = useMutation({
    mutationFn: createTransfer,
    onSuccess: async (data) => {
      setAmount("");
      setNote("");
      setSuccessMessage(data.message);
      await queryClient.invalidateQueries({ queryKey: ["transfers"] });
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
      await queryClient.invalidateQueries({ queryKey: ["transfers", "create"] });
    },
  });

  const fieldErrors = isApiError(create.error) ? create.error.errors : undefined;

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSuccessMessage(null);
    create.mutate({
      date,
      from_account_id: Number(fromAccountId),
      to_account_id: Number(toAccountId),
      amount: Number(amount),
      note: note.trim() || null,
    });
  }

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="border-b border-border px-4 py-4 md:px-6">
        <h1 className="text-xl font-bold text-foreground">Transfer</h1>
        <p className="text-sm text-muted-foreground">အကောင့်ချင်း ငွေလွှဲရန်</p>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-lg">
          {accounts.length < 2 ? (
            <Alert>
              <AlertTitle>Need two active accounts</AlertTitle>
              <AlertDescription>
                Create at least two active accounts before transferring.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              {successMessage ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                  ✓ {successMessage}
                </div>
              ) : null}

              {create.isError ? (
                <Alert variant="destructive">
                  <AlertTitle>Could not save transfer</AlertTitle>
                  <AlertDescription>
                    {getErrorMessage(create.error)}
                  </AlertDescription>
                </Alert>
              ) : null}

              <div className="space-y-1.5">
                <label
                  htmlFor="transfer-date"
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  Date
                </label>
                <input
                  id="transfer-date"
                  type="date"
                  required
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className={inputClassName}
                />
                {fieldErrors?.date?.[0] ? (
                  <p className="text-xs text-destructive">
                    {fieldErrors.date[0]}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="transfer-from"
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  From Account
                </label>
                <select
                  id="transfer-from"
                  required
                  value={fromAccountId}
                  onChange={(event) => {
                    const nextFrom = event.target.value;
                    setFromAccountId(nextFrom);
                    if (toAccountId === nextFrom) {
                      const fallback = accounts.find(
                        (account) => String(account.id) !== nextFrom,
                      );
                      setToAccountId(fallback ? String(fallback.id) : "");
                    }
                  }}
                  className={inputClassName}
                >
                  <option value="">-- From account ရွေးချယ်ပါ --</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.label}
                    </option>
                  ))}
                </select>
                {fromAccount ? (
                  <p className="text-xs text-muted-foreground">
                    Available balance: {formatMMK(fromAccount.current_balance)}
                    <span className="ml-1 opacity-80">(informational only)</span>
                  </p>
                ) : null}
                {fieldErrors?.from_account_id?.[0] ? (
                  <p className="text-xs text-destructive">
                    {fieldErrors.from_account_id[0]}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="transfer-to"
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                  To Account
                </label>
                <select
                  id="transfer-to"
                  required
                  value={toAccountId}
                  onChange={(event) => setToAccountId(event.target.value)}
                  className={inputClassName}
                >
                  <option value="">-- To account ရွေးချယ်ပါ --</option>
                  {toAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.label}
                    </option>
                  ))}
                </select>
                {fieldErrors?.to_account_id?.[0] ? (
                  <p className="text-xs text-destructive">
                    {fieldErrors.to_account_id[0]}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="transfer-amount"
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  Amount (Ks)
                </label>
                <input
                  id="transfer-amount"
                  type="number"
                  required
                  min={1}
                  step={1}
                  placeholder="0"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className={inputClassName}
                />
                {fieldErrors?.amount?.[0] ? (
                  <p className="text-xs text-destructive">
                    {fieldErrors.amount[0]}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="transfer-note"
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <StickyNote className="h-4 w-4 text-muted-foreground" />
                  Note{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="transfer-note"
                  rows={3}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="eg. ATM Withdrawal"
                  className={`${inputClassName} resize-none`}
                />
                {fieldErrors?.note?.[0] ? (
                  <p className="text-xs text-destructive">
                    {fieldErrors.note[0]}
                  </p>
                ) : null}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={create.isPending}
                  className="w-full cursor-pointer rounded-lg bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {create.isPending ? "သိမ်းဆည်းနေသည်..." : "Save Transfer"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
