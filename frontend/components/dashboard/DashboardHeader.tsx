import Link from "next/link";
import { Plus, Search } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
  search?: string;
  onSearchChange?: (value: string) => void;
  showCreateButton?: boolean;
};

export function DashboardHeader({ title = "내 프로젝트", description = "참여 중인 프로젝트와 진행 현황을 확인하세요", search, onSearchChange, showCreateButton = true }: Props) {
  return (
    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">{title}</h1>
        <p className="mt-1 text-sm text-on-surface-variant">{description}</p>
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
        {onSearchChange ? (
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
            <input
              type="text"
              value={search ?? ""}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="프로젝트 검색"
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-on-surface outline-none transition-colors placeholder:text-outline focus:border-primary/40 sm:w-60"
            />
          </label>
        ) : null}
        {showCreateButton ? (
          <Link
            href="/projects/new"
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] px-4 font-semibold text-[#1d00a5] shadow-lg transition-all hover:brightness-110 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            새 프로젝트
          </Link>
        ) : null}
      </div>
    </header>
  );
}
