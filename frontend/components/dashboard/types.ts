export type ProjectStatus = "진행중" | "보관됨";

export interface ProjectItem {
  id: string;
  name: string;
  status: ProjectStatus;
  description: string;
  members: number;
  updatedAt: string;
  createdBy: string;
  isOwner: boolean;
  isArchived: boolean;
  archivedAt?: string | null;
}
