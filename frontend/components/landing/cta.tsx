export function Cta() {
  return (
    <section className="px-6 pb-24 md:px-10">
      <div className="mx-auto w-full max-w-7xl rounded-2xl bg-[linear-gradient(145deg,#4f46e5_0%,#131313_75%)] p-8 md:p-14">
        <div className="max-w-3xl space-y-5">
          <p className="text-xs uppercase tracking-[0.16em] text-[#dad7ff]">Start with your team</p>
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#f2f0ff] md:text-5xl">
            다음 스프린트부터
            <span className="block">AI 협업 보드로 운영해보세요.</span>
          </h2>
          <p className="text-sm leading-relaxed text-[#d4d0f7] md:text-base">
            기존 이슈 트래커를 그대로 가져오고, AI 추천을 켜면 계획-실행-회고가 하나의 흐름으로 연결됩니다.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-[#1d00a5]">무료 체험 시작</button>
            <button className="rounded-md bg-[#131313]/60 px-5 py-3 text-sm font-medium text-[#e5e2e1] backdrop-blur">
              도입 문의
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
