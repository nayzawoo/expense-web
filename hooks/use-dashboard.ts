"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "@/lib/api/dashboard";
import { useClientToken } from "@/hooks/use-client-token";

export const dashboardQueryKey = ["dashboard"] as const;

export function useDashboard() {
  const { token, ready } = useClientToken();

  return useQuery({
    queryKey: dashboardQueryKey,
    queryFn: fetchDashboard,
    enabled: ready && Boolean(token),
  });
}
