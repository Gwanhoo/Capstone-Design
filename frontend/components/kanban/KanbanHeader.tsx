import { Bell, Settings, Sparkles } from "lucide-react";

const members = ["LM", "KD", "PS", "JM"];

export function KanbanHeader({
  onGenerateAiTask,
  projectName,
  isGeneratingAiTask,
}: {
  onGenerateAiTask: () => void;
  projectName: string;
  isGeneratingAiTask?: boolean;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-surface/70 px-4 backdrop-blur-xl md:px-6">
      <div><h1 className="text-base font-bold text-on-surface md:text-lg">{projectName} · 메인 보드</h1><p className="text-xs text-on-surface-variant">실시간 태스크 흐름 · Sprint 12</p></div>
      <div className="flex items-center gap-3">
        <div className="hidden -space-x-2 sm:flex">{members.map((m, i) => <div key={m} className="flex h-8 w-8 items-center justify-center rounded-full border border-surface bg-white/10 text-[10px] font-bold text-on-surface" style={{ opacity: 1 - i * 0.12 }}>{m}</div>)}<div className="flex h-8 w-8 items-center justify-center rounded-full border border-surface bg-surface-container-high text-[10px] font-bold text-on-surface-variant">+2</div></div>
        <button onClick={onGenerateAiTask} disabled={isGeneratingAiTask} className="hidden h-10 items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] px-4 text-sm font-semibold text-[#1d00a5] shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 md:inline-flex"><Sparkles className="h-4 w-4" />{isGeneratingAiTask ? "AI 분석 중..." : "🤖 AI 작업 생성"}</button>
        <button className="rounded-lg p-2 text-on-surface-variant transition hover:bg-white/10 hover:text-on-surface"><Bell className="h-4 w-4" /></button><button className="rounded-lg p-2 text-on-surface-variant transition hover:bg-white/10 hover:text-on-surface"><Settings className="h-4 w-4" /></button>
      </div>
    </header>
  );
}
