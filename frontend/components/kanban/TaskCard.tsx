"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, Ellipsis, StickyNote } from "lucide-react";
import { Task } from "./types";
import { TaskMenu } from "./TaskMenu";

const priorityTone = {
  긴급: "bg-primary-container/80 text-on-primary-container",
  높음: "bg-error-container/50 text-error",
  보통: "bg-tertiary-container/60 text-on-tertiary-container",
  낮음: "bg-surface-container-high text-on-surface-variant"
};

type Props = {
  task: Task;
  isDragging?: boolean;
  onClick: () => void;
  onMemo?: () => void;
  onDelete: () => void;
};

export function TaskCard({ task, isDragging = false, onClick, onMemo, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [menuOpen]);

  return (
    <article onClick={onClick} className={`relative rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-lg transition ${isDragging ? "scale-[1.02] border-primary/40 shadow-2xl" : "hover:border-primary/30 hover:shadow-lg"}`}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`rounded-md px-2 py-1 text-[10px] font-bold ${priorityTone[task.priority]}`}>{task.priority}</span>
          {task.memo ? <StickyNote className="h-3.5 w-3.5 text-primary" aria-label="메모 있음" /> : null}
        </div>
        <div ref={menuRef} className="relative">
          <button onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }} className="rounded-md p-1 text-outline hover:bg-white/10" aria-label={`${task.title} 카드 메뉴 열기`}><Ellipsis className="h-4 w-4" /></button>
          {menuOpen && <TaskMenu onMemo={onMemo ? () => { setMenuOpen(false); onMemo(); } : undefined} onDelete={() => { setMenuOpen(false); onDelete(); }} />}
        </div>
      </div>
      <h4 className="line-clamp-2 text-[13px] font-semibold leading-snug text-on-surface">{task.title}</h4>
      <p className="mt-1 line-clamp-1 text-[11px] leading-relaxed text-on-surface-variant">{task.description}</p>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-container-high"><div className="h-full rounded-full bg-[linear-gradient(90deg,#4cd6ff_0%,#c3c0ff_100%)]" style={{ width: `${task.progress}%` }} /></div>
      <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-on-surface-variant"><span>{task.assignee} · {task.progress}%</span><span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{task.dueDate}</span></div>
      <p className="mt-1 truncate text-[10px] text-primary">{task.aiStatus}</p>
    </article>
  );
}
