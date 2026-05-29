"use client";

import { useEffect, useState } from "react";
import { getProjectById, Project } from "@/lib/api/projectApi";
import { AiGeneratedTask, decomposeProjectTasks } from "@/lib/api/aiApi";
import { KanbanBoard } from "./KanbanBoard";
import { KanbanHeader } from "./KanbanHeader";
import { ProjectSidebar } from "./ProjectSidebar";
import { TeamChatPanel } from "./TeamChatPanel";
import { MemberManagementPanel } from "./MemberManagementPanel";
import { useKanbanBoard } from "./useKanbanBoard";
import { AiTaskPreviewModal } from "./AiTaskPreviewModal";
import { AiTaskPromptModal } from "./AiTaskPromptModal";
import { ColumnCreateModal } from "./ColumnCreateModal";

const priorityToFrontend: Record<AiGeneratedTask["priority"], "긴급" | "높음" | "보통" | "낮음"> = {
  urgent: "긴급",
  high: "높음",
  medium: "보통",
  low: "낮음",
};

export function KanbanLayout({ projectId }: { projectId: string }) {
  const board = useKanbanBoard(projectId);
  const [project, setProject] = useState<Project | null>(null);
  const [isProjectLoading, setIsProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [aiTasks, setAiTasks] = useState<AiGeneratedTask[]>([]);
  const [isAiPromptOpen, setIsAiPromptOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isColumnCreating, setIsColumnCreating] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiAdding, setIsAiAdding] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsProjectLoading(true);
        setProjectError(null);
        const projectDetail = await getProjectById(projectId);
        setProject(projectDetail);
      } catch (_error) {
        setProjectError("프로젝트 정보를 불러오지 못했습니다.");
      } finally {
        setIsProjectLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  const existingTasks = () => Object.values(board.tasks).map((task) => ({
    title: task.title,
    status: task.columnId,
  }));

  const handleGenerateAiTasks = async (prompt: string) => {
    if (!project) {
      setAiError("프로젝트 정보를 불러온 뒤 다시 시도해주세요.");
      return;
    }

    try {
      setIsAiLoading(true);
      setAiError(null);
      setAiMessage("AI가 프로젝트를 분석하는 중...");
      const result = await decomposeProjectTasks({
        projectTitle: project.name,
        projectDescription: project.description || project.name,
        prompt,
        existingTasks: existingTasks(),
      });
      setAiTasks(result.tasks);
      setIsAiPromptOpen(false);
      setIsAiModalOpen(true);
      setAiMessage(`AI 작업 ${result.tasks.length}개가 생성되었습니다.`);
    } catch (error) {
      console.error(error);
      setAiError("AI 작업 생성 실패");
      setAiMessage(null);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCreateColumn = async (title: string) => {
    try {
      setIsColumnCreating(true);
      await board.createColumn(title);
      setIsColumnModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsColumnCreating(false);
    }
  };

  const handleAddAllAiTasks = async () => {
    try {
      setIsAiAdding(true);
      setAiError(null);
      for (const task of aiTasks) {
        await board.createTask("todo", {
          title: task.title,
          description: task.description,
          priority: priorityToFrontend[task.priority],
          assignee: "AI 추천",
          dueDate: "",
        });
      }
      setAiMessage(`AI 작업 ${aiTasks.length}개를 Todo 컬럼에 추가했습니다.`);
      setIsAiModalOpen(false);
      setAiTasks([]);
    } catch (error) {
      console.error(error);
      setAiError("AI 작업 생성 실패");
    } finally {
      setIsAiAdding(false);
    }
  };

  return (
    <div className="flex h-screen bg-surface text-on-surface">
      <ProjectSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <KanbanHeader
          onGenerateAiTask={() => setIsAiPromptOpen(true)}
          isGeneratingAiTask={isAiLoading}
          projectName={isProjectLoading ? "프로젝트 불러오는 중..." : project?.name || "프로젝트"}
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
              onOpenCreateColumn={() => setIsColumnModalOpen(true)}
              updateTask={board.updateTask}
              deleteTask={board.deleteTask}
            />}
            {isAiLoading ? <div className="px-6 pb-2 text-sm text-primary">AI가 프로젝트를 분석하는 중...</div> : null}
            {aiMessage && !isAiLoading ? <div className="px-6 pb-2 text-sm text-emerald-300">{aiMessage}</div> : null}
            {aiError ? <div className="px-6 pb-2 text-sm text-red-300">{aiError}</div> : null}
            {projectError ? <div className="px-6 pb-2 text-sm text-red-300">{projectError}</div> : null}
            {board.error ? <div className="px-6 pb-2 text-sm text-red-300">{board.error}</div> : null}
          </div>
          <div className="hidden xl:flex xl:w-[340px] xl:flex-col xl:gap-3 xl:p-3">
            <MemberManagementPanel projectId={projectId} />
            <TeamChatPanel projectId={projectId} />
          </div>
        </div>
      </div>
      {isAiPromptOpen ? <AiTaskPromptModal isGenerating={isAiLoading} onClose={() => setIsAiPromptOpen(false)} onSubmit={handleGenerateAiTasks} /> : null}
      {isAiModalOpen ? <AiTaskPreviewModal tasks={aiTasks} isAdding={isAiAdding} onClose={() => setIsAiModalOpen(false)} onAddAll={handleAddAllAiTasks} /> : null}
      {isColumnModalOpen ? <ColumnCreateModal isCreating={isColumnCreating} onClose={() => setIsColumnModalOpen(false)} onCreate={handleCreateColumn} /> : null}
    </div>
  );
}
