import { apiRequest } from "@/lib/api/client";

export type Direction = "up" | "down" | "flat";

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
    has_more?: boolean;
  };
  monthOverview: {
    expense: number;
    income: number;
    net: number;
    previous_same_period_expense: number;
    difference_amount: number;
    difference_percent: number | null;
    direction: Direction;
    comparison_label: string;
  };
  spendingPace: Array<{ day: number; current: number; previous: number }>;
  categoryChanges: {
    increased: Array<{
      id: number;
      name: string;
      color: string;
      icon: string;
      difference_amount: number;
      is_new?: boolean;
    }>;
    decreased: Array<{
      id: number;
      name: string;
      color: string;
      icon: string;
      difference_amount: number;
      is_new?: boolean;
    }>;
  };
  topCategories: Array<{
    id: number | null;
    name: string;
    color: string;
    icon: string;
    amount: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: "expense" | "income" | "transfer" | string;
    title?: string;
    subtitle?: string;
    note?: string | null;
    amount: number;
    date: string;
    color?: string | null;
    icon?: string;
  }>;
  spendingByPerson: Array<{
    person_name: string;
    total: number;
  }>;
};

export async function fetchDashboard(): Promise<DashboardPayload> {
  return apiRequest<DashboardPayload>("/dashboard");
}
