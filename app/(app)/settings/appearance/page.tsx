"use client";

import { AppearanceTabs } from "@/components/appearance-tabs";

export default function AppearanceSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-medium">Appearance settings</h2>
        <p className="text-sm text-muted-foreground">
          Update your account&apos;s appearance settings
        </p>
      </div>
      <AppearanceTabs />
    </div>
  );
}
