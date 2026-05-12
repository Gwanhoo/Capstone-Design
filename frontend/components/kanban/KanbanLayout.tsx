import { initialMessages } from "./mockData";
import { KanbanBoard } from "./KanbanBoard";
import { KanbanHeader } from "./KanbanHeader";
import { ProjectSidebar } from "./ProjectSidebar";
import { TeamChatPanel } from "./TeamChatPanel";

export function KanbanLayout() {
  return (
    <div className="flex h-screen bg-surface text-on-surface">
      <ProjectSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <KanbanHeader />
        <div className="flex min-h-0 flex-1">
          <div className="min-w-0 flex-1 overflow-hidden">
            <KanbanBoard />
          </div>
          <div className="hidden xl:block">
            <TeamChatPanel initialMessages={initialMessages} />
          </div>
        </div>
      </div>
    </div>
  );
}
