import { GitBranch, Rocket, Sparkles } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "프로젝트 연결",
    description: "GitHub 저장소 또는 신규 워크스페이스를 연결하면 팀 보드가 즉시 생성됩니다.",
    icon: Rocket,
  },
  {
    step: "02",
    title: "AI 작업 설계",
    description: "목표/마일스톤을 입력하면 AI가 작업 분해, 우선순위, 담당자 초안을 자동 제안합니다.",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "실시간 실행 & 피드백",
    description: "보드, 채팅, 진행률이 실시간 동기화되고 AI가 병목 구간을 감지해 다음 액션을 안내합니다.",
    icon: GitBranch,
  },
];

export function HowItWorks() {
  return (
    <section className="px-6 py-24 md:px-10">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs uppercase tracking-[0.16em] text-[#918fa1]">How it Works</p>
          <h2 className="text-3xl font-semibold tracking-tight text-[#e5e2e1] md:text-4xl">팀이 바로 적용 가능한 3단계</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((item) => (
            <article key={item.step} className="rounded-xl bg-[#1c1b1b] p-6">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-[0.16em] text-[#4cd6ff]">STEP {item.step}</span>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#2a2a2a] text-[#c3c0ff]">
                  <item.icon className="h-4 w-4" />
                </span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#e5e2e1]">{item.title}</h3>
              <p className="text-sm leading-relaxed text-[#c7c4d8]">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
