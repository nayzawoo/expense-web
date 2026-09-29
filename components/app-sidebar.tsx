"use client";

import Link from "next/link";
import {
  ArrowRightLeft,
  BarChart3,
  History,
  LayoutGrid,
  MinusCircle,
  PlusCircle,
  Settings,
  Users,
  Wallet,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useMe } from "@/hooks/use-auth";
import type { NavItem } from "@/types/nav";

export function AppSidebar() {
  const { data } = useMe();
  const isAdmin = Boolean(data?.user?.is_admin);

  const mainNavItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutGrid,
    },
    {
      title: "ထွက်ငွေ ထည့်ရန်",
      href: "/expenses/new",
      icon: MinusCircle,
    },
    {
      title: "ထွက်ငွေ မှတ်တမ်း",
      href: "/expenses",
      icon: History,
    },
    {
      title: "ဝင်ငွေ ထည့်ရန်",
      href: "/incomes/new",
      icon: PlusCircle,
    },
    {
      title: "ဝင်ငွေ မှတ်တမ်း",
      href: "/incomes",
      icon: History,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
    {
      title: "Accounts",
      href: "/accounts",
      icon: Wallet,
    },
    {
      title: "Transfer",
      href: "/transfers/new",
      icon: ArrowRightLeft,
    },
    {
      title: "Transfer Log",
      href: "/transfers",
      icon: History,
    },
    ...(isAdmin
      ? [
          {
            title: "Users (Admin)",
            href: "/users",
            icon: Users,
          },
          {
            title: "Categories (Admin)",
            href: "/categories",
            icon: Settings,
          },
        ]
      : []),
  ];

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/dashboard" />}
              tooltip="Expense Manager"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-sm font-bold">
                E
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Expense Manager</span>
                <span className="truncate text-xs text-muted-foreground">
                  Household
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
