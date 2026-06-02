import { apiRequest } from "@/lib/api/client";

export type AiTaskPriority = "low" | "medium" | "high" | "urgent";

export type AiGeneratedTask = {
  title: string;
  description: string;
  priority: AiTaskPriority;
};

export type ExistingAiTask = {
  title: string;
  status: string;
};

type DecomposePayload = {
  projectTitle: string;
  projectDescription: string;
  prompt?: string;
  existingTasks?: ExistingAiTask[];
};

export type AiGeneratedColumn = {
  title: string;
  tasks: AiGeneratedTask[];
};

type DecomposeResponse = {
  selectedAgentType: string;
  confidence: number;
  reason: string;
  columns: AiGeneratedColumn[];
  tasks: AiGeneratedTask[];
};

export const decomposeProjectTasks = async (payload: DecomposePayload) => {
  return apiRequest<DecomposeResponse>("/api/ai/decompose", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
