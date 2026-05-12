import { Task, TaskInput } from "@/components/kanban/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const PROJECT_ID = "ai-collab";

type BackendPriority = "urgent" | "high" | "medium" | "low";
type BackendTask = { _id: string; projectId: string; columnId: string; title: string; description: string; priority: BackendPriority; assignee: string; progress: number; dueDate: string | null; aiStatus: string; order: number; createdAt: string; updatedAt: string };

const priorityToFrontend: Record<BackendPriority, Task["priority"]> = { urgent: "긴급", high: "높음", medium: "보통", low: "낮음" };
const priorityToBackend: Record<Task["priority"], BackendPriority> = { 긴급: "urgent", 높음: "high", 보통: "medium", 낮음: "low" };

const formatDueDate = (value: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10).replaceAll("-", ".");
};

const parseDueDate = (value?: string) => {
  if (!value) return null;
  const date = new Date(value.replaceAll(".", "-"));
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

const mapTaskFromBackend = (task: BackendTask): Task => ({
  id: task._id,
  columnId: task.columnId,
  order: task.order,
  title: task.title,
  description: task.description,
  assignee: task.assignee,
  assigneeInitial: task.assignee.slice(0, 2) || "-",
  progress: task.progress,
  comments: 0,
  attachments: 0,
  dueDate: formatDueDate(task.dueDate),
  aiStatus: task.aiStatus,
  priority: priorityToFrontend[task.priority] ?? "보통",
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

const mapPayloadToBackend = (payload: Partial<TaskInput>) => ({
  ...payload,
  ...(payload.priority ? { priority: priorityToBackend[payload.priority] } : {}),
  ...(payload.dueDate !== undefined ? { dueDate: parseDueDate(payload.dueDate) } : {}),
});

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL 환경변수가 필요합니다.");
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) }, cache: "no-store" });
  const json = await response.json();
  if (!response.ok || !json.success) throw new Error(json.message ?? "API 요청에 실패했습니다.");
  return json.data as T;
};

export const getTasksByProject = async (projectId = PROJECT_ID) => {
  const data = await request<BackendTask[]>(`/api/projects/${projectId}/tasks`);
  return data.map(mapTaskFromBackend);
};

export const createTask = async (projectId: string, payload: TaskInput & { columnId: string; order: number }) => {
  const data = await request<BackendTask>(`/api/projects/${projectId}/tasks`, { method: "POST", body: JSON.stringify(mapPayloadToBackend(payload)) });
  return mapTaskFromBackend(data);
};

export const updateTask = async (taskId: string, payload: Partial<TaskInput>) => {
  const data = await request<BackendTask>(`/api/tasks/${taskId}`, { method: "PATCH", body: JSON.stringify(mapPayloadToBackend(payload)) });
  return mapTaskFromBackend(data);
};

export const deleteTask = async (taskId: string) => {
  await request(`/api/tasks/${taskId}`, { method: "DELETE" });
};

export const moveTask = async (taskId: string, payload: { columnId: string; order: number }) => {
  const data = await request<BackendTask>(`/api/tasks/${taskId}/move`, { method: "PATCH", body: JSON.stringify(payload) });
  return mapTaskFromBackend(data);
};
