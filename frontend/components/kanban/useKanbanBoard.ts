"use client";

import { useEffect, useMemo, useState } from "react";
import { KanbanColumnType, Task, TaskInput } from "./types";
import { createTask as createTaskApi, deleteTask as deleteTaskApi, getTasksByProject, moveTask as moveTaskApi, updateTask as updateTaskApi } from "@/lib/api/taskApi";
import { createProjectColumn, getProjectColumns, ProjectColumn } from "@/lib/api/projectApi";
import { connectSocket, disconnectSocket } from "@/lib/socket/client";

type DragMeta = { taskId: string; fromColumnId: string; fromIndex: number } | null;

type BackendPriority = "urgent" | "high" | "medium" | "low";
type SocketTask = { _id: string; projectId: string; columnId: string; title: string; description: string; priority: BackendPriority; assignee: string; progress: number; dueDate: string | null; aiStatus: string; order: number; createdAt: string; updatedAt: string };

const priorityToFrontend: Record<BackendPriority, Task["priority"]> = { urgent: "긴급", high: "높음", medium: "보통", low: "낮음" };
const toneByIndex: KanbanColumnType["tone"][] = ["slate", "primary", "tertiary"];

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

const mapColumn = (column: ProjectColumn, index: number): KanbanColumnType => ({
  id: column.id,
  title: column.title,
  tone: toneByIndex[index % toneByIndex.length],
  taskIds: [],
});

const uniqueTaskIds = (taskIds: string[]) => Array.from(new Set(taskIds));

const insertTaskIntoColumns = (columns: KanbanColumnType[], taskId: string, targetColumnId: string, targetIndex?: number) => {
  const withoutTask = columns.map((column) => ({ ...column, taskIds: column.taskIds.filter((id) => id !== taskId) }));
  return withoutTask.map((column) => {
    if (column.id !== targetColumnId) return column;
    const ids = uniqueTaskIds(column.taskIds);
    const index = Math.max(0, Math.min(targetIndex ?? ids.length, ids.length));
    ids.splice(index, 0, taskId);
    return { ...column, taskIds: uniqueTaskIds(ids) };
  });
};

const mergeTasksIntoColumns = (columns: KanbanColumnType[], tasks: Record<string, Task>) => {
  const columnIds = new Set(columns.map((column) => column.id));
  const columnMap = columns.reduce<Record<string, string[]>>((acc, column) => ({ ...acc, [column.id]: [] }), {});

  Object.values(tasks).forEach((task) => {
    const columnId = columnIds.has(task.columnId) ? task.columnId : "todo";
    if (!columnMap[columnId]) columnMap[columnId] = [];
    columnMap[columnId].push(task.id);
  });

  return columns.map((column) => ({
    ...column,
    taskIds: uniqueTaskIds(columnMap[column.id] ?? []).sort((a, b) => (tasks[a]?.order ?? 0) - (tasks[b]?.order ?? 0)),
  }));
};

