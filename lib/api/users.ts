import { apiRequest } from "@/lib/api/client";

export type ManagedUser = {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  email_verified_at: string | null;
  created_at: string | null;
  can_delete: boolean;
};

export type UserFormPayload = {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  is_admin: boolean;
};

export async function fetchUsers(): Promise<ManagedUser[]> {
  return apiRequest<ManagedUser[]>("/users");
}

export async function fetchUser(id: number): Promise<{
  user: Omit<ManagedUser, "can_delete" | "created_at" | "email_verified_at">;
  is_current_user: boolean;
  is_last_admin: boolean;
}> {
  return apiRequest(`/users/${id}`);
}

export async function createUser(payload: UserFormPayload) {
  return apiRequest<{ user: ManagedUser; message: string }>("/users", {
    method: "POST",
    body: payload,
  });
}

export async function updateUser(id: number, payload: UserFormPayload) {
  return apiRequest<{ user: ManagedUser; message: string }>(`/users/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteUser(id: number) {
  return apiRequest<{ message: string }>(`/users/${id}`, {
    method: "DELETE",
  });
}
