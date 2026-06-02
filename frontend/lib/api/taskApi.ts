import { Task, TaskInput } from "@/components/kanban/types";
import { apiRequest } from "@/lib/api/client";

type BackendPriority = "urgent" | "high" | "medium" | "low";
type BackendTask = { _id: string; projectId: string; columnId: string; title: string; description: string; memo?: string; priority: BackendPriority; assignee: string; progress: number; dueDate: string | null; aiStatus: string; order: number; createdAt: string; updatedAt: string };

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
  memo: task.memo ?? "",
  assignee: task.assignee,
  assigneeInitial: task.assignee.slice(0, 2) || "-",
  progress: task.progress,
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

export const getTasksByProject = async (projectId: string) => {
  const data = await apiRequest<BackendTask[]>(`/api/projects/${projectId}/tasks`);
  return data.map(mapTaskFromBackend);
};

export const createTask = async (projectId: string, payload: TaskInput & { columnId: string; order: number }) => {
  const data = await apiRequest<BackendTask>(`/api/projects/${projectId}/tasks`, { method: "POST", body: JSON.stringify(mapPayloadToBackend(payload)) });
  return mapTaskFromBackend(data);
};

export const updateTask = async (taskId: string, payload: Partial<TaskInput>) => {
  const data = await apiRequest<BackendTask>(`/api/tasks/${taskId}`, { method: "PATCH", body: JSON.stringify(mapPayloadToBackend(payload)) });
  return mapTaskFromBackend(data);
};

export const deleteTask = async (taskId: string) => {
  await apiRequest(`/api/tasks/${taskId}`, { method: "DELETE" });
};

export const moveTask = async (taskId: string, payload: { columnId: string; order: number }) => {
  const data = await apiRequest<BackendTask>(`/api/tasks/${taskId}/move`, { method: "PATCH", body: JSON.stringify(payload) });
  return mapTaskFromBackend(data);
};

export const updateTaskMemo = async (taskId: string, memo: string) => {
  const data = await apiRequest<BackendTask>(`/api/tasks/${taskId}/memo`, {
    method: "PATCH",
    body: JSON.stringify({ memo }),
  });
  return mapTaskFromBackend(data);
};
