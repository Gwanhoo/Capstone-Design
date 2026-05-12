export function AIRecommendationCard() {
  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
      <p className="text-xs text-on-surface">채팅 내용을 분석하여 <span className="font-semibold text-primary">"API 연동 확인"</span> 업무를 백로그에 추가할까요?</p>
      <div className="mt-3 flex gap-2">
        <button className="rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">추가하기</button>
        <button className="rounded-md px-2 py-1 text-xs text-on-surface-variant transition hover:bg-white/10">무시</button>
      </div>
    </div>
  );
}
