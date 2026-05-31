import { apiRequest } from "@/lib/api/client";

export type RecentTask = {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  columnId: string;
  columnTitle: string;
  priority: "urgent" | "high" | "medium" | "low";
  updatedAt: string;
};

type BackendRecentTask = Omit<RecentTask, "id"> & { _id: string };

export const getRecentTasks = async () => {
  const data = await apiRequest<BackendRecentTask[]>("/api/dashboard/recent-tasks");
  return data.map((task) => ({ ...task, id: task._id }));
};
