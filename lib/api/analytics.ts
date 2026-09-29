import { apiRequest } from "@/lib/api/client";

export type Direction = "up" | "down" | "flat";

export type AnalyticsOverview = {
  current_month_expense: number;
  previous_same_period_expense: number;
  difference_amount: number;
  difference_percent: number | null;
  direction: Direction;
  monthly_average: number;
  daily_average: number;
  current_month_income: number;
  current_month_net: number;
  comparison_label: string;
  average_label: string;
};

export type MonthlyTrendPoint = {
  month_key: string;
  label: string;
  short_label: string;
  total: number;
  is_current: boolean;
};

export type CategoryChange = {
  id: number;
  name: string;
  color: string;
  icon: string;
  current_amount: number;
  previous_amount: number;
  difference_amount: number;
  difference_percent: number | null;
  direction: Direction;
  is_new: boolean;
};

export type CategoryBreakdownItem = {
  id: number | null;
  name: string;
  color: string;
  icon: string;
  amount: number;
  percentage: number;
};

export type AnalyticsResponse = {
  month_label: string;
  overview: AnalyticsOverview;
  monthlyTrend: MonthlyTrendPoint[];
  categoryChanges: {
    increased: CategoryChange[];
    decreased: CategoryChange[];
  };
  categoryBreakdown: CategoryBreakdownItem[];
  insight: {
    message: string;
  };
};

export async function fetchAnalytics(): Promise<AnalyticsResponse> {
  return apiRequest("/analytics");
}
