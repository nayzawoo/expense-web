"use client";

import { useState, type FormEvent } from "react";

type Entry = {
  id: string;
  amount: string;
  note: string;
  category: string;
};

const categories = ["Food", "Transit", "Home", "Fun"] as const;

export function TrackerPreview() {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("Food");
  const [entries, setEntries] = useState<Entry[]>([]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!amount.trim()) {
      return;
    }

    setEntries((current) => [
      {
        id: crypto.randomUUID(),
        amount: amount.trim(),
        note: note.trim() || "Untitled",
        category,
      },
      ...current,
    ]);
    setAmount("");
    setNote("");
  }

  return (
    <div className="overflow-hidden rounded-[1rem] border border-line bg-foam shadow-[var(--shadow-soft)]">
      <form
        onSubmit={onSubmit}
        className="grid gap-4 border-b border-line p-5 sm:grid-cols-[1fr_1.4fr_auto_auto] sm:items-end sm:p-6"
      >
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-ink-soft">Amount</span>
          <input
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="12.50"
            className="w-full rounded-[var(--radius-control)] border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-[border-color,box-shadow] focus:border-teal focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--teal)_20%,transparent)]"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-ink-soft">Note</span>
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Coffee with Maya"
            className="w-full rounded-[var(--radius-control)] border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-[border-color,box-shadow] focus:border-teal focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--teal)_20%,transparent)]"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-ink-soft">Category</span>
          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as (typeof categories)[number])
            }
            className="w-full rounded-[var(--radius-control)] border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-[border-color,box-shadow] focus:border-teal focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--teal)_20%,transparent)]"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-[var(--radius-control)] bg-teal px-4 py-2.5 text-sm font-semibold text-foam transition-colors hover:bg-teal-deep"
        >
          Add
        </button>
      </form>

      <div className="min-h-[180px] p-5 sm:p-6">
        {entries.length === 0 ? (
          <p className="text-sm leading-6 text-ink-soft">
            No entries yet. Add one to see it appear here for this session.
          </p>
        ) : (
          <ul className="space-y-3">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex items-baseline justify-between gap-4 border-b border-line pb-3 last:border-b-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-ink">{entry.note}</p>
                  <p className="mt-0.5 text-xs uppercase tracking-[0.14em] text-ink-soft">
                    {entry.category}
                  </p>
                </div>
                <p className="font-display text-lg font-semibold tabular-nums text-teal-deep">
                  ${entry.amount}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
