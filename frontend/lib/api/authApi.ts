import { apiRequest } from "@/lib/api/client";

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

export const register = async (payload: { name: string; email: string; password: string }) => {
  return apiRequest<AuthPayload>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const login = async (payload: { email: string; password: string }) => {
  return apiRequest<AuthPayload>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getMe = async (token: string) => {
  return apiRequest<{ user: AuthUser }>("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
