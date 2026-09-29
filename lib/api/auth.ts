import {
  apiRequest,
  clearStoredToken,
  setStoredToken,
  type LoginResponse,
  type MeResponse,
} from "@/lib/api/client";

export async function login(input: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  const data = await apiRequest<LoginResponse>("/login", {
    method: "POST",
    body: {
      ...input,
      device_name: "expense-web",
    },
    token: null,
  });

  setStoredToken(data.token);
  return data;
}

export async function fetchMe(): Promise<MeResponse> {
  return apiRequest<MeResponse>("/me");
}

export async function logout(): Promise<void> {
  try {
    await apiRequest<{ message: string }>("/logout", { method: "POST" });
  } finally {
    clearStoredToken();
  }
}
