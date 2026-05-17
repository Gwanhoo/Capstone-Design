import { KanbanLayout } from "@/components/kanban/KanbanLayout";

export default function ProjectBoardPage({ params }: { params: { projectId: string } }) {
  return <KanbanLayout projectId={params.projectId} />;
}
