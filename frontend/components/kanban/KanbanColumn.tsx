import { Plus } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { KanbanColumnType, Task } from "./types";

const toneClass = {
  slate: "bg-outline",
  primary: "bg-primary",
  tertiary: "bg-tertiary"
};

type Props = {
  column: KanbanColumnType;
  tasks: Task[];
  onDropTask: (columnId: string) => void;
  onDragTask: (taskId: string) => void;
  activeTaskId: string | null;
};

export function KanbanColumn({ column, tasks, onDropTask, onDragTask, activeTaskId }: Props) {
  return (
    <section
      onDragOver={(event) => event.preventDefault()}
      onDrop={() => onDropTask(column.id)}
      className="w-[320px] min-w-[320px] rounded-2xl border border-white/10 bg-white/[0.04] p-3"
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${toneClass[column.tone]}`} />
          <h3 className="text-sm font-semibold text-on-surface">{column.title}</h3>
          <span className="rounded-md bg-surface-container-high px-2 py-0.5 text-[10px] text-on-surface-variant">{tasks.length}</span>
        </div>
        <button className="rounded-md p-1 text-outline transition hover:bg-white/10 hover:text-on-surface"><Plus className="h-4 w-4" /></button>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} draggable onDragStart={() => onDragTask(task.id)}>
            <TaskCard task={task} isDragging={activeTaskId === task.id} />
          </div>
        ))}
      </div>
    </section>
  );
}