export function useKanbanBoard(projectId: string) {
  const [columns, setColumns] = useState<KanbanColumnType[]>([]);
  const [tasks, setTasks] = useState<Record<string, Task>>({});
  const [dragMeta, setDragMeta] = useState<DragMeta>(null);
  const [dropColumnId, setDropColumnId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBoard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [fetchedColumns, fetchedTasks] = await Promise.all([getProjectColumns(projectId), getTasksByProject(projectId)]);
        const nextTasks = fetchedTasks.reduce<Record<string, Task>>((acc, task) => ({ ...acc, [task.id]: task }), {});
        const nextColumns = fetchedColumns.map(mapColumn);

        setTasks(nextTasks);
        setColumns(mergeTasksIntoColumns(nextColumns, nextTasks));
      } catch (loadError) {
        console.error(loadError);
        setError("보드 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadBoard();
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
      setTasks((prev) => ({ ...prev, [task.id]: { ...prev[task.id], ...task } }));
      setColumns((prev) => insertTaskIntoColumns(prev, task.id, task.columnId, task.order));
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
      setColumns((prev) => insertTaskIntoColumns(prev, task.id, task.columnId, task.order));
    };

    const handleColumnCreated = (column: ProjectColumn) => {
      setColumns((prev) => {
        if (prev.some((item) => item.id === column.id)) return prev;
        return [...prev, mapColumn(column, prev.length)];
      });
    };

    const handleColumnUpdated = (column: ProjectColumn) => {
      setColumns((prev) => prev.map((item, index) => (item.id === column.id ? { ...mapColumn(column, index), taskIds: item.taskIds } : item)));
    };

    const handleColumnDeleted = ({ columnId }: { columnId: string }) => {
      setColumns((prev) => prev.filter((column) => column.id !== columnId));
    };

    socket.on("task:created", handleCreated);
    socket.on("task:updated", handleUpdated);
    socket.on("task:deleted", handleDeleted);
    socket.on("task:moved", handleMoved);
    socket.on("column:created", handleColumnCreated);
    socket.on("column:updated", handleColumnUpdated);
    socket.on("column:deleted", handleColumnDeleted);

    return () => {
      socket.emit("leave-project", { projectId });
      socket.off("task:created", handleCreated);
      socket.off("task:updated", handleUpdated);
      socket.off("task:deleted", handleDeleted);
      socket.off("task:moved", handleMoved);
      socket.off("column:created", handleColumnCreated);
      socket.off("column:updated", handleColumnUpdated);
      socket.off("column:deleted", handleColumnDeleted);
      disconnectSocket();
    };
  }, [projectId]);

  const orderedColumns = useMemo(() => columns, [columns]);
  const startDrag = (taskId: string, fromColumnId: string, fromIndex: number) => setDragMeta({ taskId, fromColumnId, fromIndex });

  const moveTask = async (targetColumnId: string, targetIndex?: number) => {
    if (!dragMeta) return;

    const movedTaskId = dragMeta.taskId;
    const target = columns.find((column) => column.id === targetColumnId);
    const source = columns.find((column) => column.id === dragMeta.fromColumnId);
    const targetIdsWithoutTask = target?.taskIds.filter((id) => id !== movedTaskId) ?? [];
    let insertIndex = targetIndex ?? targetIdsWithoutTask.length;
    if (source?.id === target?.id && typeof targetIndex === "number" && targetIndex > dragMeta.fromIndex) insertIndex -= 1;
    const movedOrder = Math.max(0, Math.min(insertIndex, targetIdsWithoutTask.length));

    setColumns((prev) => insertTaskIntoColumns(prev, movedTaskId, targetColumnId, movedOrder));

    setTasks((prev) => ({ ...prev, [movedTaskId]: { ...prev[movedTaskId], columnId: targetColumnId, order: movedOrder } }));
    setDragMeta(null);
    setDropColumnId(null);

    try {
      const moved = await moveTaskApi(movedTaskId, { columnId: targetColumnId, order: movedOrder });
      setTasks((prev) => ({ ...prev, [movedTaskId]: { ...prev[movedTaskId], ...moved } }));
      setColumns((prev) => insertTaskIntoColumns(prev, movedTaskId, moved.columnId, moved.order));
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
      setColumns((prev) => insertTaskIntoColumns(prev, created.id, columnId));
    } catch (createError) {
      console.error(createError);
      setError("카드 생성에 실패했습니다.");
      throw createError;
    }
  };

  const createColumn = async (title: string) => {
    try {
      setError(null);
      const created = await createProjectColumn(projectId, title);
      setColumns((prev) => {
        if (prev.some((column) => column.id === created.id)) return prev;
        return [...prev, mapColumn(created, prev.length)];
      });
    } catch (createError) {
      console.error(createError);
      setError("열 생성에 실패했습니다.");
      throw createError;
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

  return { orderedColumns, tasks, dragMeta, dropColumnId, setDropColumnId, startDrag, moveTask, createTask, createColumn, updateTask, deleteTask, isLoading, error };
}
