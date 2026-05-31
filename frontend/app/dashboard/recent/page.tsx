"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { RecentTask, getRecentTasks } from "@/lib/api/dashboardApi";

const priorityLabel: Record<RecentTask["priority"], string> = { urgent: "긴급", high: "높음", medium: "보통", low: "낮음" };

const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toISOString().slice(0, 10).replaceAll("-", ".");
};

export default function DashboardRecentPage() {
  const [tasks, setTasks] = useState<RecentTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setTasks(await getRecentTasks());
      } catch (loadError) {
        console.error(loadError);
        setError("최근 작업을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DashboardLayout>
      <DashboardHeader title="최근 작업" description="참여 프로젝트에서 최근 수정된 작업을 확인하세요" showCreateButton={false} />
      {isLoading ? <p className="text-sm text-on-surface-variant">최근 작업을 불러오는 중...</p> : null}
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      {!isLoading && tasks.length === 0 ? <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-sm text-on-surface-variant">최근 작업이 없습니다.</div> : null}
      <section className="space-y-3">
        {tasks.map((task) => (
          <article key={task.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-semibold text-on-surface">{task.title}</h3>
              <p className="mt-1 text-sm text-on-surface-variant">{task.projectName} · {task.columnTitle} · {priorityLabel[task.priority]} · {formatDate(task.updatedAt)}</p>
            </div>
            <Link href={`/projects/${task.projectId}/board`} className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/20">
              보드로 이동 <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </section>
    </DashboardLayout>
  );
}
