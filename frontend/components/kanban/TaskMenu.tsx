"use client";

import { CSSProperties, forwardRef } from "react";
import { PencilLine, Trash2 } from "lucide-react";

type Props = {
  onMemo?: () => void;
  onDelete: () => void;
  style?: CSSProperties;
};

export const TaskMenu = forwardRef<HTMLDivElement, Props>(function TaskMenu({ onMemo, onDelete, style }, ref) {
  return (
    <div
      ref={ref}
      style={style}
      onClick={(event) => event.stopPropagation()}
      className="z-[9999] min-w-[120px] rounded-xl border border-white/10 bg-[#1f1f23] p-1.5 shadow-2xl shadow-black/60 ring-1 ring-black/20"
    >
      {onMemo ? (
        <button onClick={(event) => { event.stopPropagation(); onMemo(); }} className="flex w-full items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-left text-xs font-semibold text-zinc-200 transition hover:bg-[#2a2a30] hover:text-white">
          <PencilLine className="h-3.5 w-3.5 shrink-0" /> <span className="whitespace-nowrap">메모</span>
        </button>
      ) : null}
      <button onClick={(event) => { event.stopPropagation(); onDelete(); }} className="flex w-full items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-left text-xs font-semibold text-red-300 transition hover:bg-[#2a2a30] hover:text-red-200">
        <Trash2 className="h-3.5 w-3.5 shrink-0" /> <span className="whitespace-nowrap">삭제</span>
      </button>
    </div>
  );
});
