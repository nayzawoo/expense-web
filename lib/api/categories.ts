import { apiRequest } from "@/lib/api/client";

export type Category = {
  id: number;
  name: string;
  color: string;
  icon: string | null;
  sort_order: number;
  can_delete: boolean;
};

export type CategoryFormPayload = {
  name: string;
  color: string;
  icon?: string | null;
  sort_order?: number | null;
};

export async function fetchCategories(): Promise<Category[]> {
  return apiRequest<Category[]>("/categories");
}

export async function fetchCategory(id: number): Promise<{ category: Category }> {
  return apiRequest(`/categories/${id}`);
}

export async function createCategory(payload: CategoryFormPayload) {
  return apiRequest<{ category: Category; message: string }>("/categories", {
    method: "POST",
    body: payload,
  });
}

export async function updateCategory(id: number, payload: CategoryFormPayload) {
  return apiRequest<{ category: Category; message: string }>(
    `/categories/${id}`,
    { method: "PUT", body: payload },
  );
}

export async function deleteCategory(id: number) {
  return apiRequest<{ message: string }>(`/categories/${id}`, {
    method: "DELETE",
  });
}

export async function reorderCategory(id: number, direction: "up" | "down") {
  return apiRequest<{ categories: Category[]; message: string }>(
    `/categories/${id}/reorder/${direction}`,
    { method: "PATCH" },
  );
}
