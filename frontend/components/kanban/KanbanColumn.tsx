"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { TaskForm } from "./TaskForm";
import { KanbanColumnType, Task } from "./types";

const toneClass = { slate: "bg-outline", primary: "bg-primary", tertiary: "bg-tertiary" };

type Props = {
  column: KanbanColumnType; tasks: Task[]; activeTaskId: string | null; isDropActive: boolean;
  onDropTask: (columnId: string, index?: number) => void; onDragTask: (taskId: string, columnId: string, index: number) => void;
  onOpenTask: (taskId: string) => void; onDeleteTask: (taskId: string) => void;
  onAddTask: (columnId: string, payload: { title: string; description: string; priority: any; assignee: string; dueDate: string }) => void;
  onSetDropActive: (columnId: string | null) => void;
};

export function KanbanColumn({ column, tasks, onDropTask, onDragTask, activeTaskId, isDropActive, onOpenTask, onDeleteTask, onAddTask, onSetDropActive }: Props) {
  const [adding, setAdding] = useState(false);
  return <section onDragOver={(e) => { e.preventDefault(); onSetDropActive(column.id); }} onDragLeave={() => onSetDropActive(null)} onDrop={() => onDropTask(column.id)} className={`w-[320px] min-w-[320px] rounded-2xl border p-3 ${isDropActive ? "border-primary/40 bg-primary/5" : "border-white/10 bg-white/[0.04]"}`}>
    <div className="mb-3 flex items-center justify-between px-1">
      <div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${toneClass[column.tone]}`} /><h3 className="text-sm font-semibold text-on-surface">{column.title}</h3><span className="rounded-md bg-surface-container-high px-2 py-0.5 text-[10px] text-on-surface-variant">{tasks.length}</span></div>
      <button onClick={() => setAdding((v) => !v)} className="rounded-md p-1 text-outline transition hover:bg-white/10 hover:text-on-surface"><Plus className="h-4 w-4" /></button>
    </div>
    {adding && <div className="mb-3 rounded-xl border border-white/10 bg-black/20 p-3"><TaskForm onCancel={() => setAdding(false)} onSubmit={(payload) => { onAddTask(column.id, payload); setAdding(false); }} /></div>}
    <div className="space-y-3">{tasks.map((task, index) => <div key={task.id} draggable onDragStart={() => onDragTask(task.id, column.id, index)} onDragOver={(e) => e.preventDefault()} onDrop={() => onDropTask(column.id, index)}><TaskCard task={task} isDragging={activeTaskId === task.id} onClick={() => onOpenTask(task.id)} onDelete={() => onDeleteTask(task.id)} /></div>)}</div>
  </section>;
}
