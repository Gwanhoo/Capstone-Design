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

export type BoardAnalysisSnapshot = {
  progress: {
    totalTaskCount: number;
    doneTaskCount: number;
    percent: number;
  };
  columns: Array<{
    id: string;
    name: string;
    taskCount: number;
    isDoneColumn: boolean;
    tasks: Array<{
      title: string;
      description: string;
      priority: string;
      memo: string;
      isDone: boolean;
    }>;
  }>;
};

export type BoardAnalysisResult = {
  summary: string;
  columnAnalysis: string[];
  memoInsights: string[];
  risks: string[];
  recommendations: string[];
  conclusion: string;
  fallback?: boolean;
  snapshot?: BoardAnalysisSnapshot;
};

export const analyzeProjectBoard = async (projectId: string) => {
  return apiRequest<BoardAnalysisResult>(`/api/projects/${projectId}/ai/analyze-board`, {
    method: "POST",
  });
};
