type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const handleAuthFailure = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
  window.dispatchEvent(new Event("auth:unauthorized"));
  window.location.href = "/login";
};

export const apiRequest = async <T>(path: string, init?: RequestInit): Promise<T> => {
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL 환경변수가 필요합니다.");

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    handleAuthFailure();
  }

  const json = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !json.success) {
    if (response.status === 401) {
      handleAuthFailure();
    }
    if (response.status === 403) {
      throw new Error("접근 권한이 없습니다.");
    }
    throw new Error(json.message ?? "API 요청에 실패했습니다.");
  }

  return json.data;
};
