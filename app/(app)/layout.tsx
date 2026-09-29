"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { AppSidebarHeader } from "@/components/app-sidebar-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="overflow-x-hidden">
          <AppSidebarHeader
            breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }]}
          />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
