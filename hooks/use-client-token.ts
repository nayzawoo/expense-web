"use client";

import { useSyncExternalStore } from "react";
import { getStoredToken } from "@/lib/api/client";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("expense-auth-change", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("expense-auth-change", onStoreChange);
  };
}

function getClientReady() {
  return true;
}

function getServerReady() {
  return false;
}

/**
 * Token is only available in the browser. Gate queries until after hydrate
 * so SSR and the first client render stay in sync.
 */
export function useClientToken() {
  const token = useSyncExternalStore(subscribe, getStoredToken, () => null);
  const ready = useSyncExternalStore(
    () => () => {},
    getClientReady,
    getServerReady,
  );

  return { token, ready };
}
