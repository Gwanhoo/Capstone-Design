"use client";

import { useEffect, useState } from "react";
import { getProjectById } from "@/lib/api/projectApi";
import { initialMessages } from "./mockData";
import { KanbanBoard } from "./KanbanBoard";
import { KanbanHeader } from "./KanbanHeader";
import { ProjectSidebar } from "./ProjectSidebar";
import { TeamChatPanel } from "./TeamChatPanel";
import { useKanbanBoard } from "./useKanbanBoard";

export function KanbanLayout({ projectId }: { projectId: string }) {
  const board = useKanbanBoard(projectId);
  const [projectName, setProjectName] = useState<string>("");
  const [isProjectLoading, setIsProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsProjectLoading(true);
        setProjectError(null);
        const project = await getProjectById(projectId);
        setProjectName(project.name);
      } catch (_error) {
        setProjectError("프로젝트 정보를 불러오지 못했습니다.");
      } finally {
        setIsProjectLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  return (
    <div className="flex h-screen bg-surface text-on-surface">
      <ProjectSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <KanbanHeader
          onGenerateAiTask={board.addAiGeneratedTask}
          projectName={isProjectLoading ? "프로젝트 불러오는 중..." : projectName || "프로젝트"}
        />
        <div className="flex min-h-0 flex-1">
          <div className="min-w-0 flex-1 overflow-hidden">
            {board.isLoading ? <div className="px-6 py-6 text-sm text-on-surface-variant">작업을 불러오는 중...</div> : <KanbanBoard
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
            />}
            {projectError ? <div className="px-6 pb-2 text-sm text-red-300">{projectError}</div> : null}
            {board.error ? <div className="px-6 pb-2 text-sm text-red-300">{board.error}</div> : null}
          </div>
          <div className="hidden xl:block">
            <TeamChatPanel initialMessages={initialMessages} onAddRecommendedTask={board.addAiGeneratedTask} />
          </div>
        </div>
      </div>
    </div>
  );
}
