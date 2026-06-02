"use client";

import { X } from "lucide-react";
import { BoardAnalysisResult } from "@/lib/api/aiApi";

type Props = {
  result: BoardAnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
};

const Section = ({ title, items }: { title: string; items: string[] }) => (
  <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
    <h3 className="text-sm font-bold text-on-surface">{title}</h3>
    {items.length > 0 ? (
      <ul className="mt-3 space-y-2 text-sm leading-6 text-on-surface-variant">
        {items.map((item, index) => <li key={`${title}-${index}`} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{item}</li>)}
      </ul>
    ) : <p className="mt-3 text-sm text-on-surface-variant">분석 내용이 없습니다.</p>}
  </section>
);

export function BoardAnalysisPanel({ result, isLoading, error, onClose }: Props) {
  return (
    <div className="absolute inset-0 z-40 flex justify-end bg-black/35 backdrop-blur-[2px]" onClick={onClose}>
      <aside
        className="flex h-full w-full max-w-[440px] flex-col border-l border-white/10 bg-surface-container-low/95 shadow-2xl shadow-black/50"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <div>
            <h2 className="text-base font-bold text-on-surface">AI 보드 분석</h2>
            <p className="text-xs text-on-surface-variant">카드 분포와 메모 기반 리스크 요약</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-on-surface-variant transition hover:bg-white/10 hover:text-on-surface" aria-label="AI 보드 분석 닫기">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          {isLoading ? <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm text-primary">AI가 열별 카드 개수와 메모 내용을 분석하는 중...</div> : null}
          {error ? <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-300">{error}</div> : null}
          {result ? (
            <>
              {result.fallback ? <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-3 text-xs text-amber-200">OpenAI 호출 실패로 기본 보드 분석을 표시합니다.</div> : null}
              <section className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
                <h3 className="text-sm font-bold text-primary">현재 상태 요약</h3>
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">{result.summary}</p>
              </section>
              <Section title="열별 카드 분포" items={result.columnAnalysis} />
              <Section title="메모 기반 이슈" items={result.memoInsights} />
              <Section title="위험 요소" items={result.risks} />
              <Section title="추천 다음 작업" items={result.recommendations} />
              <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <h3 className="text-sm font-bold text-on-surface">결론</h3>
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">{result.conclusion}</p>
              </section>
            </>
          ) : !isLoading && !error ? <p className="text-sm text-on-surface-variant">보드 분석 결과가 없습니다.</p> : null}
        </div>
      </aside>
    </div>
  );
}
