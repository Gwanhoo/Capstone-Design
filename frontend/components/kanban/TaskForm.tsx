import { FormEvent, useState } from "react";
import { Priority } from "./types";

type Props = {
  onSubmit: (payload: { title: string; description: string; priority: Priority; assignee: string; dueDate: string }) => void;
  onCancel: () => void;
  initial?: { title: string; description: string; priority: Priority; assignee: string; dueDate: string };
};

export function TaskForm({ onSubmit, onCancel, initial }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? "보통");
  const [assignee, setAssignee] = useState(initial?.assignee ?? "");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({ title, description, priority, assignee, dueDate });
  };

  return <form onSubmit={handleSubmit} className="space-y-3">
    <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" className="h-10 w-full rounded-lg border border-white/10 bg-surface-container-lowest px-3 text-sm" />
    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="설명" rows={3} className="w-full rounded-lg border border-white/10 bg-surface-container-lowest px-3 py-2 text-sm" />
    <div className="grid grid-cols-2 gap-2">
      <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="h-10 rounded-lg border border-white/10 bg-surface-container-lowest px-3 text-sm"><option>긴급</option><option>높음</option><option>보통</option><option>낮음</option></select>
      <input value={assignee} onChange={(e) => setAssignee(e.target.value)} placeholder="담당자" className="h-10 rounded-lg border border-white/10 bg-surface-container-lowest px-3 text-sm" />
    </div>
    <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} placeholder="마감일 (YYYY.MM.DD)" className="h-10 w-full rounded-lg border border-white/10 bg-surface-container-lowest px-3 text-sm" />
    <div className="flex justify-end gap-2"><button type="button" onClick={onCancel} className="rounded-lg px-3 py-2 text-sm text-on-surface-variant">취소</button><button type="submit" className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-on-primary">저장</button></div>
  </form>;
}
