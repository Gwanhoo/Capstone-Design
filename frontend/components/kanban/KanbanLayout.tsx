"use client";

import { initialMessages } from "./mockData";
import { KanbanBoard } from "./KanbanBoard";
import { KanbanHeader } from "./KanbanHeader";
import { ProjectSidebar } from "./ProjectSidebar";
import { TeamChatPanel } from "./TeamChatPanel";
import { useKanbanBoard } from "./useKanbanBoard";

export function KanbanLayout() {
  const board = useKanbanBoard();

  return (
    <div className="flex h-screen bg-surface text-on-surface">
      <ProjectSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <KanbanHeader onGenerateAiTask={board.addAiGeneratedTask} />
        <div className="flex min-h-0 flex-1">
          <div className="min-w-0 flex-1 overflow-hidden">
            <KanbanBoard
              orderedColumns={board.orderedColumns}
              tasks={board.tasks}
              activeTaskId={board.dragMeta?.taskId ?? null}
              dropColumnId={board.dropColumnId}
              setDropColumnId={board.setDropColumnId}
              startDrag={board.startDrag}
              moveTask={board.moveTask}
              createTask={board.createTask}
              updateTask={board.updateTask}
              deleteTask={board.deleteTask}
            />
          </div>
          <div className="hidden xl:block">
            <TeamChatPanel initialMessages={initialMessages} onAddRecommendedTask={board.addAiGeneratedTask} />
          </div>
        </div>
      </div>
    </div>
  );
}
