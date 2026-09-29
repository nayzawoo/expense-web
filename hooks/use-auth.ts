"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchMe, login, logout } from "@/lib/api/auth";
import type { MeResponse } from "@/lib/api/client";
import { useClientToken } from "@/hooks/use-client-token";
import { queryKeys } from "@/lib/query-keys";

export const meQueryKey = queryKeys.auth.me;

export function useMe(enabled = true) {
  const { token, ready } = useClientToken();

  return useQuery<MeResponse>({
    queryKey: meQueryKey,
    queryFn: fetchMe,
    enabled: enabled && ready && Boolean(token),
  });
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(meQueryKey, { user: data.user });
      router.replace("/dashboard");
      router.refresh();
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
      router.replace("/login");
      router.refresh();
    },
  });
}
