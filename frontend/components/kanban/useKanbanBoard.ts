"use client";

import { useMemo, useState } from "react";
import { initialColumns, initialTasks } from "./mockData";
import { KanbanColumnType, Priority, Task } from "./types";

type DragMeta = { taskId: string; fromColumnId: string; fromIndex: number } | null;
type TaskInput = { title: string; description: string; priority: Priority; assignee: string; dueDate: string };

export function useKanbanBoard() {
  const [columns, setColumns] = useState<KanbanColumnType[]>(initialColumns);
  const [tasks, setTasks] = useState<Record<string, Task>>(initialTasks);
  const [dragMeta, setDragMeta] = useState<DragMeta>(null);
  const [dropColumnId, setDropColumnId] = useState<string | null>(null);

  const orderedColumns = useMemo(() => columns, [columns]);
  const startDrag = (taskId: string, fromColumnId: string, fromIndex: number) => setDragMeta({ taskId, fromColumnId, fromIndex });

  const moveTask = (targetColumnId: string, targetIndex?: number) => {
    if (!dragMeta) return;
    setColumns((prev) => {
      const next = prev.map((col) => ({ ...col, taskIds: [...col.taskIds] }));
      const source = next.find((c) => c.id === dragMeta.fromColumnId);
      const target = next.find((c) => c.id === targetColumnId);
      if (!source || !target) return prev;

      source.taskIds.splice(dragMeta.fromIndex, 1);
      let insertIndex = targetIndex ?? target.taskIds.length;
      if (source.id === target.id && typeof targetIndex === "number" && targetIndex > dragMeta.fromIndex) {
        insertIndex -= 1;
      }
      target.taskIds.splice(Math.max(0, insertIndex), 0, dragMeta.taskId);
      return next;
    });
    setDragMeta(null);
    setDropColumnId(null);
  };

  const createTask = (columnId: string, task: TaskInput) => {
    const id = `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newTask: Task = {
      ...task,
      id,
      progress: 0,
      comments: 0,
      attachments: 0,
      aiStatus: "AI 리뷰 대기",
      assigneeInitial: task.assignee.slice(0, 1) || "-"
    };
    setTasks((prev) => ({ ...prev, [id]: newTask }));
    setColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, taskIds: [...col.taskIds, id] } : col)));
  };

  const updateTask = (taskId: string, partial: Partial<Task>) => {
    setTasks((prev) => ({ ...prev, [taskId]: { ...prev[taskId], ...partial } }));
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => {
      const next = { ...prev };
      delete next[taskId];
      return next;
    });
    setColumns((prev) => prev.map((col) => ({ ...col, taskIds: col.taskIds.filter((id) => id !== taskId) })));
  };

  const addAiGeneratedTask = () => {
    const samples = ["API 응답 구조 검토", "실시간 동기화 예외 처리", "작업 우선순위 자동 분류 개선"];
    const title = samples[Math.floor(Math.random() * samples.length)];
    createTask("todo", { title, description: "AI 분석으로 생성된 추천 작업입니다.", priority: "높음", assignee: "AI 추천", dueDate: "2026.05.20" });
  };

  return { orderedColumns, tasks, dragMeta, dropColumnId, setDropColumnId, startDrag, moveTask, createTask, updateTask, deleteTask, addAiGeneratedTask };
}
