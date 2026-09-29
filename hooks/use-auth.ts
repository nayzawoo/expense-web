"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchMe, login, logout } from "@/lib/api/auth";
import { getStoredToken } from "@/lib/api/client";

export const meQueryKey = ["auth", "me"] as const;

export function useMe(enabled = true) {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: fetchMe,
    enabled: enabled && Boolean(getStoredToken()),
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
