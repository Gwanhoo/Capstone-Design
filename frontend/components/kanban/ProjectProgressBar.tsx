"use client";

type Props = {
  percent: number;
  doneCount: number;
  totalCount: number;
};

export function ProjectProgressBar({ percent, doneCount, totalCount }: Props) {
  return (
    <section className="mx-3 mt-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 shadow-lg shadow-black/20 md:mx-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-on-surface">프로젝트 진행률 {percent}%</p>
          <p className="text-xs text-on-surface-variant">완료 {doneCount} / 전체 {totalCount}</p>
        </div>
        <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{percent}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-surface-container-high">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#4cd6ff_0%,#c3c0ff_100%)] transition-all duration-500"
          style={{ width: `${percent}%` }}
          aria-label={`프로젝트 진행률 ${percent}%`}
        />
      </div>
    </section>
  );
}
