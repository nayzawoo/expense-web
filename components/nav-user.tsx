"use client";

import { useRouter } from "next/navigation";
import { ChevronsUpDown, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLogout, useMe } from "@/hooks/use-auth";

export function NavUser() {
  const router = useRouter();
  const { data, isPending } = useMe();
  const logout = useLogout();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const isMobileViewport = useIsMobile();
  const user = data?.user;

  if (isPending && !user) {
    return (
      <div className="flex items-center gap-2 px-2 py-2">
        <Skeleton className="size-8 rounded-lg" />
        <div className="grid flex-1 gap-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-left text-sm outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 data-[popup-open]:bg-sidebar-accent">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            align="end"
            side={
              isMobileViewport
                ? "bottom"
                : state === "collapsed"
                  ? "left"
                  : "bottom"
            }
          >
            <DropdownMenuItem
              onClick={() => {
                if (isMobile) {
                  setOpenMobile(false);
                }
                router.push("/settings/profile");
              }}
            >
              <Settings />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                if (isMobile) {
                  setOpenMobile(false);
                }
                logout.mutate();
              }}
              disabled={logout.isPending}
            >
              <LogOut />
              {logout.isPending ? "Signing out…" : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
