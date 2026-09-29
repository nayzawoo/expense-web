import Link from "next/link";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const settingsNav = [
  { title: "Profile", href: "/settings/profile" },
  { title: "Security", href: "/settings/security" },
  { title: "Appearance", href: "/settings/appearance" },
] as const;

export function SettingsShell({
  pathname,
  children,
}: {
  pathname: string;
  children: ReactNode;
}) {
  return (
    <div className="px-4 py-6">
      <div className="mb-6 space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile and account settings
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-12">
        <aside className="w-full max-w-xl lg:w-48">
          <nav className="flex flex-col space-y-1" aria-label="Settings">
            {settingsNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "w-full justify-start",
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "bg-muted"
                    : undefined,
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>

        <Separator className="my-6 lg:hidden" />

        <div className="flex-1 md:max-w-2xl">
          <section className="max-w-xl space-y-12">{children}</section>
        </div>
      </div>
    </div>
  );
}
