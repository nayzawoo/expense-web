"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useClientToken } from "@/hooks/use-client-token";
import { clearStoredToken } from "@/lib/api/client";

/**
 * Client-side gate for protected app routes.
 *
 * proxy.ts only checks the expense_authenticated cookie hint. On iOS Home
 * Screen PWAs that cookie can exist without localStorage expense_token, which
 * leaves TanStack Query disabled and pages stuck on skeletons. This guard
 * clears the stale hint and sends the user to login when no Bearer token exists.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { token, ready } = useClientToken();
  const router = useRouter();
  const isAuthenticated = ready && Boolean(token);

  useEffect(() => {
    if (!ready || token) {
      return;
    }

    clearStoredToken();
    router.replace("/login");
  }, [ready, token, router]);

  if (!ready || !isAuthenticated) {
    return (
      <div className="flex min-h-svh flex-1 items-center justify-center p-6">
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
