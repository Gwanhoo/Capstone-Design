export type Priority = "긴급" | "높음" | "보통" | "낮음";

export type Task = {
  id: string;
  columnId: string;
  order: number;
  title: string;
  description: string;
  assignee: string;
  assigneeInitial: string;
  progress: number;
  comments: number;
  attachments: number;
  dueDate: string;
  aiStatus: string;
  priority: Priority;
  createdAt?: string;
  updatedAt?: string;
};

export type TaskInput = Pick<Task, "title" | "description" | "priority" | "assignee" | "dueDate">;

export type KanbanColumnType = {
  id: string;
  title: string;
  tone: "slate" | "primary" | "tertiary";
  taskIds: string[];
};

export type ChatMessage = {
  id: string;
  sender: string;
  time: string;
  message: string;
  type: "team" | "mine" | "ai";
};
