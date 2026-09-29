"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Plus,
  Trash2,
} from "lucide-react";
import { AdminGate } from "@/components/admin-gate";
import { CategoryIcon } from "@/components/category-icon";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import {
  deleteCategory,
  fetchCategories,
  reorderCategory,
} from "@/lib/api/categories";
import { getErrorMessage } from "@/lib/api/client";
import { invalidateQueryKeys, queryKeys } from "@/lib/query-keys";

export default function CategoriesPage() {
  return (
    <AdminGate>
      <CategoriesContent />
    </AdminGate>
  );
}

function CategoriesContent() {
  const queryClient = useQueryClient();
  const categories = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: fetchCategories,
  });

  const invalidate = async () => {
    await invalidateQueryKeys(queryClient, [
      queryKeys.categories.all,
      queryKeys.expenses.all,
      queryKeys.dashboard.all,
      queryKeys.analytics.all,
    ]);
  };

  const remove = useMutation({
    mutationFn: deleteCategory,
    onSuccess: invalidate,
  });

  const reorder = useMutation({
    mutationFn: ({ id, direction }: { id: number; direction: "up" | "down" }) =>
      reorderCategory(id, direction),
    onSuccess: invalidate,
  });

  const rows = categories.data ?? [];

  return (
    <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Categories"
        description="Manage expense categories"
        action={
          <Link
            href="/categories/new"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Link>
        }
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {categories.isLoading ? (
          <div className="space-y-3 p-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : categories.isError ? (
          <p className="p-4 text-sm text-destructive">
            {getErrorMessage(categories.error)}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="w-12 px-4 py-3 text-center font-semibold text-foreground">
                    #
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground">
                    Name
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-foreground">
                    Color
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-foreground">
                    Icon
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      No categories yet.
                    </td>
                  </tr>
                ) : (
                  rows.map((category, index) => (
                    <tr
                      key={category.id}
                      className="transition-colors hover:bg-accent/50"
                    >
                      <td className="px-4 py-3 text-center font-mono text-xs text-muted-foreground">
                        {category.sort_order}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {category.name}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background shadow-sm"
                            style={{ color: category.color }}
                            title={category.color}
                          >
                            <CategoryIcon
                              name={category.icon ?? "Banknote"}
                              className="h-4 w-4"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-xs text-muted-foreground">
                        {category.icon ?? "Banknote"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <div className="mr-2 flex overflow-hidden rounded-md border border-border bg-muted/30">
                            <button
                              type="button"
                              onClick={() =>
                                reorder.mutate({
                                  id: category.id,
                                  direction: "up",
                                })
                              }
                              disabled={index === 0 || reorder.isPending}
                              className="flex h-8 w-8 items-center justify-center border-r border-border transition-colors hover:bg-accent disabled:opacity-30 disabled:hover:bg-transparent"
                              title="Move Up"
                            >
                              <ChevronUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                reorder.mutate({
                                  id: category.id,
                                  direction: "down",
                                })
                              }
                              disabled={
                                index === rows.length - 1 || reorder.isPending
                              }
                              className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-accent disabled:opacity-30 disabled:hover:bg-transparent"
                              title="Move Down"
                            >
                              <ChevronDown className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <Link
                            href={`/categories/${category.id}/edit`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this category?",
                                )
                              ) {
                                remove.mutate(category.id);
                              }
                            }}
                            disabled={!category.can_delete || remove.isPending}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-30 dark:hover:bg-rose-900/20"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
