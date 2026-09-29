"use client";

import { useEffect, useState } from "react";
import { getStoredToken } from "@/lib/api/client";

/**
 * Token is only available in the browser. Gate queries until after mount
 * so SSR and the first client render stay in sync.
 */
export function useClientToken() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setToken(getStoredToken());
    setReady(true);
  }, []);

  return { token, ready };
}
