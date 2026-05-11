import { FolderOpen, Plus } from "lucide-react";

export function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-primary">
        <FolderOpen className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-on-surface">아직 프로젝트가 없습니다</h3>
      <p className="mt-2 text-sm text-on-surface-variant">새 프로젝트를 생성하고 AI 기반 협업을 시작해 보세요.</p>
      <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] px-5 py-2.5 font-semibold text-[#1d00a5]">
        <Plus className="h-4 w-4" />
        새 프로젝트 생성
      </button>
    </div>
  );
}
