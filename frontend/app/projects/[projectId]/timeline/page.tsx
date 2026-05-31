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

export default function ProjectTimelinePage({ params }: { params: { projectId: string } }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasksByProject(params.projectId).then(setTasks).catch(() => setTasks([]));
  }, [params.projectId]);

  const timeline = useMemo(() => [...tasks].sort((a, b) => {
    const aDate = new Date((a.dueDate || a.updatedAt || a.createdAt || "").replaceAll?.(".", "-") ?? "").getTime();
    const bDate = new Date((b.dueDate || b.updatedAt || b.createdAt || "").replaceAll?.(".", "-") ?? "").getTime();
    return aDate - bDate;
  }), [tasks]);

  return (
    <ProjectPageFrame projectId={params.projectId} title="타임라인" description="dueDate가 있으면 마감일, 없으면 생성/수정일 기준으로 작업 흐름을 표시합니다.">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="space-y-5 border-l border-primary/30 pl-5">
          {timeline.map((task) => (
            <article key={task.id} className="relative rounded-xl bg-black/20 p-4">
              <span className="absolute -left-[27px] top-5 h-3 w-3 rounded-full bg-primary" />
              <p className="text-xs text-primary">{formatDate(task.dueDate || task.updatedAt || task.createdAt)}</p>
              <h3 className="mt-1 font-semibold">{task.title}</h3>
              <p className="mt-1 text-sm text-on-surface-variant">{task.columnId} · {task.priority}</p>
            </article>
          ))}
          {timeline.length === 0 ? <p className="text-sm text-on-surface-variant">표시할 작업이 없습니다.</p> : null}
        </div>
      </section>
    </ProjectPageFrame>
  );
}
