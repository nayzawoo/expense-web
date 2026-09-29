import { apiRequest } from "@/lib/api/client";

export type TransferAccountOption = {
  id: number;
  name: string;
  label: string;
  type: string;
  current_balance: number;
};

export type Transfer = {
  id: number;
  date: string;
  amount: number;
  from_account: string;
  to_account: string;
  from_account_id: number;
  to_account_id: number;
  note: string | null;
  recorded_by: string | null;
  can_delete: boolean;
};

export type TransferFormPayload = {
  date: string;
  from_account_id: number;
  to_account_id: number;
  amount: number;
  note?: string | null;
};

export type TransfersListResponse = {
  data: Transfer[];
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

export async function fetchTransfers(
  page = 1,
): Promise<TransfersListResponse> {
  return apiRequest(`/transfers?page=${page}`);
}

export async function fetchTransferCreateOptions(): Promise<{
  accounts: TransferAccountOption[];
}> {
  return apiRequest("/transfers/create");
}

export async function createTransfer(payload: TransferFormPayload) {
  return apiRequest<{ transfer: Transfer; message: string }>("/transfers", {
    method: "POST",
    body: payload,
  });
}

export async function deleteTransfer(id: number) {
  return apiRequest<{ message: string }>(`/transfers/${id}`, {
    method: "DELETE",
  });
}
