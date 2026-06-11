"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="fixed right-6 top-6 z-50 rounded-full border border-neutral-900 bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-neutral-800 print:hidden"
      aria-label="PDF 저장을 위해 인쇄 창 열기"
    >
      PDF 저장
    </button>
  );
}
