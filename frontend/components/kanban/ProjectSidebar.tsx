"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Bot, FileText, GanttChartSquare, LayoutDashboard, ListTodo, Settings, Sparkles } from "lucide-react";

const menus = [
  { label: "보드", path: "board", icon: LayoutDashboard },
  { label: "백로그", path: "backlog", icon: ListTodo },
  { label: "타임라인", path: "timeline", icon: GanttChartSquare },
  { label: "문서", path: "docs", icon: FileText },
  { label: "설정", path: "settings", icon: Settings },
];

export function ProjectSidebar({ projectId, projectName = "AI 협업 칸반 프로젝트" }: { projectId: string; projectName?: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-white/10 bg-surface-container-low px-4 py-6 md:flex">
      <div className="mb-6 px-2">
        <Link href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-on-surface">
          <ArrowLeft className="h-3.5 w-3.5" /> 대시보드
        </Link>
        <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">프로젝트 워크스페이스</p>
        <h2 className="mt-2 line-clamp-2 text-lg font-bold tracking-tight text-on-surface">{projectName}</h2>
      </div>

      <nav className="space-y-1">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const href = `/projects/${projectId}/${menu.path}`;
          const active = pathname === href;
          return (
            <Link
              key={menu.label}
              href={href}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                active
                  ? "border border-tertiary/40 bg-white/10 text-on-surface shadow-[0_0_20px_-8px_rgba(76,214,255,0.7)]"
                  : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface"
              }`}
            >
              <Icon className="h-4 w-4" />
              {menu.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-white/10 bg-surface-container-lowest/90 p-4 shadow-lg">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] text-on-primary">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface">AI 에이전트 준비 완료</p>
            <p className="text-[11px] text-on-surface-variant">업무 흐름을 분석할 수 있어요.</p>
          </div>
        </div>
        <Link href={`/projects/${projectId}/board`} className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 text-xs font-semibold text-primary transition hover:bg-white/10">
          <Sparkles className="h-3.5 w-3.5" />
          보드에서 AI 분석
        </Link>
      </div>
    </aside>
  );
}
