"use client";

export function TaskMenu({ onDelete }: { onDelete: () => void }) {
  return (
    <div className="absolute right-0 top-6 z-20 rounded-lg border border-white/10 bg-surface-container-low p-1 shadow-xl">
      <button onClick={onDelete} className="block w-full rounded-md px-3 py-1.5 text-left text-xs text-error hover:bg-white/10">삭제</button>
    </div>
  );
}
