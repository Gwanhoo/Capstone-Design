import { CheckCircle, Send, Sparkles, Users } from "lucide-react";

export function KanbanPreview() {
  return (
    <section id="demo" className="bg-surface-lowest py-24">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-4xl font-bold">직관적인 협업 보드</h2>
          <p className="text-on-surface-variant">Todo, In Progress, Done으로 구성된 칸반 보드에서 팀원들의 작업 상태가 실시간으로 동기화됩니다.</p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="grid flex-1 gap-4 md:grid-cols-3">
            {["TODO", "IN PROGRESS", "DONE"].map((col, idx) => (
              <div key={col} className="space-y-3 rounded-lg bg-surface p-4">
                <div className="flex items-center justify-between text-xs font-bold tracking-widest">
                  <span className={idx === 1 ? "text-primary" : "text-outline"}>{col}</span>
                  <span className="rounded bg-surface-low px-2 py-0.5">{idx === 0 ? 4 : idx === 1 ? 2 : 1}</span>
                </div>
                <div className="h-24 rounded border border-outline/20 bg-surface-low" />
                <div className="h-20 rounded border border-outline/20 bg-surface-low" />
              </div>
            ))}
          </div>

          <aside className="w-full rounded-xl border border-outline/20 bg-surface p-4 lg:w-72">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-tight">팀 채팅</span>
              <Sparkles className="h-4 w-4 text-tertiary" />
            </div>
            <div className="space-y-3 text-xs">
              <div className="rounded-lg bg-surface-high p-3 text-on-surface-variant">'인증' 작업에서 병목 현상이 감지되었습니다.</div>
              <div className="rounded-lg bg-primary-container/20 p-3 text-on-surface">네, 하위 작업으로 나눠주세요.</div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-md bg-surface-low px-3 py-2 text-outline">
              <Send className="h-4 w-4" /> AI에게 물어보세요...
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-on-surface-variant">
              <Users className="h-4 w-4" /> 실시간 동기화
              <CheckCircle className="h-4 w-4 text-tertiary" /> 확인됨
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
