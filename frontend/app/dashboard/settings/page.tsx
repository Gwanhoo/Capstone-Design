"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/components/providers/AuthProvider";

export default function DashboardSettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // TODO: 사용자 설정 저장 API가 추가되면 localStorage 대신 서버 설정을 사용합니다.
    setNotifications(localStorage.getItem("kanban-ai:notifications") !== "false");
    setTheme(localStorage.getItem("kanban-ai:theme") || "dark");
  }, []);

  const saveNotifications = (value: boolean) => {
    setNotifications(value);
    localStorage.setItem("kanban-ai:notifications", String(value));
  };

  const saveTheme = (value: string) => {
    setTheme(value);
    localStorage.setItem("kanban-ai:theme", value);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <DashboardLayout>
      <DashboardHeader title="설정" description="내 계정과 개인 환경 설정을 관리하세요" showCreateButton={false} />
      <section className="max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-bold text-on-surface">내 정보</h2>
        <div className="mt-4 grid gap-3 text-sm">
          <div className="rounded-xl bg-black/20 p-4"><span className="text-on-surface-variant">이름</span><p className="mt-1 font-semibold">{user?.name ?? "-"}</p></div>
          <div className="rounded-xl bg-black/20 p-4"><span className="text-on-surface-variant">이메일</span><p className="mt-1 font-semibold">{user?.email ?? "-"}</p></div>
        </div>
        <div className="mt-6 space-y-4">
          <label className="flex items-center justify-between rounded-xl border border-white/10 p-4 text-sm">
            알림 받기
            <input type="checkbox" checked={notifications} onChange={(event) => saveNotifications(event.target.checked)} />
          </label>
          <label className="block rounded-xl border border-white/10 p-4 text-sm">
            <span className="text-on-surface-variant">테마</span>
            <select value={theme} onChange={(event) => saveTheme(event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-surface-container-lowest px-3">
              <option value="dark">다크</option>
              <option value="system">시스템</option>
            </select>
          </label>
        </div>
        <button onClick={handleLogout} className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200">로그아웃</button>
      </section>
    </DashboardLayout>
  );
}
