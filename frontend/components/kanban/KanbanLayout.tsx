"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquareText, X } from "lucide-react";
import { getProjectById, Project } from "@/lib/api/projectApi";
import { AiGeneratedTask, BoardAnalysisResult, analyzeProjectBoard, decomposeProjectTasks } from "@/lib/api/aiApi";
import { KanbanBoard } from "./KanbanBoard";
import { KanbanHeader } from "./KanbanHeader";
import { ProjectSidebar } from "./ProjectSidebar";
import { TeamChatPanel } from "./TeamChatPanel";
import { MemberManagementPanel } from "./MemberManagementPanel";
import { useKanbanBoard } from "./useKanbanBoard";
import { AiTaskPreviewModal } from "./AiTaskPreviewModal";
import { AiTaskPromptModal } from "./AiTaskPromptModal";
import { ColumnCreateModal } from "./ColumnCreateModal";
import { ProjectProgressBar } from "./ProjectProgressBar";
import { BoardAnalysisPanel } from "./BoardAnalysisPanel";

const priorityToFrontend: Record<AiGeneratedTask["priority"], "긴급" | "높음" | "보통" | "낮음"> = {
  urgent: "긴급",
  high: "높음",
  medium: "보통",
  low: "낮음",
};

const doneColumnTitles = new Set(["완료", "done", "끝", "완료됨"]);

const isDoneColumnTitle = (title: string) => doneColumnTitles.has(title.trim().toLowerCase());

