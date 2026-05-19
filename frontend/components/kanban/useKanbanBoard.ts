"use client";

import { useEffect, useMemo, useState } from "react";
import { initialColumns } from "./mockData";
import { KanbanColumnType, Task, TaskInput } from "./types";
import { createTask as createTaskApi, deleteTask as deleteTaskApi, getTasksByProject, moveTask as moveTaskApi, updateTask as updateTaskApi } from "@/lib/api/taskApi";
import { connectSocket, disconnectSocket } from "@/lib/socket/client";

type DragMeta = { taskId: string; fromColumnId: string; fromIndex: number } | null;

type BackendPriority = "urgent" | "high" | "medium" | "low";
type SocketTask = { _id: string; projectId: string; columnId: string; title: string; description: string; priority: BackendPriority; assignee: string; progress: number; dueDate: string | null; aiStatus: string; order: number; createdAt: string; updatedAt: string };

const priorityToFrontend: Record<BackendPriority, Task["priority"]> = { urgent: "긴급", high: "높음", medium: "보통", low: "낮음" };
const formatDueDate = (value: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10).replaceAll("-", ".");
};
const mapSocketTask = (task: SocketTask): Task => ({
  id: task._id,
  columnId: task.columnId,
  order: task.order,
  title: task.title,
  description: task.description,
  assignee: task.assignee,
  assigneeInitial: task.assignee.slice(0, 2) || "-",
  progress: task.progress,
  comments: 0,
  attachments: 0,
  dueDate: formatDueDate(task.dueDate),
  aiStatus: task.aiStatus,
  priority: priorityToFrontend[task.priority] ?? "보통",
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

export function useKanbanBoard(projectId: string) {
  const [columns, setColumns] = useState<KanbanColumnType[]>(initialColumns);
  const [tasks, setTasks] = useState<Record<string, Task>>({});
  const [dragMeta, setDragMeta] = useState<DragMeta>(null);
  const [dropColumnId, setDropColumnId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedTasks = await getTasksByProject(projectId);
        const nextTasks: Record<string, Task> = {};
        const columnMap: Record<string, string[]> = { todo: [], "in-progress": [], done: [] };

        fetchedTasks.forEach((task) => {
          nextTasks[task.id] = task;
          if (!columnMap[task.columnId]) columnMap.todo.push(task.id);
          else columnMap[task.columnId].push(task.id);
        });

        setTasks(nextTasks);
        setColumns((prev) =>
          prev.map((col) => ({ ...col, taskIds: (columnMap[col.id] ?? []).sort((a, b) => (nextTasks[a]?.order ?? 0) - (nextTasks[b]?.order ?? 0)) })),
        );
      } catch (loadError) {
        console.error(loadError);
        setError("작업 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [projectId]);

  useEffect(() => {
    const socket = connectSocket();

    socket.emit("join-project", { projectId }, (response: { ok: boolean; message?: string }) => {
      if (!response?.ok) {
        setError(response?.message ?? "실시간 동기화 연결에 실패했습니다.");
      }
    });

    const handleCreated = (raw: SocketTask) => {
      const task = mapSocketTask(raw);
      setTasks((prev) => {
        if (prev[task.id]) return { ...prev, [task.id]: { ...prev[task.id], ...task } };
        return { ...prev, [task.id]: task };
      });
      setColumns((prev) => prev.map((col) => {
        if (col.id !== task.columnId) return col;
        if (col.taskIds.includes(task.id)) return col;
        return { ...col, taskIds: [...col.taskIds, task.id] };
      }));
    };

    const handleUpdated = (raw: SocketTask) => {
      const task = mapSocketTask(raw);
      setTasks((prev) => ({ ...prev, [task.id]: { ...prev[task.id], ...task } }));
    };

    const handleDeleted = ({ taskId }: { taskId: string }) => {
      setTasks((prev) => {
        if (!prev[taskId]) return prev;
        const next = { ...prev };
        delete next[taskId];
        return next;
      });
      setColumns((prev) => prev.map((col) => ({ ...col, taskIds: col.taskIds.filter((id) => id !== taskId) })));
    };

    const handleMoved = (raw: SocketTask) => {
      const task = mapSocketTask(raw);
      setTasks((prev) => ({ ...prev, [task.id]: { ...prev[task.id], ...task } }));
      setColumns((prev) => {
        const removed = prev.map((col) => ({ ...col, taskIds: col.taskIds.filter((id) => id !== task.id) }));
        return removed.map((col) => {
          if (col.id !== task.columnId) return col;
          const ids = [...col.taskIds];
          const idx = Math.max(0, Math.min(task.order, ids.length));
          ids.splice(idx, 0, task.id);
          return { ...col, taskIds: ids };
        });
      });
    };

    socket.on("task:created", handleCreated);
    socket.on("task:updated", handleUpdated);
    socket.on("task:deleted", handleDeleted);
    socket.on("task:moved", handleMoved);

    return () => {
      socket.emit("leave-project", { projectId });
      socket.off("task:created", handleCreated);
      socket.off("task:updated", handleUpdated);
      socket.off("task:deleted", handleDeleted);
      socket.off("task:moved", handleMoved);
      disconnectSocket();
    };
  }, [projectId]);

  const orderedColumns = useMemo(() => columns, [columns]);
  const startDrag = (taskId: string, fromColumnId: string, fromIndex: number) => setDragMeta({ taskId, fromColumnId, fromIndex });

  const moveTask = async (targetColumnId: string, targetIndex?: number) => {
    if (!dragMeta) return;

    let movedTaskId = dragMeta.taskId;
    let movedOrder = targetIndex ?? 0;

    setColumns((prev) => {
      const next = prev.map((col) => ({ ...col, taskIds: [...col.taskIds] }));
      const source = next.find((c) => c.id === dragMeta.fromColumnId);
      const target = next.find((c) => c.id === targetColumnId);
      if (!source || !target) return prev;
      source.taskIds.splice(dragMeta.fromIndex, 1);
      let insertIndex = targetIndex ?? target.taskIds.length;
      if (source.id === target.id && typeof targetIndex === "number" && targetIndex > dragMeta.fromIndex) insertIndex -= 1;
      movedOrder = Math.max(0, insertIndex);
      target.taskIds.splice(movedOrder, 0, dragMeta.taskId);
      return next;
    });

    setTasks((prev) => ({ ...prev, [movedTaskId]: { ...prev[movedTaskId], columnId: targetColumnId, order: movedOrder } }));
    setDragMeta(null);
    setDropColumnId(null);

    try {
      const moved = await moveTaskApi(movedTaskId, { columnId: targetColumnId, order: movedOrder });
      setTasks((prev) => ({ ...prev, [movedTaskId]: { ...prev[movedTaskId], ...moved } }));
    } catch (moveError) {
      console.error(moveError);
      setError("카드 이동 반영에 실패했습니다.");
    }
  };

  const createTask = async (columnId: string, task: TaskInput) => {
    try {
      setError(null);
      const column = columns.find((col) => col.id === columnId);
      const created = await createTaskApi(projectId, { ...task, columnId, order: column?.taskIds.length ?? 0 });
      setTasks((prev) => ({ ...prev, [created.id]: created }));
      setColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, taskIds: [...col.taskIds, created.id] } : col)));
    } catch (createError) {
      console.error(createError);
      setError("카드 생성에 실패했습니다.");
    }
  };

  const updateTask = async (taskId: string, partial: Partial<Task>) => {
    setTasks((prev) => ({ ...prev, [taskId]: { ...prev[taskId], ...partial } }));
    try {
      const updated = await updateTaskApi(taskId, partial);
      setTasks((prev) => ({ ...prev, [taskId]: { ...prev[taskId], ...updated } }));
    } catch (updateError) {
      console.error(updateError);
      setError("카드 수정에 실패했습니다.");
    }
  };

  const deleteTask = async (taskId: string) => {
    const prevTasks = tasks;
    const prevColumns = columns;
    setTasks((current) => {
      const next = { ...current };
      delete next[taskId];
      return next;
    });
    setColumns((current) => current.map((col) => ({ ...col, taskIds: col.taskIds.filter((id) => id !== taskId) })));

    try {
      await deleteTaskApi(taskId);
    } catch (deleteError) {
      console.error(deleteError);
      setError("카드 삭제에 실패했습니다.");
      setTasks(prevTasks);
      setColumns(prevColumns);
    }
  };

  const addAiGeneratedTask = async () => {
    const samples = ["API 응답 구조 검토", "실시간 동기화 예외 처리", "작업 우선순위 자동 분류 개선"];
    const title = samples[Math.floor(Math.random() * samples.length)];
    await createTask("todo", { title, description: "AI 분석으로 생성된 추천 작업입니다.", priority: "높음", assignee: "AI 추천", dueDate: "2026.05.20" });
  };

  return { orderedColumns, tasks, dragMeta, dropColumnId, setDropColumnId, startDrag, moveTask, createTask, updateTask, deleteTask, addAiGeneratedTask, isLoading, error };
}
