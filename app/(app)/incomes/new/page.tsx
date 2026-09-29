"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  DollarSign,
  StickyNote,
  User,
  Wallet,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createIncome,
  fetchIncomeCreateOptions,
  type IncomeAccountOption,
} from "@/lib/api/incomes";
import { getErrorMessage, isApiError } from "@/lib/api/client";

const inputClassName =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none";

export default function IncomeCreatePage() {
  const options = useQuery({
    queryKey: ["incomes", "create"],
    queryFn: fetchIncomeCreateOptions,
  });

  if (options.isLoading) {
    return (
      <div className="p-4 md:p-6">
        <Skeleton className="mx-auto h-80 w-full max-w-lg" />
      </div>
    );
  }

  if (options.isError || !options.data) {
    return (
      <div className="p-4 md:p-6">
        <Alert variant="destructive">
          <AlertTitle>Could not load form</AlertTitle>
          <AlertDescription>{getErrorMessage(options.error)}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <IncomeCreateForm
      key={options.data.accounts.map((a) => a.id).join("-")}
      accounts={options.data.accounts}
      forWhomOptions={options.data.for_whom_options}
    />
  );
}

function IncomeCreateForm({
  accounts,
  forWhomOptions,
}: {
  accounts: IncomeAccountOption[];
  forWhomOptions: string[];
}) {
  const queryClient = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState(
    accounts[0] ? String(accounts[0].id) : "",
  );
  const [forWhom, setForWhom] = useState(forWhomOptions[0] ?? "All");
  const [note, setNote] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const create = useMutation({
    mutationFn: createIncome,
    onSuccess: async (data) => {
      setAmount("");
      setNote("");
      setSuccessMessage(data.message);
      await queryClient.invalidateQueries({ queryKey: ["incomes"] });
      await queryClient.invalidateQueries({ queryKey: ["analytics"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const fieldErrors = isApiError(create.error) ? create.error.errors : undefined;

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSuccessMessage(null);
    create.mutate({
      date,
      amount: Number(amount),
      account_id: Number(accountId),
      for_whom: forWhom,
      note: note.trim() || null,
    });
  }

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="border-b border-border px-4 py-4 md:px-6">
        <h1 className="text-xl font-bold text-foreground">Add Income</h1>
        <p className="text-sm text-muted-foreground">ဝင်ငွေ ထည့်သွင်းရန်</p>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-lg">
          {accounts.length === 0 ? (
            <Alert>
              <AlertTitle>No active accounts</AlertTitle>
              <AlertDescription>
                Create an active account before adding income.
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
                  <AlertTitle>Could not save income</AlertTitle>
                  <AlertDescription>
                    {getErrorMessage(create.error)}
                  </AlertDescription>
                </Alert>
              ) : null}

              <div className="space-y-1.5">
                <label
                  htmlFor="income-date"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  Date
                </label>
                <input
                  id="income-date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputClassName}
                />
                {fieldErrors?.date?.[0] ? (
                  <p className="text-xs text-destructive">{fieldErrors.date[0]}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="income-amount"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  Amount (Ks)
                </label>
                <input
                  id="income-amount"
                  type="number"
                  required
                  min={1}
                  step={1}
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
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
                  htmlFor="income-account"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  Account
                </label>
                <select
                  id="income-account"
                  required
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className={inputClassName}
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="income-for-whom"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  For Whom
                </label>
                <select
                  id="income-for-whom"
                  required
                  value={forWhom}
                  onChange={(e) => setForWhom(e.target.value)}
                  className={inputClassName}
                >
                  {forWhomOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="income-note"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <StickyNote className="h-4 w-4 text-muted-foreground" />
                  Note{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="income-note"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className={`${inputClassName} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={create.isPending}
                className="w-full cursor-pointer rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {create.isPending ? "သိမ်းဆည်းနေသည်..." : "Save Income"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
