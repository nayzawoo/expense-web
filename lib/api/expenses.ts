import { apiRequest } from "@/lib/api/client";

export type ExpenseCategoryOption = {
  id: number;
  name: string;
  color: string;
  icon: string;
};

export type ExpenseAccountOption = {
  id: number;
  name?: string;
  label: string;
  type?: string;
  is_active?: boolean;
};

export type Expense = {
  id: number;
  date: string;
  amount: number;
  account: string;
  account_name: string | null;
  account_type: string | null;
  account_is_historical: boolean;
  category: string | null;
  category_color: string | null;
  category_icon: string;
  for_whom: string;
  note: string | null;
  can_update: boolean;
  can_delete: boolean;
};

export type ExpenseFilters = {
  search: string | null;
  date_preset: string;
  date_from: string | null;
  date_to: string | null;
  category_id: number | null;
  account_id: number | string | null;
  for_whom: string | null;
};

export type ExpenseFormPayload = {
  date: string;
  amount: number;
  account_id: number;
  category_id: number;
  for_whom: string;
  note?: string | null;
};

export type ExpensesListResponse = {
  data: Expense[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  summary: { count: number; total: number; label: string };
  daily_totals: Record<string, number>;
  filters: ExpenseFilters;
  options: {
    categories: ExpenseCategoryOption[];
    accounts: ExpenseAccountOption[];
    for_whom_options: string[];
    date_presets: Array<{ value: string; label: string }>;
  };
};

function toQuery(filters: Partial<ExpenseFilters> & { page?: number }): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.search) params.set("search", filters.search);
  if (filters.date_preset) params.set("date_preset", filters.date_preset);
  if (filters.date_from) params.set("date_from", filters.date_from);
  if (filters.date_to) params.set("date_to", filters.date_to);
  if (filters.category_id != null) {
    params.set("category_id", String(filters.category_id));
  }
  if (filters.account_id != null && filters.account_id !== "") {
    params.set("account_id", String(filters.account_id));
  }
  if (filters.for_whom) params.set("for_whom", filters.for_whom);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchExpenses(
  filters: Partial<ExpenseFilters> & { page?: number } = {},
): Promise<ExpensesListResponse> {
  return apiRequest(`/expenses${toQuery(filters)}`);
}

export async function fetchExpenseCreateOptions() {
  return apiRequest<{
    accounts: ExpenseAccountOption[];
    categories: ExpenseCategoryOption[];
    for_whom_options: string[];
    category_spending: Array<{ name: string; total: number; color: string }>;
  }>("/expenses/create");
}

export async function fetchExpense(id: number) {
  return apiRequest<{
    expense: {
      id: number;
      date: string;
      amount: number;
      account_id: number | null;
      category_id: number;
      for_whom: string;
      note: string | null;
    };
    accounts: ExpenseAccountOption[];
    categories: ExpenseCategoryOption[];
    for_whom_options: string[];
  }>(`/expenses/${id}`);
}

export async function createExpense(payload: ExpenseFormPayload) {
  return apiRequest<{ expense: Expense; message: string }>("/expenses", {
    method: "POST",
    body: payload,
  });
}

export async function updateExpense(id: number, payload: ExpenseFormPayload) {
  return apiRequest<{ expense: Expense; message: string }>(`/expenses/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteExpense(id: number) {
  return apiRequest<{ message: string }>(`/expenses/${id}`, {
    method: "DELETE",
  });
}
