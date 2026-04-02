import { Gauge, Layers3, Sparkles, Workflow } from "lucide-react";

const features = [
  {
    title: "AI 작업 자동 분해",
    description: "요구사항을 입력하면 구현 가능한 단위 태스크로 구조화하고 우선순위를 제안합니다.",
    point: "Prompt-aware Planning",
    icon: Sparkles,
    wide: true,
  },
  {
    title: "실시간 상태 동기화",
    description: "카드 이동, 코멘트, 담당자 변경이 팀 전체에게 80ms 단위로 전파됩니다.",
    point: "Socket-first Sync",
    icon: Workflow,
  },
  {
    title: "스프린트 밀도 관리",
    description: "팀 부하를 분석해 지연 가능성이 높은 이슈를 먼저 포착합니다.",
    point: "AI Risk Signal",
    icon: Gauge,
  },
  {
    title: "개발자 문맥 보존",
    description: "PR, 커밋, 회의 요약을 카드 단위로 연결해 작업 히스토리를 유지합니다.",
    point: "Traceable Context",
    icon: Layers3,
    wide: true,
  },
];

export function Features() {
  return (
    <section className="px-6 py-24 md:px-10">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.16em] text-[#918fa1]">Core Capabilities</p>
          <h2 className="text-3xl font-semibold tracking-tight text-[#e5e2e1] md:text-4xl">
            협업 보드 이상의 개발 워크플로우 엔진
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className={`group rounded-xl bg-[#1c1b1b] p-6 transition-all duration-200 hover:-translate-y-1 hover:bg-[#201f1f] ${feature.wide ? "md:col-span-2" : "md:col-span-1"}`}
            >
              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#4f46e5]/20 text-[#c3c0ff]">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#e5e2e1]">{feature.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-[#c7c4d8]">{feature.description}</p>
              <span className="inline-flex rounded-full bg-[#2a2a2a] px-3 py-1 text-[11px] font-medium text-[#4cd6ff]">
                {feature.point}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
