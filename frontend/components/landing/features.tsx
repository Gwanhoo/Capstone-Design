import { Brain, Lightbulb, RefreshCw } from "lucide-react";

const features = [
  { title: "AI 작업 자동 분해", desc: "LLM을 활용하여 복잡한 작업을 자동으로 세분화합니다.", icon: Brain, wide: true },
  { title: "실시간 협업", desc: "WebSocket 기반으로 팀원과 즉시 상태를 공유합니다.", icon: RefreshCw },
  { title: "스마트 작업 추천", desc: "작업 흐름과 우선순위를 기반으로 다음 작업을 제안합니다.", icon: Lightbulb },
];

export function Features() {
  return (
    <section id="features" className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-8 py-24 md:grid-cols-4">
      {features.map((feature) => (
        <article
          key={feature.title}
          className={`rounded-xl border border-outline/20 bg-surface-low p-8 transition-all hover:bg-surface-high hover:shadow-xl ${feature.wide ? "md:col-span-2" : ""}`}
        >
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-container/20 text-primary">
            <feature.icon className="h-5 w-5" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-on-surface md:text-2xl">{feature.title}</h3>
          <p className="text-sm leading-relaxed text-on-surface-variant md:text-base">{feature.desc}</p>
        </article>
      ))}

      <article className="md:col-span-4 flex flex-col items-center gap-12 overflow-hidden rounded-xl border border-outline/20 bg-surface-lowest p-10 md:flex-row">
        <div className="flex-1 space-y-4">
          <h3 className="text-3xl font-bold text-on-surface">칸반 보드 관리</h3>
          <p className="text-lg leading-relaxed text-on-surface-variant">직관적인 칸반 보드 드래그 앤 드롭으로 작업 흐름을 한눈에 관리합니다.</p>
        </div>
        <div className="w-full max-w-sm rounded-xl border border-outline/20 bg-surface-high p-4 shadow-2xl">
          <div className="space-y-3">
            <div className="h-16 rounded bg-primary-container/20" />
            <div className="h-16 rounded bg-on-surface/5" />
            <div className="h-16 rounded bg-on-surface/5" />
          </div>
        </div>
      </article>
    </section>
  );
}
