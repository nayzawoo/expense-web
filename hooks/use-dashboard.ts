"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "@/lib/api/dashboard";
import { getStoredToken } from "@/lib/api/client";

export const dashboardQueryKey = ["dashboard"] as const;

export function useDashboard() {
  return useQuery({
    queryKey: dashboardQueryKey,
    queryFn: fetchDashboard,
    enabled: Boolean(getStoredToken()),
  });
}
