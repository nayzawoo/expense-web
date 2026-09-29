"use client";

import { useEffect } from "react";
import { initializeTheme } from "@/hooks/use-appearance";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeTheme();
  }, []);

  return children;
}
