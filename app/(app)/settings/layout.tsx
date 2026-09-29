"use client";

import { usePathname } from "next/navigation";
import { SettingsShell } from "@/components/settings-shell";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return <SettingsShell pathname={pathname}>{children}</SettingsShell>;
}
