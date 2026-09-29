import { apiRequest } from "@/lib/api/client";

export type AccountType = "bank" | "wallet" | "cash";

export type Account = {
  id: number;
  name: string;
  type: AccountType;
  owner_name: string;
  opening_balance: number;
  balance_started_at: string | null;
  current_balance?: number;
  is_active: boolean;
  sort_order: number;
};

export type AccountFormPayload = {
  name: string;
  type: AccountType;
  owner_name: string;
  opening_balance: number;
  balance_started_at: string;
  is_active?: boolean;
  sort_order?: number | null;
};

export type AccountsIndexResponse = {
  accounts: Account[];
  total_balance: number;
  types: AccountType[];
};

export async function fetchAccounts(): Promise<AccountsIndexResponse> {
  return apiRequest("/accounts");
}

export async function fetchAccount(id: number): Promise<{
  account: Account;
  types: AccountType[];
}> {
  return apiRequest(`/accounts/${id}`);
}

export async function createAccount(payload: AccountFormPayload) {
  return apiRequest<{ account: Account; message: string }>("/accounts", {
    method: "POST",
    body: payload,
  });
}

export async function updateAccount(id: number, payload: AccountFormPayload) {
  return apiRequest<{ account: Account; message: string }>(`/accounts/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function toggleAccountActive(id: number) {
  return apiRequest<{ account: Account; message: string }>(
    `/accounts/${id}/toggle-active`,
    { method: "PATCH" },
  );
}
