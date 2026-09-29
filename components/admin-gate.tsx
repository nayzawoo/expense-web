"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useMe } from "@/hooks/use-auth";
import { useClientToken } from "@/hooks/use-client-token";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminGate({ children }: { children: ReactNode }) {
  const { ready } = useClientToken();
  const me = useMe();
  const router = useRouter();
  const isAdmin = Boolean(me.data?.user?.is_admin);

  useEffect(() => {
    if (ready && me.isSuccess && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [ready, me.isSuccess, isAdmin, router]);

  if (!ready || me.isPending || me.isLoading) {
    return (
      <div className="p-4 md:p-6">
        <Skeleton className="h-10 w-48" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
