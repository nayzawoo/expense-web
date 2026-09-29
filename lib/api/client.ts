export const AUTH_TOKEN_COOKIE = "expense_token";
export const AUTH_TOKEN_STORAGE_KEY = "expense_token";

export function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;

  if (!url) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  return url.replace(/\/$/, "");
}

export type ApiUser = {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  email_verified_at: string | null;
};

export type LoginResponse = {
  token: string;
  token_type: string;
  user: ApiUser;
};

export type MeResponse = {
  user: ApiUser;
};

export type ApiValidationError = {
  message: string;
  errors?: Record<string, string[]>;
};

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ??
    readCookie(AUTH_TOKEN_COOKIE)
  );
}

export function setStoredToken(token: string): void {
  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  document.cookie = `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; SameSite=Lax; max-age=${60 * 60 * 24 * 30}`;
}

export function clearStoredToken(): void {
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  document.cookie = `${AUTH_TOKEN_COOKIE}=; path=/; SameSite=Lax; max-age=0`;
}

function readCookie(name: string): string | null {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  if (!match) {
    return null;
  }

  return decodeURIComponent(match.split("=").slice(1).join("="));
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const token = options.token === undefined ? getStoredToken() : options.token;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${getApiBaseUrl()}/api/v1${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = (await response.json().catch(() => null)) as
    | ApiValidationError
    | T
    | null;

  if (!response.ok) {
    const errorPayload = payload as ApiValidationError | null;
    throw new ApiError(
      response.status,
      errorPayload?.message ?? "Request failed",
      errorPayload?.errors,
    );
  }

  return payload as T;
}
