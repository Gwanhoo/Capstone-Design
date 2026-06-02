import { Sparkles, X } from "lucide-react";
import { AiGeneratedTask } from "@/lib/api/aiApi";

const priorityLabel: Record<AiGeneratedTask["priority"], string> = {
  urgent: "긴급",
  high: "높음",
  medium: "보통",
  low: "낮음",
};

const priorityTone: Record<AiGeneratedTask["priority"], string> = {
  urgent: "border-red-400/40 bg-red-500/10 text-red-200",
  high: "border-orange-400/40 bg-orange-500/10 text-orange-200",
  medium: "border-sky-400/40 bg-sky-500/10 text-sky-200",
  low: "border-slate-400/40 bg-slate-500/10 text-slate-200",
};

type Props = {
  tasks: AiGeneratedTask[];
  isAdding: boolean;
  onClose: () => void;
  onAddAll: () => void;
  selectedAgentType?: string | null;
  confidence?: number | null;
  reason?: string | null;
};

const formatConfidence = (confidence?: number | null) => {
  if (typeof confidence !== "number" || Number.isNaN(confidence)) return "-";
  return `${Math.round(confidence * 100)}%`;
};

export function AiTaskPreviewModal({ tasks, isAdding, onClose, onAddAll, selectedAgentType, confidence, reason }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-surface-container-high shadow-2xl">
        <div className="flex items-start justify-between border-b border-white/10 px-6 py-5">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" /> AI 작업 생성 결과
            </div>
            <h2 className="mt-2 text-xl font-bold text-on-surface">생성된 작업 {tasks.length}개</h2>
            <p className="mt-1 text-sm text-on-surface-variant">검토 후 Todo 컬럼에 한 번에 추가할 수 있습니다.</p>
            {selectedAgentType ? (
              <div className="mt-3 rounded-2xl border border-primary/20 bg-primary/10 px-3 py-2 text-xs text-on-surface-variant">
                <p className="font-semibold text-primary">선택 Agent: {selectedAgentType} · 신뢰도 {formatConfidence(confidence)}</p>
                {reason ? <p className="mt-1 leading-5">{reason}</p> : null}
              </div>
            ) : null}
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-on-surface-variant transition hover:bg-white/10 hover:text-on-surface" disabled={isAdding}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[55vh] space-y-3 overflow-y-auto px-6 py-5">
          {tasks.map((task, index) => (
            <div key={`${task.title}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-bold text-on-surface">{task.title}</h3>
                <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityTone[task.priority]}`}>
                  {priorityLabel[task.priority]}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">{task.description}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
          <p className="text-sm text-on-surface-variant">전체 추가 시 기존 Task 생성 API와 Socket 이벤트를 그대로 사용합니다.</p>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-on-surface-variant transition hover:bg-white/10" disabled={isAdding}>
              취소
            </button>
            <button onClick={onAddAll} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60" disabled={isAdding || tasks.length === 0}>
              {isAdding ? "추가 중..." : "전체 추가"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
