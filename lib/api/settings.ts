import { apiRequest, type ApiUser } from "@/lib/api/client";

export async function updateProfile(payload: {
  name: string;
  email: string;
}): Promise<{ user: ApiUser; message: string }> {
  return apiRequest("/profile", {
    method: "PUT",
    body: payload,
  });
}

export async function updatePassword(payload: {
  current_password: string;
  password: string;
  password_confirmation: string;
}): Promise<{ message: string }> {
  return apiRequest("/password", {
    method: "PUT",
    body: payload,
  });
}
