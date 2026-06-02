"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Task } from "./types";

type Props = {
  task: Task;
  isSaving: boolean;
  onClose: () => void;
  onSave: (memo: string) => void;
};

export function TaskMemoModal({ task, isSaving, onClose, onSave }: Props) {
  const [memo, setMemo] = useState(task.memo ?? "");

  useEffect(() => {
    setMemo(task.memo ?? "");
  }, [task.id, task.memo]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSaving, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => { if (!isSaving) onClose(); }}>
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-surface-container-low p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-primary">카드 메모</p>
            <h3 className="mt-1 text-lg font-bold text-on-surface">{task.title}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-on-surface-variant transition hover:bg-white/10 hover:text-on-surface" disabled={isSaving} aria-label="메모 닫기">
            <X className="h-4 w-4" />
          </button>
        </div>
        <label className="mt-5 block text-sm font-semibold text-on-surface" htmlFor={`task-memo-${task.id}`}>메모</label>
        <textarea
          id={`task-memo-${task.id}`}
          value={memo}
          onChange={(event) => setMemo(event.target.value)}
          placeholder="이 카드에 필요한 메모를 입력하세요."
          className="mt-2 h-48 w-full resize-none rounded-xl border border-white/10 bg-surface-container-lowest px-3 py-3 text-sm leading-6 text-on-surface outline-none transition placeholder:text-on-surface-variant focus:border-primary/50"
          maxLength={5000}
        />
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-on-surface-variant">{memo.length}/5000</p>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-on-surface-variant transition hover:bg-white/10" disabled={isSaving}>취소</button>
            <button type="button" onClick={() => onSave(memo)} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSaving}>
              {isSaving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
