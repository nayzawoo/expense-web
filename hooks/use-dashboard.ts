"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "@/lib/api/dashboard";
import { useClientToken } from "@/hooks/use-client-token";
import { queryKeys } from "@/lib/query-keys";

export const dashboardQueryKey = queryKeys.dashboard.all;

export function useDashboard() {
  const { token, ready } = useClientToken();

  return useQuery({
    queryKey: dashboardQueryKey,
    queryFn: fetchDashboard,
    enabled: ready && Boolean(token),
  });
}
