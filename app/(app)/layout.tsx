"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { AppSidebarHeader } from "@/components/app-sidebar-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

function breadcrumbsFor(pathname: string) {
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
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="overflow-x-hidden">
          <AppSidebarHeader breadcrumbs={breadcrumbsFor(pathname)} />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
