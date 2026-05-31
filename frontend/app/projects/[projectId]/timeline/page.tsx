"use client";

import { useEffect, useMemo, useState } from "react";
import { ProjectPageFrame } from "@/components/kanban/ProjectPageFrame";
import { Task } from "@/components/kanban/types";
import { getTasksByProject } from "@/lib/api/taskApi";

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value.replaceAll?.(".", "-") ?? value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10).replaceAll("-", ".");
};

const getTime = (task: Task) => {
  const value = task.dueDate || task.updatedAt || task.createdAt || "";
  const timestamp = new Date(value.replaceAll?.(".", "-") ?? value).getTime();
  return Number.isNaN(timestamp) ? Number.MAX_SAFE_INTEGER : timestamp;
};

export default function ProjectTimelinePage({ params }: { params: { projectId: string } }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getTasksByProject(params.projectId);
        setTasks(data);
      } catch (_loadError) {
        setError("타임라인을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [params.projectId]);

  const timeline = useMemo(() => [...tasks].sort((a, b) => getTime(a) - getTime(b)), [tasks]);

  return (
    <ProjectPageFrame projectId={params.projectId} title="타임라인" description="dueDate가 있으면 마감일, 없으면 생성/수정일 기준으로 작업 흐름을 표시합니다.">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="space-y-5 border-l border-primary/30 pl-5">
          {isLoading ? <p className="text-sm text-on-surface-variant">타임라인을 불러오는 중...</p> : null}
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          {!isLoading && !error ? timeline.map((task) => (
            <article key={task.id} className="relative rounded-xl bg-black/20 p-4">
              <span className="absolute -left-[27px] top-5 h-3 w-3 rounded-full bg-primary" />
              <p className="text-xs text-primary">{formatDate(task.dueDate || task.updatedAt || task.createdAt)}</p>
              <h3 className="mt-1 font-semibold">{task.title}</h3>
              <p className="mt-1 text-sm text-on-surface-variant">{task.columnId} · {task.priority}</p>
            </article>
          )) : null}
          {!isLoading && !error && timeline.length === 0 ? <p className="text-sm text-on-surface-variant">표시할 작업이 없습니다.</p> : null}
        </div>
      </section>
    </ProjectPageFrame>
  );
}
