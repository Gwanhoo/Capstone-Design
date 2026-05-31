"use client";

import { PlusCircle } from "lucide-react";
import { KanbanColumnType, Task, TaskInput } from "./types";
import { KanbanColumn } from "./KanbanColumn";
import { TaskModal } from "./TaskModal";
import { useTaskModal } from "./useTaskModal";

type Props = {
  orderedColumns: KanbanColumnType[];
  tasks: Record<string, Task>;
  activeTaskId: string | null;
  dropColumnId: string | null;
  setDropColumnId: (id: string | null) => void;
  startDrag: (taskId: string, columnId: string, index: number) => void;
  moveTask: (columnId: string, index?: number) => void;
  createTask: (columnId: string, payload: TaskInput) => void;
  onOpenCreateColumn: () => void;
  updateTask: (taskId: string, partial: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
};

export function KanbanBoard(props: Props) {
  const { selectedTaskId, openTaskModal, closeTaskModal } = useTaskModal();
  const selectedTask = selectedTaskId ? props.tasks[selectedTaskId] : null;

  return (
    <>
      <div className="flex h-full gap-4 overflow-x-auto px-4 py-4 md:px-6">
        {props.orderedColumns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={column.taskIds.map((taskId) => props.tasks[taskId]).filter(Boolean)}
            onDropTask={props.moveTask}
            onDragTask={props.startDrag}
            activeTaskId={props.activeTaskId}
            isDropActive={props.dropColumnId === column.id}
            onSetDropActive={props.setDropColumnId}
            onOpenTask={openTaskModal}
            onDeleteTask={(taskId) => { if (confirm("정말 삭제하시겠습니까?")) props.deleteTask(taskId); }}
            onAddTask={props.createTask}
          />
        ))}
        <button onClick={props.onOpenCreateColumn} className="h-28 min-w-[280px] self-start rounded-2xl border border-dashed border-white/15 bg-white/[0.03] text-on-surface-variant transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"><span className="flex flex-col items-center justify-center gap-2 text-sm font-semibold"><PlusCircle className="h-5 w-5" />새 열 추가</span></button>
      </div>
      {selectedTask && <TaskModal task={selectedTask} onClose={closeTaskModal} onSave={(data) => { props.updateTask(selectedTask.id, data); closeTaskModal(); }} />}
    </>
  );
}
