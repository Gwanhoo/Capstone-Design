"use client";

import { useMemo, useState } from "react";
import { PlusCircle } from "lucide-react";
import { initialColumns, initialTasks } from "./mockData";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanColumnType } from "./types";

export function KanbanBoard() {
  const [columns, setColumns] = useState<KanbanColumnType[]>(initialColumns);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const tasksById = initialTasks;

  const handleDropTask = (targetColumnId: string) => {
    if (!activeTaskId) return;

    setColumns((prev) => {
      const removed = prev.map((column) => ({ ...column, taskIds: column.taskIds.filter((id) => id !== activeTaskId) }));
      return removed.map((column) =>
        column.id === targetColumnId ? { ...column, taskIds: [...column.taskIds, activeTaskId] } : column
      );
    });
    setActiveTaskId(null);
  };

  const orderedColumns = useMemo(() => columns, [columns]);

  return (
    <div className="flex h-full gap-4 overflow-x-auto px-4 py-4 md:px-6">
      {orderedColumns.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          tasks={column.taskIds.map((taskId) => tasksById[taskId])}
          onDropTask={handleDropTask}
          onDragTask={setActiveTaskId}
          activeTaskId={activeTaskId}
        />
      ))}
      <button className="h-28 min-w-[280px] self-start rounded-2xl border border-dashed border-white/15 bg-white/[0.03] text-on-surface-variant transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary">
        <span className="flex flex-col items-center justify-center gap-2 text-sm font-semibold">
          <PlusCircle className="h-5 w-5" />새 열 추가
        </span>
      </button>
    </div>
  );
}
