export type Project = {
  id: string;
  name: string;
  description: string;
  status: "active" | "archived";
  createdBy: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
};

type BackendProject = {
  _id: string;
  name: string;
  description: string;
  status: "active" | "archived";
  createdBy: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL 환경변수가 필요합니다.");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  const json = await response.json();
  if (!response.ok || !json.success) throw new Error(json.message ?? "API 요청에 실패했습니다.");
  return json.data as T;
};

const mapProject = (project: BackendProject): Project => ({
  id: project._id,
  name: project.name,
  description: project.description,
  status: project.status,
  createdBy: project.createdBy,
  memberCount: project.memberCount,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
});

export const getProjects = async () => {
  const data = await request<BackendProject[]>("/api/projects");
  return data.map(mapProject);
};

export const getProjectById = async (projectId: string) => {
  const data = await request<BackendProject>(`/api/projects/${projectId}`);
  return mapProject(data);
};

export const createProject = async (payload: { name: string; description?: string }) => {
  const data = await request<BackendProject>("/api/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return mapProject(data);
};
