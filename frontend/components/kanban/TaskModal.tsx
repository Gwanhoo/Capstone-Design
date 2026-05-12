"use client";

import { Task } from "./types";
import { TaskForm } from "./TaskForm";

export function TaskModal({ task, onClose, onSave }: { task: Task; onClose: () => void; onSave: (data: Partial<Task>) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-surface-container-low p-5">
        <h3 className="mb-3 text-lg font-semibold">작업 상세 편집</h3>
        <TaskForm
          initial={{ title: task.title, description: task.description, priority: task.priority, assignee: task.assignee, dueDate: task.dueDate }}
          onCancel={onClose}
          onSubmit={(payload) => onSave({ ...payload })}
        />
      </div>
    </div>
  );
}
