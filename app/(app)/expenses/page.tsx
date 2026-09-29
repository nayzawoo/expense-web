"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { AccountIcon } from "@/components/account-icon";
import { CategoryIcon } from "@/components/category-icon";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/api/client";
import {
  deleteExpense,
  fetchExpenses,
  type Expense,
  type ExpenseFilters,
} from "@/lib/api/expenses";
import { formatMMK } from "@/lib/money";
import { invalidateQueryKeys, queryKeys } from "@/lib/query-keys";

type QueryFilters = Partial<ExpenseFilters> & { page: number };

const selectClass =
  "rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm";

function forWhomLabel(value: string): string {
  return value === "All" ? "Household" : value;
}

function formatDateHeading(date: string): string {
  const label = new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const today = new Date().toISOString().slice(0, 10);
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().slice(0, 10);

  if (date === today) return `${label} · Today`;
  if (date === yesterday) return `${label} · Yesterday`;
  return label;
}

export default function ExpensesPage() {
  const [filters, setFilters] = useState<QueryFilters>({
    date_preset: "this_month",
    page: 1,
  });
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queryClient = useQueryClient();

  const queryFilters = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch.trim() || null,
    }),
    [debouncedSearch, filters],
  );
  const expenses = useQuery({
    queryKey: [...queryKeys.expenses.all, queryFilters],
    queryFn: () => fetchExpenses(queryFilters),
  });
  const remove = useMutation({
    mutationFn: deleteExpense,
    onSuccess: async () => {
      await invalidateQueryKeys(queryClient, [
        queryKeys.expenses.all,
        queryKeys.accounts.all,
        queryKeys.dashboard.all,
        queryKeys.analytics.all,
      ]);
    },
  });

  const groups = useMemo(() => {
    const grouped = new Map<string, Expense[]>();
    for (const expense of expenses.data?.data ?? []) {
      grouped.set(expense.date, [
        ...(grouped.get(expense.date) ?? []),
        expense,
      ]);
    }
    return [...grouped.entries()];
  }, [expenses.data]);

  function updateFilters(next: Partial<QueryFilters>) {
    setFilters((current) => ({
      ...current,
      ...next,
      page: next.page ?? 1,
    }));
  }

  function updateSearch(value: string) {
    setSearchInput(value);
    setFilters((current) => ({ ...current, page: 1 }));
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(value), 400);
  }

  function clearFilters() {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    setSearchInput("");
    setDebouncedSearch("");
    setFilters({ date_preset: "this_month", page: 1 });
  }

  return (
    <div className="flex h-full flex-1 flex-col gap-5 p-4 md:gap-6 md:p-6">
      <PageHeader
        title="Expense Log"
        description="Track and review household spending"
        action={
          <Link
            href="/expenses/new"
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-700"
          >
            <Plus className="h-4 w-4" />
            Add Expense
          </Link>
        }
      />

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={searchInput}
          onChange={(event) => updateSearch(event.target.value)}
          placeholder="Search expenses..."
          className="w-full rounded-lg border border-input bg-background py-2.5 pr-3 pl-9 text-sm text-foreground shadow-sm focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
        />
      </div>

      {expenses.data ? (
        <>
          <div className="flex flex-wrap gap-2">
            {expenses.data.options.date_presets.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() =>
                  updateFilters({
                    date_preset: preset.value,
                    date_from: null,
                    date_to: null,
                  })
                }
                className={
                  filters.date_preset === preset.value
                    ? "rounded-full bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white"
                    : "rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
                }
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={filters.category_id ?? ""}
              onChange={(event) =>
                updateFilters({
                  category_id: event.target.value
                    ? Number(event.target.value)
                    : null,
                })
              }
              className={selectClass}
            >
              <option value="">All Categories</option>
              {expenses.data.options.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={filters.account_id ?? ""}
              onChange={(event) =>
                updateFilters({
                  account_id:
                    event.target.value === "legacy"
                      ? "legacy"
                      : event.target.value
                        ? Number(event.target.value)
                        : null,
                })
              }
              className={selectClass}
            >
              <option value="">All Accounts</option>
              <option value="legacy">Legacy / Unassigned</option>
              {expenses.data.options.accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.label}
                  {account.is_active === false ? " (inactive)" : ""}
                </option>
              ))}
            </select>

            <select
              value={filters.for_whom ?? ""}
              onChange={(event) =>
                updateFilters({ for_whom: event.target.value || null })
              }
              className={selectClass}
            >
              <option value="">All People</option>
              {expenses.data.options.for_whom_options.map((option) => (
                <option key={option} value={option}>
                  {forWhomLabel(option)}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Clear
            </button>
          </div>

          {filters.date_preset === "custom" ? (
            <div className="flex flex-wrap gap-2">
              <input
                type="date"
                value={filters.date_from ?? ""}
                onChange={(event) =>
                  updateFilters({ date_from: event.target.value || null })
                }
                className={selectClass}
              />
              <input
                type="date"
                value={filters.date_to ?? ""}
                onChange={(event) =>
                  updateFilters({ date_to: event.target.value || null })
                }
                className={selectClass}
              />
            </div>
          ) : null}

          <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
            <p className="text-sm font-medium">{expenses.data.summary.label}</p>
            <p className="mt-0.5 text-sm text-muted-foreground tabular-nums">
              {expenses.data.summary.count}{" "}
              {expenses.data.summary.count === 1 ? "expense" : "expenses"} ·{" "}
              {formatMMK(expenses.data.summary.total)}
            </p>
          </div>
        </>
      ) : null}

      {expenses.isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      ) : expenses.isError ? (
        <p className="text-sm text-destructive">
          {getErrorMessage(expenses.error)}
        </p>
      ) : groups.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-10 text-center text-sm text-muted-foreground">
          No expenses match these filters.
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map(([date, items]) => (
            <section
              key={date}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            >
              <header className="flex items-center justify-between gap-3 border-b border-border bg-muted/30 px-4 py-3">
                <h2 className="text-sm font-semibold">
                  {formatDateHeading(date)}
                </h2>
                <p className="text-sm font-semibold tabular-nums">
                  {formatMMK(expenses.data?.daily_totals[date] ?? 0)}
                </p>
              </header>

              <div className="divide-y divide-border">
                {items.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-start gap-3 px-4 py-3"
                  >
                    <div
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        color: expense.category_color ?? undefined,
                        backgroundColor: expense.category_color
                          ? `${expense.category_color}22`
                          : undefined,
                      }}
                    >
                      <CategoryIcon
                        name={expense.category_icon}
                        className="h-4 w-4"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="truncate text-sm font-semibold">
                          {expense.category ?? "Uncategorized"}
                        </p>
                        <p className="shrink-0 text-sm font-semibold text-rose-600 tabular-nums dark:text-rose-400">
                          −{formatMMK(expense.amount)}
                        </p>
                      </div>
                      {expense.note ? (
                        <p className="mt-0.5 truncate text-sm text-muted-foreground">
                          {expense.note}
                        </p>
                      ) : null}

                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="flex min-w-0 items-center gap-1.5 truncate text-xs text-muted-foreground">
                          <AccountIcon
                            name={expense.account_name ?? expense.account}
                            type={
                              expense.account_type === "bank" ||
                              expense.account_type === "wallet" ||
                              expense.account_type === "cash"
                                ? expense.account_type
                                : undefined
                            }
                            size="sm"
                          />
                          <span className="truncate">
                            {expense.account}
                            {expense.account_is_historical
                              ? " · Unassigned legacy"
                              : ""}
                            {" · "}
                            {forWhomLabel(expense.for_whom)}
                          </span>
                        </p>

                        <div className="flex shrink-0 gap-1">
                          {expense.can_update ? (
                            <Link
                              href={`/expenses/${expense.id}/edit`}
                              aria-label="Edit expense"
                              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                          ) : null}
                          {expense.can_delete ? (
                            <button
                              type="button"
                              aria-label="Delete expense"
                              disabled={remove.isPending}
                              onClick={() => {
                                if (
                                  confirm(
                                    "Are you sure you want to delete this expense?",
                                  )
                                ) {
                                  remove.mutate(expense.id);
                                }
                              }}
                              className="cursor-pointer rounded-md p-2 text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50 dark:hover:bg-rose-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {expenses.data && expenses.data.meta.last_page > 1 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <p className="text-sm text-muted-foreground tabular-nums">
            Showing {expenses.data.meta.from ?? 0}–{expenses.data.meta.to ?? 0}{" "}
            of {expenses.data.meta.total}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={
                expenses.data.meta.current_page <= 1 || expenses.isFetching
              }
              onClick={() =>
                updateFilters({
                  page: Math.max(1, expenses.data.meta.current_page - 1),
                })
              }
              className={selectClass}
            >
              Previous
            </button>
            <span className="px-2 text-sm tabular-nums">
              {expenses.data.meta.current_page} /{" "}
              {expenses.data.meta.last_page}
            </span>
            <button
              type="button"
              disabled={
                expenses.data.meta.current_page >=
                  expenses.data.meta.last_page || expenses.isFetching
              }
              onClick={() =>
                updateFilters({
                  page: Math.min(
                    expenses.data.meta.last_page,
                    expenses.data.meta.current_page + 1,
                  ),
                })
              }
              className={selectClass}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
