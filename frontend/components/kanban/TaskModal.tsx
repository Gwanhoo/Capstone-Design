"use client";

import { useEffect, useState } from "react";
import { Task } from "./types";
import { TaskForm } from "./TaskForm";

export function TaskModal({ task, onClose, onSave }: { task: Task; onClose: () => void; onSave: (data: Partial<Task>) => void }) {
  const [progress, setProgress] = useState(task.progress);
  const [aiStatus, setAiStatus] = useState(task.aiStatus);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-surface-container-low p-5" onClick={(event) => event.stopPropagation()}>
        <h3 className="mb-3 text-lg font-semibold">작업 상세 편집</h3>
        <TaskForm
          initial={{ title: task.title, description: task.description, priority: task.priority, assignee: task.assignee, dueDate: task.dueDate }}
          onCancel={onClose}
          onSubmit={(payload) => onSave({ ...payload, progress, aiStatus })}
        />
        <div className="mt-3 grid grid-cols-2 gap-2">
          <input type="number" min={0} max={100} value={progress} onChange={(event) => setProgress(Number(event.target.value))} placeholder="진행률" className="h-10 rounded-lg border border-white/10 bg-surface-container-lowest px-3 text-sm" />
          <input value={aiStatus} onChange={(event) => setAiStatus(event.target.value)} placeholder="AI 상태" className="h-10 rounded-lg border border-white/10 bg-surface-container-lowest px-3 text-sm" />
        </div>
      </div>
    </div>
  );
}
