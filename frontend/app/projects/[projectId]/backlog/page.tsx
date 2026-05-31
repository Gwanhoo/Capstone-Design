"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ProjectPageFrame } from "@/components/kanban/ProjectPageFrame";
import { Task } from "@/components/kanban/types";
import { getTasksByProject } from "@/lib/api/taskApi";
import { getProjectColumns, ProjectColumn } from "@/lib/api/projectApi";

const priorities = ["전체", "긴급", "높음", "보통", "낮음"];

export default function ProjectBacklogPage({ params }: { params: { projectId: string } }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<ProjectColumn[]>([]);
  const [query, setQuery] = useState("");
  const [columnId, setColumnId] = useState("전체");
  const [priority, setPriority] = useState("전체");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [taskData, columnData] = await Promise.all([getTasksByProject(params.projectId), getProjectColumns(params.projectId)]);
        setTasks(taskData);
        setColumns(columnData);
      } catch (_loadError) {
        setError("백로그를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [params.projectId]);

  const columnTitle = (id: string) => columns.find((column) => column.id === id)?.title ?? id;
  const filtered = useMemo(() => tasks.filter((task) => {
    const textMatched = `${task.title} ${task.description}`.toLowerCase().includes(query.toLowerCase());
    const columnMatched = columnId === "전체" || task.columnId === columnId;
    const priorityMatched = priority === "전체" || task.priority === priority;
    return textMatched && columnMatched && priorityMatched;
  }), [tasks, query, columnId, priority]);

  return (
    <ProjectPageFrame projectId={params.projectId} title="백로그" description="프로젝트의 모든 작업을 리스트 형태로 확인하고 필터링하세요.">
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="작업 검색" className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm" />
        <select value={columnId} onChange={(event) => setColumnId(event.target.value)} className="h-11 rounded-xl border border-white/10 bg-surface-container-lowest px-3 text-sm">
          <option>전체</option>{columns.map((column) => <option key={column.id} value={column.id}>{column.title}</option>)}
        </select>
        <select value={priority} onChange={(event) => setPriority(event.target.value)} className="h-11 rounded-xl border border-white/10 bg-surface-container-lowest px-3 text-sm">
          {priorities.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <section className="space-y-3">
        {isLoading ? <p className="rounded-2xl border border-white/10 bg-white/5 p-8 text-sm text-on-surface-variant">백로그를 불러오는 중...</p> : null}
        {error ? <p className="rounded-2xl border border-red-400/20 bg-red-500/5 p-8 text-sm text-red-300">{error}</p> : null}
        {!isLoading && !error ? filtered.map((task) => (
          <article key={task.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div><h3 className="font-semibold">{task.title}</h3><p className="mt-1 text-sm text-on-surface-variant">{columnTitle(task.columnId)} · {task.priority}</p></div>
              <Link href={`/projects/${params.projectId}/board`} className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">보드로 이동</Link>
            </div>
          </article>
        )) : null}
        {!isLoading && !error && filtered.length === 0 ? <p className="rounded-2xl border border-white/10 bg-white/5 p-8 text-sm text-on-surface-variant">조건에 맞는 작업이 없습니다.</p> : null}
      </section>
    </ProjectPageFrame>
  );
}
