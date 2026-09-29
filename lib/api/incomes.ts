import { apiRequest } from "@/lib/api/client";

export type IncomeAccountOption = {
  id: number;
  label: string;
  type: string;
};

export type Income = {
  id: number;
  date: string;
  amount: number;
  account: string;
  account_is_historical: boolean;
  for_whom: string;
  note: string | null;
  can_delete: boolean;
};

export type IncomeFormPayload = {
  date: string;
  amount: number;
  account_id: number;
  for_whom: string;
  note?: string | null;
};

export type IncomesListResponse = {
  data: Income[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
};

export async function fetchIncomes(page = 1): Promise<IncomesListResponse> {
  return apiRequest(`/incomes?page=${page}`);
}

export async function fetchIncomeCreateOptions() {
  return apiRequest<{
    accounts: IncomeAccountOption[];
    for_whom_options: string[];
  }>("/incomes/create");
}

export async function createIncome(payload: IncomeFormPayload) {
  return apiRequest<{ income: Income; message: string }>("/incomes", {
    method: "POST",
    body: payload,
  });
}

export async function deleteIncome(id: number) {
  return apiRequest<{ message: string }>(`/incomes/${id}`, {
    method: "DELETE",
  });
}
