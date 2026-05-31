"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Settings, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getMyInvitations, MyInvitation } from "@/lib/api/invitationApi";

export function KanbanHeader({
  onGenerateAiTask,
  projectName,
  isGeneratingAiTask,
}: {
  onGenerateAiTask: () => void;
  projectName: string;
  isGeneratingAiTask?: boolean;
}) {
  const router = useRouter();
  const { logout } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [invitations, setInvitations] = useState<MyInvitation[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    setReadIds(JSON.parse(localStorage.getItem("kanban-ai:read-notifications") || "[]"));
    getMyInvitations().then(setInvitations).catch(() => setInvitations([]));
  }, []);

  const markAsRead = (id: string) => {
    const next = Array.from(new Set([...readIds, id]));
    setReadIds(next);
    localStorage.setItem("kanban-ai:read-notifications", JSON.stringify(next));
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const unreadCount = invitations.filter((invitation) => !readIds.includes(invitation.id)).length;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-surface/70 px-4 backdrop-blur-xl md:px-6">
      <div><h1 className="text-base font-bold text-on-surface md:text-lg">{projectName} · 메인 보드</h1><p className="text-xs text-on-surface-variant">실시간 태스크 흐름</p></div>
      <div className="flex items-center gap-3">
        <button onClick={onGenerateAiTask} disabled={isGeneratingAiTask} className="hidden h-10 items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] px-4 text-sm font-semibold text-[#1d00a5] shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 md:inline-flex"><Sparkles className="h-4 w-4" />{isGeneratingAiTask ? "AI 분석 중..." : "🤖 AI 작업 생성"}</button>
        <div className="relative">
          <button onClick={() => setIsNotificationOpen((value) => !value)} className="relative rounded-lg p-2 text-on-surface-variant transition hover:bg-white/10 hover:text-on-surface">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 ? <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-400" /> : null}
          </button>
          {isNotificationOpen ? (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/10 bg-surface-container-high p-3 shadow-2xl">
              <p className="mb-2 text-sm font-bold text-on-surface">알림</p>
              {invitations.length === 0 ? <p className="text-xs text-on-surface-variant">새 알림이 없습니다.</p> : null}
              {invitations.map((invitation) => (
                <Link key={invitation.id} href="/dashboard" onClick={() => markAsRead(invitation.id)} className="block rounded-xl p-3 text-xs hover:bg-white/10">
                  <p className="font-semibold text-on-surface">프로젝트 초대: {invitation.project.name}</p>
                  <p className="mt-1 text-on-surface-variant">{invitation.inviter.name}님이 초대했습니다.</p>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        <div className="relative">
          <button onClick={() => setIsSettingsOpen((value) => !value)} className="rounded-lg p-2 text-on-surface-variant transition hover:bg-white/10 hover:text-on-surface"><Settings className="h-4 w-4" /></button>
          {isSettingsOpen ? (
            <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-white/10 bg-surface-container-high p-2 text-sm shadow-2xl">
              <Link href="/dashboard/settings" className="block rounded-xl px-3 py-2 hover:bg-white/10">내 설정</Link>
              <Link href="/dashboard" className="block rounded-xl px-3 py-2 hover:bg-white/10">대시보드</Link>
              <button onClick={handleLogout} className="w-full rounded-xl px-3 py-2 text-left text-red-200 hover:bg-red-500/10">로그아웃</button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
