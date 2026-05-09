import Link from "next/link";

export function Cta() {
  return (
    <section className="mx-auto mb-24 max-w-7xl px-8">
      <div className="relative overflow-hidden rounded-3xl border border-outline/20 bg-gradient-to-br from-primary-container to-surface-lowest p-12 text-center md:p-24">
        <h2 className="text-4xl font-black tracking-tighter md:text-6xl">AI와 함께 더 스마트하게 협업하세요</h2>
        <p className="mx-auto mt-6 max-w-xl text-xl text-on-surface-variant">이미 5만 명 이상의 개발자가 전환했습니다.</p>
        <div className="pt-8">
          <Link href="/signup" className="rounded-md bg-white px-10 py-5 text-lg font-bold text-[#1d00a5] transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            첫 프로젝트 시작하기
          </Link>
        </div>
      </div>
    </section>
  );
}
