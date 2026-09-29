"use client";

import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import {
  CATEGORIES,
  type CategoryId,
  type Expense,
  categoryById,
  currentMonthKey,
  daysInView,
  emptySubscribe,
  expensesToCsv,
  formatMoney,
  formatMonth,
  formatPrettyDate,
  parseAmountToCents,
  readExpenseServerSnapshot,
  readExpenseSnapshot,
  shiftMonth,
  subscribeExpenses,
  todayISO,
  writeStoredExpenses,
} from "@/app/lib/expenses";

type Draft = {
  amount: string;
  category: CategoryId;
  note: string;
  date: string;
};

const emptyDraft: Draft = {
  amount: "",
  category: "food",
  note: "",
  date: "",
};

export function ExpenseApp() {
  const expenses = useSyncExternalStore(
    subscribeExpenses,
    readExpenseSnapshot,
    readExpenseServerSnapshot,
  );
  const clientMonth = useSyncExternalStore(emptySubscribe, currentMonthKey, () => "");
  const today = useSyncExternalStore(emptySubscribe, todayISO, () => "");
  const [monthOverride, setMonthOverride] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | "all">("all");
  const [confirmClear, setConfirmClear] = useState(false);
  const month = monthOverride ?? clientMonth;
  const draftDate = draft.date || today;
  const ready = month !== "";

  function updateExpenses(next: Expense[]) {
    writeStoredExpenses(next);
  }

  function addExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = parseAmountToCents(draft.amount);
    if (amount === null) {
      setError("Enter an amount greater than zero, up to two decimals.");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(draftDate)) {
      setError("Choose a date.");
      return;
    }

    const expense: Expense = {
      id: crypto.randomUUID(),
      amount,
      category: draft.category,
      note: draft.note.trim(),
      date: draftDate,
      createdAt: Date.now(),
    };

    updateExpenses([expense, ...expenses]);
    setMonthOverride(draftDate.slice(0, 7));
    setDraft((current) => ({ ...current, amount: "", note: "", date: "" }));
    setError("");
    setConfirmClear(false);
  }

  function removeExpense(id: string) {
    updateExpenses(expenses.filter((expense) => expense.id !== id));
  }

  function removeSamples() {
    updateExpenses(expenses.filter((expense) => !expense.sample));
  }

  function clearLedger() {
    updateExpenses([]);
    setConfirmClear(false);
  }

  function downloadCsv() {
    const csv = expensesToCsv(expenses);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "modern-expense-tracker.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  const monthExpenses = useMemo(
    () =>
      expenses
        .filter((expense) => month && expense.date.startsWith(month))
        .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt),
    [expenses, month],
  );

  const visibleExpenses = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return monthExpenses.filter((expense) => {
      if (categoryFilter !== "all" && expense.category !== categoryFilter) return false;
      if (!needle) return true;
      const label = categoryById(expense.category).label.toLowerCase();
      return expense.note.toLowerCase().includes(needle) || label.includes(needle);
    });
  }, [monthExpenses, query, categoryFilter]);

  const spent = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const viewingCurrentMonth = month !== "" && month === clientMonth;
  const average = month ? Math.round(spent / daysInView(month)) : 0;
  const hasSamples = expenses.some((expense) => expense.sample);

  const breakdown = CATEGORIES.map((category) => {
    const total = monthExpenses
      .filter((expense) => expense.category === category.id)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return { ...category, total };
  })
    .filter((category) => category.total > 0)
    .sort((a, b) => b.total - a.total);

  const top = breakdown[0];
  const latest = monthExpenses.slice(0, 4);

  return (
    <div className="relative min-h-full">
      <a
        href="#ledger"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-card"
      >
        Skip to ledger
      </a>

      <header className="sticky top-0 z-30 border-b border-line/80 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
          <a href="#top" className="flex min-w-0 items-center gap-3">
            <Mark />
            <span className="truncate text-sm font-semibold tracking-tight">Modern Expense Tracker</span>
          </a>
          <nav aria-label="Page" className="hidden items-center gap-7 text-sm text-muted md:flex">
            <a className="transition-colors hover:text-foreground" href="#ledger">
              Ledger
            </a>
            <a className="transition-colors hover:text-foreground" href="#insights">
              Insights
            </a>
            <a className="transition-colors hover:text-foreground" href="#privacy">
              Privacy
            </a>
          </nav>
          <a
            href="#ledger"
            className="shrink-0 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-card transition-colors hover:bg-accent-deep"
          >
            Open ledger
          </a>
        </div>
      </header>

      <main id="top">
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-6 pt-14 md:grid-cols-[1.1fr_0.9fr] md:pt-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1 text-xs font-medium tracking-[0.14em] text-accent-deep uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Personal web client
            </p>
            <h1 className="mt-6 max-w-xl font-serif text-5xl leading-[0.98] tracking-tight text-balance text-foreground sm:text-6xl">
              A calmer ledger for{" "}
              <em className="font-serif text-accent-deep italic">everyday spending.</em>
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-pretty text-muted">
              Modern Expense Tracker keeps a personal record of what you spend. Totals, categories,
              and history stay in this browser. Nothing is uploaded.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#ledger"
                className="inline-flex h-12 items-center rounded-full bg-accent px-5 text-sm font-semibold text-white shadow-[0_10px_30px_-16px_rgba(14,107,82,0.9)] transition-colors hover:bg-accent-deep"
              >
                Start tracking
              </a>
              <a
                href="#privacy"
                className="inline-flex h-12 items-center rounded-full border border-line bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:border-foreground/20"
              >
                How privacy works
              </a>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-6">
              <div>
                <dt className="text-xs tracking-[0.14em] text-muted uppercase">Account</dt>
                <dd className="mt-1 font-medium">None</dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.14em] text-muted uppercase">Storage</dt>
                <dd className="mt-1 font-medium">This browser</dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.14em] text-muted uppercase">Upload</dt>
                <dd className="mt-1 font-medium">Never</dd>
              </div>
            </dl>
          </div>

          <SummaryCard
            ready={ready}
            month={month}
            spent={spent}
            count={monthExpenses.length}
            latest={latest}
            breakdown={breakdown}
          />
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-5 py-10 sm:grid-cols-3">
          <Feature
            index="01"
            title="Monthly totals"
            body="Spent, entry count, and a daily average update the moment you add a line."
          />
          <Feature
            index="02"
            title="Categories you can scan"
            body="Food, transport, home, and the rest stay color-coded so a month is readable at a glance."
          />
          <Feature
            index="03"
            title="Private by default"
            body="The ledger never leaves this device. Export a CSV when you want a copy of your own."
          />
        </section>

        <section id="ledger" className="scroll-mt-20 mx-auto max-w-6xl px-5 py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs tracking-[0.18em] text-muted uppercase">The ledger</p>
              <h2 className="mt-2 font-serif text-4xl tracking-tight text-balance">This month, in one view.</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full border border-line bg-card text-lg transition-colors hover:border-foreground/20"
                aria-label="Previous month"
                disabled={!month}
                onClick={() => setMonthOverride(shiftMonth(month, -1))}
              >
                ‹
              </button>
              <p className="min-w-36 text-center text-sm font-semibold">{month ? formatMonth(month) : "Loading"}</p>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full border border-line bg-card text-lg transition-colors hover:border-foreground/20"
                aria-label="Next month"
                disabled={!month}
                onClick={() => setMonthOverride(shiftMonth(month, 1))}
              >
                ›
              </button>
              {month && month !== clientMonth ? (
                <button
                  type="button"
                  className="h-10 rounded-full px-3 text-sm font-medium text-accent-deep underline-offset-4 hover:underline"
                  onClick={() => setMonthOverride(null)}
                >
                  This month
                </button>
              ) : null}
            </div>
          </div>

          {hasSamples ? (
            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-line bg-card/80 px-4 py-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
              <p>Sample entries are filled in so the month has shape. They live only in this browser.</p>
              <button
                type="button"
                className="h-9 shrink-0 rounded-full border border-line bg-background px-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/20"
                onClick={removeSamples}
              >
                Remove samples
              </button>
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Stat label="Spent" value={ready && month ? formatMoney(spent) : "—"} hint={month ? formatMonth(month) : "This month"} />
            <Stat label="Entries" value={ready && month ? String(monthExpenses.length) : "—"} hint="Logged this month" />
            <Stat
              label="Daily average"
              value={ready && month ? formatMoney(average) : "—"}
              hint={viewingCurrentMonth ? "Across days so far" : "Across the month"}
            />
          </div>

          <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
            <form
              onSubmit={addExpense}
              className="rounded-[28px] border border-line bg-card p-5 shadow-[0_24px_60px_-40px_rgba(48,36,16,0.45)] sm:p-6"
            >
              <h3 className="font-serif text-2xl">Add an expense</h3>
              <p className="mt-1 text-sm text-muted">Saved on this device as soon as you add it.</p>

              <label className="mt-5 block text-sm font-medium" htmlFor="amount">
                Amount
              </label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted">$</span>
                <input
                  id="amount"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="0.00"
                  value={draft.amount}
                  onChange={(event) => {
                    setDraft((current) => ({ ...current, amount: event.target.value }));
                    setError("");
                  }}
                  className="h-12 w-full rounded-2xl border border-line bg-background pr-4 pl-8 text-lg tabular-nums outline-none transition-colors focus:border-accent"
                />
              </div>

              <label className="mt-4 block text-sm font-medium" htmlFor="spent-on">
                Date
              </label>
              <input
                id="spent-on"
                type="date"
                required
                value={draftDate}
                onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))}
                className="mt-2 h-12 w-full rounded-2xl border border-line bg-background px-4 outline-none transition-colors focus:border-accent"
              />

              <fieldset className="mt-4">
                <legend className="text-sm font-medium">Category</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => {
                    const selected = draft.category === category.id;
                    return (
                      <button
                        key={category.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setDraft((current) => ({ ...current, category: category.id }))}
                        className={`inline-flex h-9 items-center gap-2 rounded-full border px-3 text-sm transition-colors ${
                          selected
                            ? "border-foreground bg-foreground text-card"
                            : "border-line bg-background text-foreground hover:border-foreground/20"
                        }`}
                      >
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: category.swatch }} />
                        {category.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <label className="mt-4 block text-sm font-medium" htmlFor="note">
                Note
              </label>
              <input
                id="note"
                maxLength={80}
                placeholder="Coffee, groceries, rent"
                value={draft.note}
                onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))}
                className="mt-2 h-12 w-full rounded-2xl border border-line bg-background px-4 outline-none transition-colors focus:border-accent"
              />

              {error ? (
                <p role="alert" className="mt-3 text-sm text-clay">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                className="mt-5 h-12 w-full rounded-full bg-accent text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
              >
                Add expense
              </button>
            </form>

            <div className="rounded-[28px] border border-line bg-card p-5 shadow-[0_24px_60px_-40px_rgba(48,36,16,0.45)] sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-serif text-2xl">Activity</h3>
                  <p className="mt-1 text-sm text-muted">
                    {ready
                      ? `${visibleExpenses.length} of ${monthExpenses.length} this month`
                      : "Opening your ledger"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={downloadCsv}
                  disabled={expenses.length === 0}
                  className="h-10 rounded-full border border-line px-3 text-sm font-medium transition-colors hover:border-foreground/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Download CSV
                </button>
              </div>

              <label className="sr-only" htmlFor="search">
                Search expenses
              </label>
              <input
                id="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search notes or categories"
                className="mt-4 h-11 w-full rounded-2xl border border-line bg-background px-4 text-sm outline-none transition-colors focus:border-accent"
              />

              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                <FilterChip
                  label="All"
                  selected={categoryFilter === "all"}
                  onClick={() => setCategoryFilter("all")}
                />
                {CATEGORIES.map((category) => (
                  <FilterChip
                    key={category.id}
                    label={category.label}
                    swatch={category.swatch}
                    selected={categoryFilter === category.id}
                    onClick={() => setCategoryFilter(category.id)}
                  />
                ))}
              </div>

              <ul className="mt-2 max-h-[520px] overflow-auto pr-1">
                {!ready ? (
                  <li className="py-10 text-sm text-muted">Loading entries saved in this browser…</li>
                ) : visibleExpenses.length === 0 ? (
                  <li className="px-1 py-12 text-center">
                    <p className="font-serif text-2xl">A quiet month.</p>
                    <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted">
                      {monthExpenses.length === 0
                        ? "Nothing is logged here yet. Add the first expense and the total will follow."
                        : "Nothing matches this search. Try another note or category."}
                    </p>
                  </li>
                ) : (
                  visibleExpenses.map((expense, index) => {
                    const previous = visibleExpenses[index - 1];
                    const showDate = !previous || previous.date !== expense.date;
                    const category = categoryById(expense.category);
                    return (
                      <li key={expense.id}>
                        {showDate ? (
                          <p className="sticky top-0 bg-card pt-3 pb-1 text-xs tracking-[0.14em] text-muted uppercase">
                            {formatPrettyDate(expense.date)}
                          </p>
                        ) : null}
                        <div className="flex items-center gap-3 border-b border-line/80 py-3">
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: category.swatch }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">{expense.note || category.label}</p>
                            <p className="text-sm text-muted">{category.label}</p>
                          </div>
                          <p className="shrink-0 font-medium tabular-nums">{formatMoney(expense.amount)}</p>
                          <button
                            type="button"
                            aria-label={`Delete ${expense.note || category.label}`}
                            onClick={() => removeExpense(expense.id)}
                            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-background hover:text-clay"
                          >
                            <span aria-hidden="true">×</span>
                          </button>
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>

              <div className="mt-4 flex justify-end">
                {confirmClear ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmClear(false)}
                      className="h-9 rounded-full px-3 text-sm text-muted hover:text-foreground"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={clearLedger}
                      className="h-9 rounded-full bg-clay px-3 text-sm font-medium text-white"
                    >
                      Confirm clear
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    disabled={expenses.length === 0}
                    className="h-9 rounded-full px-3 text-sm text-muted transition-colors hover:text-clay disabled:opacity-40"
                  >
                    Clear ledger
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="insights" className="scroll-mt-20 mx-auto max-w-6xl px-5 py-14">
          <p className="text-xs tracking-[0.18em] text-muted uppercase">Insights</p>
          <h2 className="mt-2 max-w-xl font-serif text-4xl tracking-tight text-balance">
            Where the month actually went.
          </h2>
          <div className="mt-8 grid gap-6 rounded-[28px] border border-line bg-card p-5 sm:p-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm text-muted">Largest category</p>
              <p className="mt-2 font-serif text-4xl tracking-tight">{top ? top.label : "—"}</p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
                {top
                  ? `${formatMoney(top.total)} of ${formatMoney(spent)} landed in ${top.label.toLowerCase()}.`
                  : "Add a few expenses and the split of the month will appear here."}
              </p>
            </div>
            <ul className="space-y-4">
              {breakdown.length === 0 ? (
                <li className="text-sm text-muted">No categories yet this month.</li>
              ) : (
                breakdown.map((category) => {
                  const width = spent === 0 ? 0 : Math.max(6, Math.round((category.total / spent) * 100));
                  return (
                    <li key={category.id}>
                      <div className="mb-1.5 flex items-baseline justify-between gap-4 text-sm">
                        <span className="inline-flex items-center gap-2 font-medium">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: category.swatch }} />
                          {category.label}
                        </span>
                        <span className="tabular-nums text-muted">{formatMoney(category.total)}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-background">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${width}%`, backgroundColor: category.swatch }}
                        />
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </section>

        <section id="privacy" className="scroll-mt-20 mx-auto max-w-6xl px-5 py-8 pb-20">
          <div className="overflow-hidden rounded-[32px] bg-foreground px-6 py-10 text-card sm:px-10 sm:py-12">
            <p className="text-xs tracking-[0.18em] text-white/60 uppercase">Privacy</p>
            <h2 className="mt-3 max-w-xl font-serif text-4xl tracking-tight text-balance">
              Nothing leaves this browser.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
              This is a web client with no account and no database. Entries are written to local
              storage on your device so a refresh keeps the ledger. Clear the ledger, or clear this
              site&apos;s data, and they are gone.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <PrivacyPoint title="No sign-in" body="Open the page and start. There is no profile to create." />
              <PrivacyPoint title="No server copy" body="Adding an expense does not call an API or write to a database." />
              <PrivacyPoint title="Yours to export" body="Download a CSV anytime. Hosting the site does not hold your spending." />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-center gap-2 font-medium text-foreground">
            <Mark />
            Modern Expense Tracker
          </p>
          <p>A private personal ledger for the browser.</p>
        </div>
      </footer>
    </div>
  );
}

function SummaryCard({
  ready,
  month,
  spent,
  count,
  latest,
  breakdown,
}: {
  ready: boolean;
  month: string;
  spent: number;
  count: number;
  latest: Expense[];
  breakdown: Array<{ id: string; label: string; swatch: string; total: number }>;
}) {
  return (
    <div className="relative">
      <div className="absolute inset-x-5 top-5 h-full rounded-[32px] bg-accent/20" />
      <article className="relative rounded-[32px] border border-line bg-card p-6 shadow-[0_30px_80px_-42px_rgba(40,30,10,0.55)] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.16em] text-muted uppercase">
              {month ? formatMonth(month) : "This month"}
            </p>
            <p className="mt-2 font-serif text-5xl tracking-tight tabular-nums">
              {ready && month ? formatMoney(spent) : "—"}
            </p>
          </div>
          <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent-deep">
            {ready ? `${count} ${count === 1 ? "entry" : "entries"}` : "On device"}
          </span>
        </div>

        <ul className="mt-7 space-y-3">
          {latest.length === 0 ? (
            <li className="rounded-2xl bg-background px-4 py-5 text-sm text-muted">
              Your latest expenses will line up here.
            </li>
          ) : (
            latest.map((expense) => {
              const category = categoryById(expense.category);
              return (
                <li key={expense.id} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: category.swatch }} />
                  <span className="min-w-0 flex-1 truncate text-sm">{expense.note || category.label}</span>
                  <span className="text-sm tabular-nums text-muted">{formatMoney(expense.amount)}</span>
                </li>
              );
            })
          )}
        </ul>

        <div className="mt-7 flex h-2 overflow-hidden rounded-full bg-background">
          {breakdown.length === 0 ? <div className="h-full w-full bg-line" /> : null}
          {breakdown.map((category) => (
            <div
              key={category.id}
              style={{
                width: `${(category.total / Math.max(spent, 1)) * 100}%`,
                backgroundColor: category.swatch,
              }}
            />
          ))}
        </div>
      </article>
    </div>
  );
}

function Feature({ index, title, body }: { index: string; title: string; body: string }) {
  return (
    <article className="rounded-[24px] border border-line bg-card/70 p-5">
      <p className="font-mono text-xs text-gold">{index}</p>
      <h2 className="mt-3 text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </article>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <article className="rounded-[24px] border border-line bg-card px-5 py-4">
      <p className="text-xs tracking-[0.14em] text-muted uppercase">{label}</p>
      <p className="mt-2 font-serif text-3xl tracking-tight tabular-nums">{value}</p>
      <p className="mt-1 text-sm text-muted">{hint}</p>
    </article>
  );
}

function FilterChip({
  label,
  selected,
  onClick,
  swatch,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  swatch?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex h-8 shrink-0 items-center gap-2 rounded-full border px-3 text-xs font-medium transition-colors ${
        selected ? "border-foreground bg-foreground text-card" : "border-line bg-background text-foreground"
      }`}
    >
      {swatch ? <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: swatch }} /> : null}
      {label}
    </button>
  );
}

function PrivacyPoint({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="font-medium">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/65">{body}</p>
    </div>
  );
}

function Mark() {
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-white">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M3 4.5h12M3 9h8.5M3 13.5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}
