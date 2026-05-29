import { FormEvent, useState } from "react";
import { Sparkles, X } from "lucide-react";

type Props = {
  isGenerating: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
};

export function AiTaskPromptModal({ isGenerating, onClose, onSubmit }: Props) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(prompt.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm" onClick={onClose}>
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-3xl border border-white/10 bg-surface-container-high p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary"><Sparkles className="h-4 w-4" />AI 작업 생성</div>
            <h2 className="mt-2 text-xl font-bold text-on-surface">프로젝트 목표나 추가로 만들고 싶은 작업을 입력하세요.</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-on-surface-variant transition hover:bg-white/10 hover:text-on-surface" disabled={isGenerating}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={5} placeholder="예: 로그인/회원가입 기능을 더 세분화해서 작업으로 나눠줘" className="mt-5 w-full resize-none rounded-xl border border-white/10 bg-surface-container-lowest px-3 py-3 text-sm text-on-surface outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/30" autoFocus />
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-on-surface-variant transition hover:bg-white/10" disabled={isGenerating}>취소</button>
          <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60" disabled={isGenerating}>{isGenerating ? "AI 분석 중..." : "AI 작업 생성"}</button>
        </div>
      </form>
    </div>
  );
}
