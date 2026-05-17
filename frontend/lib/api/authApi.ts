export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

type AuthPayload = {
  token: string;
  user: AuthUser;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL 환경변수가 필요합니다.");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const json = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !json.success) {
    throw new Error(json.message ?? "API 요청에 실패했습니다.");
  }

  return json.data;
};

export const register = async (payload: { name: string; email: string; password: string }) => {
  return request<AuthPayload>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const login = async (payload: { email: string; password: string }) => {
  return request<AuthPayload>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getMe = async (token: string) => {
  return request<{ user: AuthUser }>("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