export function KanbanLayout({ projectId }: { projectId: string }) {
  const router = useRouter();
  const board = useKanbanBoard(projectId);
  const [project, setProject] = useState<Project | null>(null);
  const [isProjectLoading, setIsProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [aiTasks, setAiTasks] = useState<AiGeneratedTask[]>([]);
  const [aiAgentInfo, setAiAgentInfo] = useState<{ selectedAgentType: string; confidence: number; reason: string } | null>(null);
  const [isAiPromptOpen, setIsAiPromptOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isColumnCreating, setIsColumnCreating] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiAdding, setIsAiAdding] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [isBoardAnalysisOpen, setIsBoardAnalysisOpen] = useState(false);
  const [isBoardAnalyzing, setIsBoardAnalyzing] = useState(false);
  const [boardAnalysis, setBoardAnalysis] = useState<BoardAnalysisResult | null>(null);
  const [boardAnalysisError, setBoardAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    const onProjectDeleted = (event: Event) => {
      const deletedProjectId = (event as CustomEvent<{ projectId: string }>).detail?.projectId;
      if (deletedProjectId === projectId) router.replace("/dashboard/projects");
    };

    window.addEventListener("project:deleted", onProjectDeleted);
    return () => window.removeEventListener("project:deleted", onProjectDeleted);
  }, [projectId, router]);

  useEffect(() => {
    const onProjectDeleted = (event: Event) => {
      const deletedProjectId = (event as CustomEvent<{ projectId: string }>).detail?.projectId;
      if (deletedProjectId === projectId) router.replace("/dashboard/projects");
    };

    window.addEventListener("project:deleted", onProjectDeleted);
    return () => window.removeEventListener("project:deleted", onProjectDeleted);
  }, [projectId, router]);

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

  const progress = useMemo(() => {
    const totalCount = Object.keys(board.tasks).length;
    const doneColumnIds = new Set(board.orderedColumns.filter((column) => isDoneColumnTitle(column.title)).map((column) => column.id));
    const doneCount = Object.values(board.tasks).filter((task) => doneColumnIds.has(task.columnId)).length;
    const percent = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

    return { totalCount, doneCount, percent };
  }, [board.orderedColumns, board.tasks]);

  const handleAnalyzeBoard = async () => {
    try {
      setIsBoardAnalysisOpen(true);
      setIsBoardAnalyzing(true);
      setBoardAnalysisError(null);
      const result = await analyzeProjectBoard(projectId);
      setBoardAnalysis(result);
    } catch (error) {
      console.error(error);
      setBoardAnalysisError("AI 보드 분석에 실패했습니다.");
    } finally {
      setIsBoardAnalyzing(false);
    }
  };

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
      setAiAgentInfo({
        selectedAgentType: result.selectedAgentType,
        confidence: result.confidence,
        reason: result.reason,
      });
      setIsAiPromptOpen(false);
      setIsAiModalOpen(true);
      setAiMessage(`${result.selectedAgentType} Agent가 AI 작업 ${result.tasks.length}개를 생성했습니다.`);
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
      setAiAgentInfo(null);
    } catch (error) {
      console.error(error);
      setAiError("AI 작업 생성 실패");
    } finally {
      setIsAiAdding(false);
    }
  };

  return (
    <div className="flex h-screen bg-surface text-on-surface">
      <ProjectSidebar projectId={projectId} projectName={project?.name} onAnalyzeBoard={handleAnalyzeBoard} isAnalyzingBoard={isBoardAnalyzing} />
      <div className="flex min-w-0 flex-1 flex-col">
        <KanbanHeader
          onGenerateAiTask={() => setIsAiPromptOpen(true)}
          isGeneratingAiTask={isAiLoading}
          projectName={isProjectLoading ? "프로젝트 불러오는 중..." : project?.name || "프로젝트"}
        />
        <div className="relative flex min-h-0 flex-1 overflow-hidden">
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            {!board.isLoading ? <ProjectProgressBar percent={progress.percent} doneCount={progress.doneCount} totalCount={progress.totalCount} /> : null}
            <div className="min-h-0 flex-1 overflow-hidden">
            {board.isLoading ? <div className="px-4 py-4 text-sm text-on-surface-variant">작업을 불러오는 중...</div> : <KanbanBoard
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
              updateTaskMemo={board.updateTaskMemo}
              deleteTask={board.deleteTask}
            />}
            </div>
            <div className="pointer-events-none absolute bottom-4 left-4 z-10 space-y-1">
              {isAiLoading ? <div className="pointer-events-auto rounded-lg border border-primary/20 bg-surface-container-high/95 px-3 py-2 text-xs text-primary shadow-lg">AI가 프로젝트를 분석하는 중...</div> : null}
              {isBoardAnalyzing ? <div className="pointer-events-auto rounded-lg border border-primary/20 bg-surface-container-high/95 px-3 py-2 text-xs text-primary shadow-lg">AI가 보드를 분석하는 중...</div> : null}
              {aiMessage && !isAiLoading ? <div className="pointer-events-auto rounded-lg border border-emerald-400/20 bg-surface-container-high/95 px-3 py-2 text-xs text-emerald-300 shadow-lg">{aiMessage}</div> : null}
              {aiError ? <div className="pointer-events-auto rounded-lg border border-red-400/20 bg-surface-container-high/95 px-3 py-2 text-xs text-red-300 shadow-lg">{aiError}</div> : null}
              {projectError ? <div className="pointer-events-auto rounded-lg border border-red-400/20 bg-surface-container-high/95 px-3 py-2 text-xs text-red-300 shadow-lg">{projectError}</div> : null}
              {board.error ? <div className="pointer-events-auto rounded-lg border border-red-400/20 bg-surface-container-high/95 px-3 py-2 text-xs text-red-300 shadow-lg">{board.error}</div> : null}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsChatDrawerOpen(true)}
            className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/15 bg-surface-container-high/95 px-4 py-2 text-sm font-semibold text-on-surface shadow-2xl shadow-black/30 backdrop-blur-xl transition hover:border-primary/40 hover:text-primary"
          >
            <MessageSquareText className="h-4 w-4" />
            팀 채팅
          </button>

          {isBoardAnalysisOpen ? <BoardAnalysisPanel result={boardAnalysis} isLoading={isBoardAnalyzing} error={boardAnalysisError} onClose={() => setIsBoardAnalysisOpen(false)} /> : null}

          {isChatDrawerOpen ? (
            <div className="absolute inset-0 z-30 flex justify-end bg-black/35 backdrop-blur-[2px]" onClick={() => setIsChatDrawerOpen(false)}>
              <aside
                className="flex h-full w-full max-w-[380px] flex-col border-l border-white/10 bg-surface-container-low/95 shadow-2xl shadow-black/50"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4">
                  <div>
                    <h2 className="text-sm font-bold text-on-surface">협업 패널</h2>
                    <p className="text-[11px] text-on-surface-variant">필요할 때 열어 쓰는 채팅·멤버 도구</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsChatDrawerOpen(false)}
                    className="rounded-lg p-2 text-on-surface-variant transition hover:bg-white/10 hover:text-on-surface"
                    aria-label="협업 패널 닫기"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
                  <div className="shrink-0">
                    <MemberManagementPanel projectId={projectId} />
                  </div>
                  <TeamChatPanel projectId={projectId} className="min-h-0 flex-1" />
                </div>
              </aside>
            </div>
          ) : null}
        </div>
      </div>
      {isAiPromptOpen ? <AiTaskPromptModal isGenerating={isAiLoading} onClose={() => setIsAiPromptOpen(false)} onSubmit={handleGenerateAiTasks} /> : null}
      {isAiModalOpen ? <AiTaskPreviewModal tasks={aiTasks} isAdding={isAiAdding} onClose={() => setIsAiModalOpen(false)} onAddAll={handleAddAllAiTasks} selectedAgentType={aiAgentInfo?.selectedAgentType} confidence={aiAgentInfo?.confidence} reason={aiAgentInfo?.reason} /> : null}
      {isColumnModalOpen ? <ColumnCreateModal isCreating={isColumnCreating} onClose={() => setIsColumnModalOpen(false)} onCreate={handleCreateColumn} /> : null}
    </div>
  );
}
