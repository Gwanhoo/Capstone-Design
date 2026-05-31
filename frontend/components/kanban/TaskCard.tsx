"use client";

import { useState } from "react";
import { CalendarDays, Ellipsis } from "lucide-react";
import { Task } from "./types";
import { TaskMenu } from "./TaskMenu";

const priorityTone = {
  긴급: "bg-primary-container/80 text-on-primary-container",
  높음: "bg-error-container/50 text-error",
  보통: "bg-tertiary-container/60 text-on-tertiary-container",
  낮음: "bg-surface-container-high text-on-surface-variant"
};

export function TaskCard({ task, isDragging = false, onClick, onDelete }: { task: Task; isDragging?: boolean; onClick: () => void; onDelete: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <article onClick={onClick} className={`relative rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg transition ${isDragging ? "scale-[1.02] border-primary/40 shadow-2xl" : "hover:border-primary/30 hover:shadow-lg"}`}>
      <div className="mb-3 flex items-center justify-between">
        <span className={`rounded-md px-2 py-1 text-[10px] font-bold ${priorityTone[task.priority]}`}>{task.priority}</span>
        <div className="relative">
          <button onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }} className="rounded-md p-1 text-outline hover:bg-white/10"><Ellipsis className="h-4 w-4" /></button>
          {menuOpen && <TaskMenu onDelete={() => { setMenuOpen(false); onDelete(); }} />}
        </div>
      </div>
      <h4 className="text-sm font-semibold text-on-surface">{task.title}</h4>
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-on-surface-variant">{task.description}</p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-container-high"><div className="h-full rounded-full bg-[linear-gradient(90deg,#4cd6ff_0%,#c3c0ff_100%)]" style={{ width: `${task.progress}%` }} /></div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-on-surface-variant"><span>{task.assignee} · {task.progress}%</span><span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{task.dueDate}</span></div>
      <p className="mt-2 text-[10px] text-primary">{task.aiStatus}</p>
    </article>
  );
}
