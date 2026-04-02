import { BrainCircuit, CalendarClock, Sparkles } from "lucide-react";

type HeroTask = {
  id: string;
  title: string;
  assignee: string;
  priority: "긴급" | "높음" | "중간";
  dueDate: string;
  tag: string;
};

const heroTasks: HeroTask[] = [
  {
    id: "hero-1",
    title: "실시간 코멘트 스레드 동기화",
    assignee: "JK",
    priority: "긴급",
    dueDate: "오늘 18:00",
    tag: "Realtime",
  },
  {
    id: "hero-2",
    title: "AI 스프린트 계획 자동 분해",
    assignee: "AL",
    priority: "높음",
    dueDate: "4월 4일",
    tag: "AI",
  },
  {
    id: "hero-3",
    title: "칸반 카드 권한 정책 리팩터링",
    assignee: "MN",
    priority: "중간",
    dueDate: "4월 6일",
    tag: "Auth",
  },
];

const priorityStyle: Record<HeroTask["priority"], string> = {
  긴급: "bg-[#ffb4ab]/20 text-[#ffb4ab]",
  높음: "bg-[#c3c0ff]/20 text-[#c3c0ff]",
  중간: "bg-[#4cd6ff]/20 text-[#4cd6ff]",
};

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-6 pb-20 pt-28 md:px-10">
      <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1c1b1b] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#4cd6ff]">
            <Sparkles className="h-3.5 w-3.5" />
            AI 기반 실시간 협업 칸반 시스템
          </div>

          <div className="space-y-5">
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-[-0.02em] text-[#e5e2e1] md:text-6xl">
              팀의 작업 흐름을
              <span className="block text-[#c3c0ff]">AI와 함께 즉시 정렬하세요.</span>
            </h1>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-[#c7c4d8] md:text-lg">
              목표를 입력하면 AI가 작업을 분해하고, 보드·채팅·진행률을 실시간으로
              동기화합니다. 개발 팀을 위한 높은 정보 밀도의 협업 경험을 제공합니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button className="rounded-md bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] px-6 py-3 text-sm font-semibold text-[#1d00a5] transition-transform duration-200 hover:-translate-y-0.5">
              무료로 시작하기
            </button>
            <button className="rounded-md bg-[#2a2a2a] px-6 py-3 text-sm font-medium text-[#e5e2e1] transition-colors hover:bg-[#353534]">
              제품 데모 보기
            </button>
          </div>
        </div>

        <div className="relative rounded-2xl bg-[#1c1b1b] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:p-6">
          <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[#4f46e5]/30 blur-3xl" />
          <div className="absolute -bottom-10 left-8 h-24 w-24 rounded-full bg-[#4cd6ff]/20 blur-3xl" />

          <div className="relative space-y-4 rounded-xl bg-[#0e0e0e] p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-[#918fa1]">Sprint Board</p>
                <h3 className="text-sm font-semibold text-[#e5e2e1]">플랫폼 안정화 스프린트</h3>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#4cd6ff]/15 px-2.5 py-1 text-[11px] font-medium text-[#4cd6ff]">
                <BrainCircuit className="h-3.5 w-3.5" />
                AI 정렬 중
              </span>
            </div>

            <div className="space-y-3">
              {heroTasks.map((task) => (
                <article
                  key={task.id}
                  className="group rounded-lg bg-[#1c1b1b] p-3 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h4 className="line-clamp-1 text-sm font-medium text-[#e5e2e1]">{task.title}</h4>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${priorityStyle[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#c7c4d8]">
                    <span className="rounded-full bg-[#2a2a2a] px-2 py-0.5">{task.tag}</span>
                    <div className="flex items-center gap-1.5">
                      <CalendarClock className="h-3.5 w-3.5 text-[#918fa1]" />
                      {task.dueDate}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-[#918fa1]">담당</span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4f46e5]/50 text-[10px] font-semibold text-[#dad7ff]">
                      {task.assignee}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
