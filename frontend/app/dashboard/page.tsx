"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { InvitationPanel } from "@/components/dashboard/InvitationPanel";
import { ProjectItem } from "@/components/dashboard/types";
import { getProjects } from "@/lib/api/projectApi";

const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toISOString().slice(0, 10).replaceAll("-", ".");
};

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!isAuthenticated) {
      return;
    }

    const loadProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProjects(search.trim() || undefined);
        setProjects(
          data.map((project) => ({
            id: project.id,
            name: project.name,
            description: project.description || "프로젝트 설명이 없습니다.",
            status: project.status === "archived" ? "보관됨" : "진행중",
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
  }, [isAuthLoading, isAuthenticated, router, search]);

  const hasProjects = useMemo(() => projects.length > 0, [projects]);
  const stats = useMemo(() => {
    const activeCount = projects.filter((project) => project.status === "진행중").length;
    const archivedCount = projects.filter((project) => project.status === "보관됨").length;

    return [
      { title: "전체 프로젝트", value: String(projects.length), note: "현재 조회된 프로젝트" },
      { title: "진행중 프로젝트", value: String(activeCount), note: "활성 상태 프로젝트" },
      { title: "보관된 프로젝트", value: String(archivedCount), note: "보관 상태 프로젝트" },
    ];
  }, [projects]);

  return (
    <DashboardLayout>
      <DashboardHeader search={search} onSearchChange={setSearch} />

      <InvitationPanel />

      <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </section>

      {isLoading ? <div className="px-1 py-8 text-sm text-on-surface-variant">프로젝트를 불러오는 중...</div> : null}
      {error ? <div className="px-1 pb-4 text-sm text-red-300">{error}</div> : null}

      {!isLoading && !hasProjects && search ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-sm text-on-surface-variant">검색 결과가 없습니다.</div>
      ) : !isLoading && !hasProjects ? (
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
