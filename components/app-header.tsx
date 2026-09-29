"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLogout, useMe } from "@/hooks/use-auth";

export function AppHeader() {
  const { data } = useMe();
  const logout = useLogout();

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-semibold tracking-tight">
            Expense
          </Link>
          <span className="text-sm text-muted-foreground">Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          {data?.user ? (
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {data.user.name}
            </span>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            {logout.isPending ? "Signing out…" : "Log out"}
          </Button>
        </div>
      </div>
    </header>
  );
}
