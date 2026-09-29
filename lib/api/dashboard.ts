import { apiRequest } from "@/lib/api/client";

export type DashboardPayload = {
  month_label: string;
  balance: {
    total: number;
    accounts: Array<{
      id: number;
      name: string;
      owner_name: string | null;
      label: string;
      type: string;
      current_balance: number;
      is_active: boolean;
    }>;
  };
  monthOverview: {
    expense: number;
    income: number;
    net: number;
    previous_same_period_expense: number;
    difference_amount: number;
    difference_percent: number | null;
    direction: string;
    comparison_label: string;
  };
  spendingPace: unknown;
  categoryChanges: unknown[];
  topCategories: Array<{
    id?: number;
    name: string;
    amount: number;
    percent?: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    title?: string;
    subtitle?: string;
    note?: string | null;
    amount: number;
    date: string;
  }>;
  spendingByPerson: unknown;
};

export async function fetchDashboard(): Promise<DashboardPayload> {
  return apiRequest<DashboardPayload>("/dashboard");
}
