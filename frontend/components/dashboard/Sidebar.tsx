"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FolderKanban, LayoutDashboard, LogOut, Settings, Sparkles, UserCircle2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

const menus = [
  { label: "대시보드", href: "/dashboard", icon: LayoutDashboard, active: true },
  { label: "내 프로젝트", href: "/dashboard", icon: FolderKanban, active: false },
  { label: "최근 작업", href: "/dashboard", icon: Sparkles, active: false },
  { label: "설정", href: "/dashboard", icon: Settings, active: false }
];

export function Sidebar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-72 p-4">
      <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] text-[#1d00a5] shadow-lg">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-bold text-on-surface">Kinetic Void</p>
            <p className="text-xs uppercase tracking-[0.18em] text-on-surface-variant">AI Collaboration</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {menus.map((menu) => {
            const Icon = menu.icon;
            return (
              <Link
                key={menu.label}
                href={menu.href}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all duration-200 ${
                  menu.active
                    ? "border-primary/30 bg-primary/15 text-on-surface shadow-[0_6px_24px_rgba(79,70,229,0.25)]"
                    : "border-transparent text-on-surface-variant hover:border-white/10 hover:bg-white/5 hover:text-on-surface"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{menu.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="mb-4 flex items-center gap-3">
            <UserCircle2 className="h-8 w-8 text-primary" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-on-surface">{user?.name ?? "사용자"}</p>
              <p className="truncate text-xs text-on-surface-variant">{user?.email ?? ""}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm text-on-surface-variant transition-colors hover:text-on-surface">
            <LogOut className="h-4 w-4" />
            로그아웃
          </button>
        </div>
      </div>
    </aside>
  );
}
