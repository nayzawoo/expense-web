"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  DollarSign,
  StickyNote,
  Tag,
  User,
  Wallet,
} from "lucide-react";
import { AccountIcon } from "@/components/account-icon";
import { CategoryIcon } from "@/components/category-icon";
import { RichSelect } from "@/components/rich-select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getErrorMessage, isApiError } from "@/lib/api/client";
import {
  createExpense,
  updateExpense,
  type ExpenseAccountOption,
  type ExpenseCategoryOption,
  type ExpenseFormPayload,
} from "@/lib/api/expenses";
import { invalidateQueryKeys, queryKeys } from "@/lib/query-keys";

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none";

type InitialExpense = {
  id: number;
  date: string;
  amount: number;
  account_id: number | null;
  category_id: number;
  for_whom: string;
  note: string | null;
};

export function ExpenseForm({
  accounts,
  categories,
  forWhomOptions,
  initial,
}: {
  accounts: ExpenseAccountOption[];
  categories: ExpenseCategoryOption[];
  forWhomOptions: string[];
  initial?: InitialExpense;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [date, setDate] = useState(
    initial?.date ?? new Date().toISOString().slice(0, 10),
  );
  const [amount, setAmount] = useState(
    initial ? String(Math.round(initial.amount)) : "",
  );
  const [accountId, setAccountId] = useState(
    initial?.account_id
      ? String(initial.account_id)
      : accounts[0]
        ? String(accounts[0].id)
        : "",
  );
  const [categoryId, setCategoryId] = useState(
    initial ? String(initial.category_id) : "",
  );
  const [forWhom, setForWhom] = useState(initial?.for_whom ?? "All");
  const [note, setNote] = useState(initial?.note ?? "");
  const [success, setSuccess] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: ExpenseFormPayload) =>
      initial ? updateExpense(initial.id, payload) : createExpense(payload),
    onSuccess: async (data) => {
      await invalidateQueryKeys(queryClient, [
        queryKeys.expenses.all,
        queryKeys.accounts.all,
        queryKeys.dashboard.all,
        queryKeys.analytics.all,
      ]);

      if (initial) {
        router.push("/expenses");
        return;
      }

      setAmount("");
      setNote("");
      setSuccess(data.message);
    },
  });
  const errors = isApiError(mutation.error) ? mutation.error.errors : undefined;

  function submit(event: FormEvent) {
    event.preventDefault();
    setSuccess(null);
    mutation.mutate({
      date,
      amount: Number(amount),
      account_id: Number(accountId),
      category_id: Number(categoryId),
      for_whom: forWhom,
      note: note.trim() || null,
    });
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {success ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
          ✓ {success}
        </div>
      ) : null}

      {mutation.isError ? (
        <Alert variant="destructive">
          <AlertTitle>Could not save expense</AlertTitle>
          <AlertDescription>{getErrorMessage(mutation.error)}</AlertDescription>
        </Alert>
      ) : null}

      <ExpenseField
        id="expense-date"
        label="Date"
        icon={CalendarDays}
        error={errors?.date?.[0]}
      >
        <input
          id="expense-date"
          required
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className={inputClass}
        />
      </ExpenseField>

      <ExpenseField
        id="expense-amount"
        label="Amount (Ks)"
        icon={DollarSign}
        error={errors?.amount?.[0]}
      >
        <input
          id="expense-amount"
          required
          type="number"
          min={1}
          step={1}
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="0"
          className={inputClass}
        />
      </ExpenseField>

      <ExpenseField
        id="expense-account"
        label="From (Account)"
        icon={Wallet}
        error={errors?.account_id?.[0]}
      >
        <RichSelect
          id="expense-account"
          required
          value={accountId}
          onValueChange={setAccountId}
          placeholder="-- Account ရွေးချယ်ပါ --"
          options={accounts.map((account) => ({
            value: String(account.id),
            label: account.label,
            leading: (
              <AccountIcon
                name={account.name ?? account.label}
                type={
                  account.type as "bank" | "wallet" | "cash" | undefined
                }
                size="md"
              />
            ),
          }))}
        />
      </ExpenseField>

      <ExpenseField
        id="expense-category"
        label="Category"
        icon={Tag}
        error={errors?.category_id?.[0]}
      >
        <RichSelect
          id="expense-category"
          required
          value={categoryId}
          onValueChange={setCategoryId}
          placeholder="-- Category ရွေးချယ်ပါ --"
          options={categories.map((category) => ({
            value: String(category.id),
            label: category.name,
            leading: (
              <span
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                style={{
                  backgroundColor: `${category.color}22`,
                  color: category.color,
                }}
              >
                <CategoryIcon name={category.icon} className="h-4.5 w-4.5" />
              </span>
            ),
          }))}
        />
      </ExpenseField>

      <ExpenseField
        id="expense-for-whom"
        label="For Whom"
        icon={User}
        error={errors?.for_whom?.[0]}
      >
        <select
          id="expense-for-whom"
          required
          value={forWhom}
          onChange={(event) => setForWhom(event.target.value)}
          className={inputClass}
        >
          {forWhomOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </ExpenseField>

      <ExpenseField
        id="expense-note"
        label="Note"
        icon={StickyNote}
        optional
        error={errors?.note?.[0]}
      >
        <textarea
          id="expense-note"
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className={`${inputClass} resize-none`}
        />
      </ExpenseField>

      <div className="flex gap-3 pt-2">
        {initial ? (
          <Link
            href="/expenses"
            className="rounded-lg border border-border px-4 py-3 text-sm font-medium hover:bg-accent"
          >
            Cancel
          </Link>
        ) : null}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex-1 cursor-pointer rounded-lg bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mutation.isPending
            ? "Saving..."
            : initial
              ? "Save Changes"
              : "Save Expense"}
        </button>
      </div>
    </form>
  );
}

function ExpenseField({
  id,
  label,
  icon: Icon,
  optional = false,
  error,
  children,
}: {
  id: string;
  label: string;
  icon: typeof CalendarDays;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {label}
        {optional ? (
          <span className="font-normal text-muted-foreground">(optional)</span>
        ) : null}
      </label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
