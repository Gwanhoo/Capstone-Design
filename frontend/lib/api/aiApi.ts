import { apiRequest } from "@/lib/api/client";

export type AiTaskPriority = "low" | "medium" | "high" | "urgent";

export type AiGeneratedTask = {
  title: string;
  description: string;
  priority: AiTaskPriority;
};

type DecomposeResponse = {
  tasks: AiGeneratedTask[];
};

export const decomposeProjectTasks = async (payload: { projectTitle: string; projectDescription: string }) => {
  return apiRequest<DecomposeResponse>("/api/ai/decompose", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
