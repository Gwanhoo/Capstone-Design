import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-[900px] flex-col items-center justify-center overflow-hidden px-6 pt-28">
      <div className="absolute left-1/2 top-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-container/20 blur-[120px]" />

      <div className="max-w-4xl space-y-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-outline/20 bg-surface-low px-3 py-1 text-xs font-medium uppercase tracking-wider text-tertiary">
          <Sparkles className="h-4 w-4" /> AI 기반 워크플로우 진화
        </div>

        <h1 className="text-5xl font-bold leading-[1.1] text-on-surface md:text-7xl">
          AI 기반 실시간 협업 <br />
          <span className="text-primary">칸반 시스템</span>
        </h1>

        <p className="mx-auto max-w-2xl text-xl font-light leading-relaxed text-on-surface-variant">
          AI가 작업을 자동으로 분해하고 팀원과 실시간으로 협업할 수 있는 개발자용 워크스페이스
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href="/signup" className="rounded-md bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] px-8 py-4 text-lg font-semibold text-[#1d00a5] transition-transform hover:scale-105">
            시작하기
          </Link>
          <a href="#demo" className="rounded-md border border-outline/20 bg-surface-high px-8 py-4 text-lg font-medium text-on-surface transition-colors hover:bg-surface-highest">
            데모 보기
          </a>
        </div>
      </div>

      <div className="relative mt-16 w-full max-w-5xl overflow-hidden rounded-xl border border-outline/20 bg-surface-low shadow-2xl">
        <div className="grid gap-3 p-6 md:grid-cols-3">
          {["Todo", "In Progress", "Done"].map((col) => (
            <div key={col} className="space-y-3 rounded-lg bg-surface p-3">
              <p className="text-xs font-bold uppercase tracking-wider text-outline">{col}</p>
              <div className="h-16 rounded bg-surface-high" />
              <div className="h-12 rounded bg-surface-high/80" />
              <div className="h-10 rounded bg-surface-high/60" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
