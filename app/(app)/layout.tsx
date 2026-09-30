"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { AppSidebarHeader } from "@/components/app-sidebar-header";
import { AuthGuard } from "@/components/auth-guard";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

function breadcrumbsFor(pathname: string) {
  if (pathname.startsWith("/settings")) {
    return [{ title: "Settings", href: "/settings/profile" }];
  }
  if (pathname.startsWith("/transfers/new")) {
    return [{ title: "Transfer", href: "/transfers/new" }];
  }
  if (pathname.startsWith("/transfers")) {
    return [{ title: "Transfer Log", href: "/transfers" }];
  }
  if (pathname.startsWith("/expenses/new")) {
    return [{ title: "Add Expense", href: "/expenses/new" }];
  }
  if (pathname.includes("/expenses/") && pathname.endsWith("/edit")) {
    return [{ title: "Expense Log", href: "/expenses" }, { title: "Edit", href: pathname }];
  }
  if (pathname.startsWith("/expenses")) {
    return [{ title: "Expense Log", href: "/expenses" }];
  }
  if (pathname.startsWith("/incomes/new")) {
    return [{ title: "Add Income", href: "/incomes/new" }];
  }
  if (pathname.startsWith("/incomes")) {
    return [{ title: "Income Log", href: "/incomes" }];
  }
  if (pathname.startsWith("/analytics")) {
    return [{ title: "Analytics", href: "/analytics" }];
  }
  if (pathname.startsWith("/users")) {
    return [{ title: "Users", href: "/users" }];
  }
  if (pathname.startsWith("/categories")) {
    return [{ title: "Categories", href: "/categories" }];
  }
  if (pathname.startsWith("/accounts")) {
    return [{ title: "Accounts", href: "/accounts" }];
  }
  return [{ title: "Dashboard", href: "/dashboard" }];
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthGuard>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="overflow-x-hidden">
            <AppSidebarHeader breadcrumbs={breadcrumbsFor(pathname)} />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </AuthGuard>
  );
}
