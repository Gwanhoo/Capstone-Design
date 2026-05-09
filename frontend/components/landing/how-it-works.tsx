import { CheckCircle, Sparkles, Users } from "lucide-react";

const steps = [
  { step: "1단계", title: "프로젝트 생성", desc: "GitHub 저장소를 연결하거나 처음부터 시작하세요.", icon: CheckCircle },
  { step: "2단계", title: "AI가 작업 자동 생성", desc: "목표를 입력하면 세부 기술 티켓 로드맵을 생성합니다.", icon: Sparkles },
  { step: "3단계", title: "팀원과 실시간 협업", desc: "AI가 팀 부하를 모니터링하고 최적의 경로를 제안합니다.", icon: Users },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-5xl px-8 py-32">
      <div className="mb-16 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight">협업을 위한 설계</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((item) => (
          <article key={item.step} className="rounded-xl border border-outline/20 bg-surface-low p-8">
            <item.icon className="mb-4 h-8 w-8 text-primary" />
            <p className="text-sm uppercase tracking-widest text-tertiary">{item.step}</p>
            <h3 className="mt-2 text-2xl font-bold">{item.title}</h3>
            <p className="mt-3 text-on-surface-variant">{item.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
