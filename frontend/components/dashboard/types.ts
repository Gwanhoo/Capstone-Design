export type ProjectStatus = "진행중" | "완료" | "대기중";

export interface ProjectItem {
  id: number;
  name: string;
  status: ProjectStatus;
  description: string;
  progress: number;
  members: number;
  updatedAt: string;
}
