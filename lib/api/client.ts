export const AUTH_TOKEN_STORAGE_KEY = "expense_token";
export const AUTH_HINT_COOKIE = "expense_authenticated";
export const API_KEY_HEADER = "X-Api-Key";

/** Legacy cookie that previously stored the Bearer token — cleared on login/logout. */
const LEGACY_AUTH_TOKEN_COOKIE = "expense_token";

export function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!url) {
    throw new ApiError(
      0,
      "Unable to sign in. Please try again later.",
    );
  }

  return url.replace(/\/$/, "");
}

function getApiKey(): string | null {
  const key = process.env.API_KEY?.trim();

  return key ? key : null;
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
  url?: string;
  causeName?: string;

  constructor(
    status: number,
    message: string,
    options?: {
      errors?: Record<string, string[]>;
      url?: string;
      causeName?: string;
    },
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = options?.errors;
    this.url = options?.url;
    this.causeName = options?.causeName;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return (
    error instanceof ApiError ||
    (typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error as { name?: string }).name === "ApiError")
  );
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Unable to sign in. Try again.";
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string): void {
  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  document.cookie = `${AUTH_HINT_COOKIE}=1; path=/; SameSite=Lax; max-age=${60 * 60 * 24 * 30}`;
  // Remove any leftover Bearer token cookie from the previous storage scheme.
  document.cookie = `${LEGACY_AUTH_TOKEN_COOKIE}=; path=/; SameSite=Lax; max-age=0`;
  window.dispatchEvent(new Event("expense-auth-change"));
}

export function clearStoredToken(): void {
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  document.cookie = `${AUTH_HINT_COOKIE}=; path=/; SameSite=Lax; max-age=0`;
  document.cookie = `${LEGACY_AUTH_TOKEN_COOKIE}=; path=/; SameSite=Lax; max-age=0`;
  window.dispatchEvent(new Event("expense-auth-change"));
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
};

function describeNetworkFailure(url: string, error: unknown): ApiError {
  const causeName = error instanceof Error ? error.name : "UnknownError";
  const causeMessage = error instanceof Error ? error.message : String(error);

  if (process.env.NODE_ENV !== "production") {
    console.error("[api]", url, causeName, causeMessage);
  }

  return new ApiError(0, "Unable to reach the server. Please try again.", {
    url,
    causeName: `${causeName}: ${causeMessage}`,
  });
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/api/v1${path}`;

  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const apiKey = getApiKey();

  if (apiKey) {
    headers[API_KEY_HEADER] = apiKey;
  }

  const token = options.token === undefined ? getStoredToken() : options.token;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;

  try {
    response = await fetch(url, {
      method: options.method ?? "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch (error) {
    throw describeNetworkFailure(url, error);
  }

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
      errorPayload?.message ?? `Request failed with HTTP ${response.status}`,
      {
        errors: errorPayload?.errors,
        url,
      },
    );
  }

  return payload as T;
}
