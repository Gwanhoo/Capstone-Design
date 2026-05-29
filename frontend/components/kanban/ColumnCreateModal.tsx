import { FormEvent, useState } from "react";
import { X } from "lucide-react";

type Props = {
  isCreating: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
};

export function ColumnCreateModal({ isCreating, onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    onCreate(trimmedTitle);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm" onClick={onClose}>
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-white/10 bg-surface-container-high p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-on-surface">새 열 추가</h2>
            <p className="mt-1 text-sm text-on-surface-variant">보드에 표시할 컬럼 이름을 입력하세요.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-on-surface-variant transition hover:bg-white/10 hover:text-on-surface" disabled={isCreating}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="예: QA, 리뷰, 배포" className="mt-5 h-11 w-full rounded-xl border border-white/10 bg-surface-container-lowest px-3 text-sm text-on-surface outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/30" autoFocus />
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-on-surface-variant transition hover:bg-white/10" disabled={isCreating}>취소</button>
          <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60" disabled={isCreating || !title.trim()}>{isCreating ? "생성 중..." : "생성"}</button>
        </div>
      </form>
    </div>
  );
}
