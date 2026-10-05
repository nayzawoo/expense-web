import { apiRequest } from "@/lib/api/client";

export type AccountAdjustment = {
  id: number;
  account_id: number;
  account: string | null;
  date: string;
  balance_before: number;
  actual_balance: number;
  amount: number;
  note: string | null;
  recorded_by: string | null;
};

export type AdjustmentsListResponse = {
  data: AccountAdjustment[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type ReconcileAccountPayload = {
  actual_balance: number;
  note?: string | null;
};

export async function fetchAdjustments(
  page = 1,
): Promise<AdjustmentsListResponse> {
  return apiRequest(`/adjustments?page=${page}`);
}

export async function reconcileAccount(
  accountId: number,
  payload: ReconcileAccountPayload,
) {
  return apiRequest<{ adjustment: AccountAdjustment; message: string }>(
    `/accounts/${accountId}/reconcile`,
    {
      method: "POST",
      body: payload,
    },
  );
}

export async function deleteAdjustment(id: number) {
  return apiRequest<{ message: string }>(`/adjustments/${id}`, {
    method: "DELETE",
  });
}
