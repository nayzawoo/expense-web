"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Layout, Palette, SortAsc, Tag } from "lucide-react";
import { AdminGate } from "@/components/admin-gate";
import { CategoryIcon } from "@/components/category-icon";
import { PageHeader } from "@/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchCategory,
  updateCategory,
  type Category,
} from "@/lib/api/categories";
import { getErrorMessage, isApiError } from "@/lib/api/client";

export default function EditCategoryPage() {
  return (
    <AdminGate>
      <CategoryEditLoader />
    </AdminGate>
  );
}

function CategoryEditLoader() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const detail = useQuery({
    queryKey: ["categories", id],
    queryFn: () => fetchCategory(id),
    enabled: Number.isFinite(id),
  });

  if (detail.isLoading) {
    return (
      <div className="p-4 md:p-6">
        <Skeleton className="h-40 w-full max-w-lg" />
      </div>
    );
  }

  if (detail.isError || !detail.data) {
    return (
      <div className="p-4 md:p-6">
        <Alert variant="destructive">
          <AlertTitle>Could not load category</AlertTitle>
          <AlertDescription>{getErrorMessage(detail.error)}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <CategoryEditForm
      key={detail.data.category.id}
      category={detail.data.category}
    />
  );
}

function CategoryEditForm({ category }: { category: Category }) {
  const router = useRouter();
  const [name, setName] = useState(category.name);
  const [color, setColor] = useState(category.color);
  const [icon, setIcon] = useState(category.icon ?? "Banknote");
  const [sortOrder, setSortOrder] = useState(category.sort_order ?? 0);

  const save = useMutation({
    mutationFn: () =>
      updateCategory(category.id, {
        name,
        color,
        icon,
        sort_order: sortOrder,
      }),
    onSuccess: () => router.push("/categories"),
  });

  const fieldErrors = isApiError(save.error) ? save.error.errors : undefined;

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    save.mutate();
  }

  return (
    <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Edit Category"
        description="Update expense category details"
        backHref="/categories"
      />

      <div className="mx-auto w-full max-w-lg">
        <form
          onSubmit={onSubmit}
          className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          {save.isError ? (
            <Alert variant="destructive">
              <AlertTitle>Could not update category</AlertTitle>
              <AlertDescription>{getErrorMessage(save.error)}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-1.5">
            <label
              htmlFor="category-name"
              className="flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <Tag className="h-4 w-4 text-muted-foreground" />
              Category Name
            </label>
            <input
              id="category-name"
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="eg. အစားအသောက်"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
            />
            {fieldErrors?.name?.[0] ? (
              <p className="text-xs text-destructive">{fieldErrors.name[0]}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="category-color"
              className="flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <Palette className="h-4 w-4 text-muted-foreground" />
              Color
            </label>
            <div className="flex items-center gap-3">
              <input
                id="category-color"
                type="color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className="h-10 w-20 cursor-pointer rounded-md border border-input bg-background p-1"
              />
              <p className="text-xs text-muted-foreground">
                Choose a color for charts
              </p>
            </div>
            {fieldErrors?.color?.[0] ? (
              <p className="text-xs text-destructive">{fieldErrors.color[0]}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="category-sort"
              className="flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <SortAsc className="h-4 w-4 text-muted-foreground" />
              Sort Order
            </label>
            <input
              id="category-sort"
              type="number"
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(parseInt(event.target.value, 10) || 0)
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
            />
            {fieldErrors?.sort_order?.[0] ? (
              <p className="text-xs text-destructive">
                {fieldErrors.sort_order[0]}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="category-icon"
              className="flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <Layout className="h-4 w-4 text-muted-foreground" />
              Icon Name
            </label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  id="category-icon"
                  type="text"
                  value={icon}
                  onChange={(event) => setIcon(event.target.value)}
                  placeholder="eg. Utensils, Beer, ShoppingBag"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground shadow-sm transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
                />
                <div className="absolute top-1/2 right-3 -translate-y-1/2">
                  <CategoryIcon
                    name={icon}
                    className="h-4 w-4 text-muted-foreground"
                  />
                </div>
              </div>
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background shadow-sm"
                style={{ color }}
              >
                <CategoryIcon name={icon} className="h-5 w-5" />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Use any{" "}
              <a
                href="https://lucide.dev/icons"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Lucide Icon
              </a>{" "}
              name.
            </p>
            {fieldErrors?.icon?.[0] ? (
              <p className="text-xs text-destructive">{fieldErrors.icon[0]}</p>
            ) : null}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={save.isPending}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none disabled:opacity-50"
            >
              {save.isPending ? "Updating..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
