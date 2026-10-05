import type { QueryClient } from "@tanstack/react-query";

export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },

  accounts: {
    all: ["accounts"] as const,
  },

  expenses: {
    all: ["expenses"] as const,
    create: ["expenses", "create"] as const,
  },

  incomes: {
    all: ["incomes"] as const,
    create: ["incomes", "create"] as const,
  },

  transfers: {
    all: ["transfers"] as const,
    create: ["transfers", "create"] as const,
  },

  dashboard: {
    all: ["dashboard"] as const,
  },

  analytics: {
    all: ["analytics"] as const,
  },

  categories: {
    all: ["categories"] as const,
  },

  users: {
    all: ["users"] as const,
  },

  adjustments: {
    all: ["adjustments"] as const,
  },
} as const;

export async function invalidateQueryKeys(
  queryClient: QueryClient,
  keys: ReadonlyArray<readonly unknown[]>,
) {
  await Promise.all(
    keys.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
  );
}
