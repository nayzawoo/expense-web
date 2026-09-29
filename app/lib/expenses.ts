export const STORAGE_KEY = "modern-expense-tracker.v1";

export const CATEGORIES = [
  { id: "food", label: "Food", swatch: "#c45c3e" },
  { id: "transport", label: "Transport", swatch: "#3c6e8f" },
  { id: "home", label: "Home", swatch: "#0e6b52" },
  { id: "shopping", label: "Shopping", swatch: "#8b5a8f" },
  { id: "health", label: "Health", swatch: "#2a7d74" },
  { id: "leisure", label: "Leisure", swatch: "#c4893a" },
  { id: "other", label: "Other", swatch: "#6f675e" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type Expense = {
  id: string;
  amount: number;
  category: CategoryId;
  note: string;
  date: string;
  createdAt: number;
  sample?: boolean;
};

const categoryIds = new Set<string>(CATEGORIES.map((category) => category.id));

export function categoryById(id: CategoryId) {
  return CATEGORIES.find((category) => category.id === id) ?? CATEGORIES[6];
}

export function currentMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function todayISO(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function shiftMonth(monthKey: string, delta: number) {
  const [year, month] = monthKey.split("-").map(Number);
  const next = new Date(Date.UTC(year, (month ?? 1) - 1 + delta, 1));
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function formatMonth(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, (month ?? 1) - 1, 1)));
}

export function formatPrettyDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1)));
}

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatMoney(cents: number) {
  return money.format(cents / 100);
}

export function parseAmountToCents(value: string) {
  const cleaned = value.trim().replace(/[$,\s]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  const [dollars, fraction = ""] = cleaned.split(".");
  const cents = Number(dollars) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(cents) || cents <= 0 || cents > 10_000_000_00) {
    return null;
  }
  return cents;
}

export function isExpense(value: unknown): value is Expense {
  if (!value || typeof value !== "object") return false;
  const expense = value as Partial<Expense>;
  return (
    typeof expense.id === "string" &&
    typeof expense.amount === "number" &&
    Number.isInteger(expense.amount) &&
    expense.amount > 0 &&
    typeof expense.category === "string" &&
    categoryIds.has(expense.category) &&
    typeof expense.note === "string" &&
    typeof expense.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(expense.date) &&
    typeof expense.createdAt === "number"
  );
}

export function seedExpenses(now = new Date()): Expense[] {
  const month = currentMonthKey(now);
  const today = now.getDate();
  const day = (offset: number) => {
    const date = Math.max(1, today - offset);
    return `${month}-${String(date).padStart(2, "0")}`;
  };

  const samples: Array<Omit<Expense, "sample" | "createdAt"> & { offset: number }> = [
    { id: "sample-bakery", amount: 640, category: "food", note: "Corner bakery", date: day(0), offset: 0 },
    { id: "sample-metro", amount: 2400, category: "transport", note: "Metro card", date: day(1), offset: 1 },
    { id: "sample-groceries", amount: 6815, category: "food", note: "Weekday groceries", date: day(2), offset: 2 },
    { id: "sample-pharmacy", amount: 1890, category: "health", note: "Pharmacy", date: day(4), offset: 4 },
    { id: "sample-dinner", amount: 4250, category: "food", note: "Dinner with friends", date: day(6), offset: 6 },
    { id: "sample-home", amount: 3600, category: "home", note: "Household supplies", date: day(8), offset: 8 },
    { id: "sample-book", amount: 2200, category: "shopping", note: "Bookshop", date: day(11), offset: 11 },
    { id: "sample-cinema", amount: 1600, category: "leisure", note: "Cinema tickets", date: day(14), offset: 14 },
  ];

  return samples.map((sample) => ({
    id: sample.id,
    amount: sample.amount,
    category: sample.category,
    note: sample.note,
    date: sample.date,
    createdAt: now.getTime() - sample.offset * 86_400_000,
    sample: true,
  }));
}

const EMPTY_EXPENSES: Expense[] = [];

const listeners = new Set<() => void>();

let cachedRaw: string | null | undefined;
let cachedExpenses: Expense[] = EMPTY_EXPENSES;
let seedCache: Expense[] | null = null;
let memoryExpenses: Expense[] | null = null;

function emitExpenses() {
  listeners.forEach((listener) => listener());
}

function getSeed() {
  seedCache ??= seedExpenses();
  return seedCache;
}

function parseStored(raw: string) {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY_EXPENSES;
    return parsed.filter(isExpense);
  } catch {
    return EMPTY_EXPENSES;
  }
}

export function subscribeExpenses(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function readExpenseSnapshot() {
  if (memoryExpenses) return memoryExpenses;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      if (cachedRaw === null) return cachedExpenses;
      cachedRaw = null;
      cachedExpenses = getSeed();
      return cachedExpenses;
    }
    if (cachedRaw === raw) return cachedExpenses;
    cachedRaw = raw;
    cachedExpenses = parseStored(raw);
    return cachedExpenses;
  } catch {
    return getSeed();
  }
}

export function readExpenseServerSnapshot() {
  return EMPTY_EXPENSES;
}

export function writeStoredExpenses(expenses: Expense[]) {
  memoryExpenses = expenses;
  try {
    const raw = JSON.stringify(expenses);
    localStorage.setItem(STORAGE_KEY, raw);
    cachedRaw = raw;
    cachedExpenses = expenses;
    memoryExpenses = null;
  } catch {
    cachedExpenses = expenses;
  }
  emitExpenses();
}

export function emptySubscribe() {
  return () => {};
}

export function expensesToCsv(expenses: Expense[]) {
  const rows = [...expenses].sort((a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt);
  const lines = [
    "date,category,note,amount",
    ...rows.map((expense) => {
      const note = `"${expense.note.replaceAll('"', '""')}"`;
      const amount = (expense.amount / 100).toFixed(2);
      return `${expense.date},${categoryById(expense.category).label},${note},${amount}`;
    }),
  ];
  return lines.join("\n");
}

export function daysInView(monthKey: string, today = new Date()) {
  const [year, month] = monthKey.split("-").map(Number);
  const length = new Date(Date.UTC(year, month ?? 1, 0)).getUTCDate();
  if (monthKey === currentMonthKey(today)) return Math.max(1, today.getDate());
  if (monthKey > currentMonthKey(today)) return 1;
  return length;
}
