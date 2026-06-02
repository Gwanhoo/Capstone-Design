"use client";

import { PencilLine, Trash2 } from "lucide-react";

export function TaskMenu({ onMemo, onDelete }: { onMemo?: () => void; onDelete: () => void }) {
  return (
    <div className="absolute right-0 top-7 z-20 min-w-[120px] rounded-xl border border-white/10 bg-surface-container-low p-1.5 shadow-2xl shadow-black/40">
      {onMemo ? (
        <button onClick={(event) => { event.stopPropagation(); onMemo(); }} className="flex w-full items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-left text-xs font-semibold text-on-surface-variant transition hover:bg-white/10 hover:text-on-surface">
          <PencilLine className="h-3.5 w-3.5" /> 메모
        </button>
      ) : null}
      <button onClick={(event) => { event.stopPropagation(); onDelete(); }} className="flex w-full items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-left text-xs font-semibold text-error transition hover:bg-error/10">
        <Trash2 className="h-3.5 w-3.5" /> 삭제
      </button>
    </div>
  );
}
