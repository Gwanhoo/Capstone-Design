"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ProjectItem } from "@/components/dashboard/types";
import { getProjects } from "@/lib/api/projectApi";

const STATS = [
  { title: "진행중 프로젝트", value: "12", note: "지난주 대비 +2" },
  { title: "완료된 작업", value: "84", note: "이번 주 누적" },
  { title: "AI 추천 작업", value: "19", note: "우선순위 높음 6건" },
];

const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toISOString().slice(0, 10).replaceAll("-", ".");
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProjects();
        setProjects(
          data.map((project) => ({
            id: project.id,
            name: project.name,
            description: project.description || "프로젝트 설명이 없습니다.",
            status: project.status === "archived" ? "완료" : "진행중",
            progress: project.status === "archived" ? 100 : 0,
            members: project.memberCount,
            updatedAt: formatDate(project.updatedAt),
          })),
        );
      } catch (loadError) {
        console.error(loadError);
        setError("프로젝트 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  const hasProjects = useMemo(() => projects.length > 0, [projects]);

  return (
    <DashboardLayout>
      <DashboardHeader />

      <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STATS.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </section>

      {isLoading ? <div className="px-1 py-8 text-sm text-on-surface-variant">프로젝트를 불러오는 중...</div> : null}
      {error ? <div className="px-1 pb-4 text-sm text-red-300">{error}</div> : null}

      {!isLoading && !hasProjects ? (
        <EmptyState />
      ) : (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      )}
    </DashboardLayout>
  );
}
