"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { ProjectItem } from "@/components/dashboard/types";
import { getProjects } from "@/lib/api/projectApi";

const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toISOString().slice(0, 10).replaceAll("-", ".");
};

export function ProjectListPage({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) router.replace("/login");
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const timeoutId = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProjects(search.trim() || undefined);
        setProjects(data.map((project) => ({
          id: project.id,
          name: project.name,
          description: project.description || "프로젝트 설명이 없습니다.",
          status: project.status === "archived" ? "보관됨" : "진행중",
          members: project.memberCount,
          updatedAt: formatDate(project.updatedAt),
        })));
      } catch (loadError) {
        console.error(loadError);
        setError("프로젝트 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [isAuthenticated, search]);

  const hasProjects = useMemo(() => projects.length > 0, [projects]);

  return (
    <DashboardLayout>
      <DashboardHeader
        title={compact ? "대시보드" : "내 프로젝트"}
        description={compact ? "최근 참여 중인 프로젝트를 확인하세요" : "참여 중인 프로젝트를 검색하고 보드를 열어보세요"}
        search={search}
        onSearchChange={setSearch}
      />

      {isLoading ? <div className="px-1 py-8 text-sm text-on-surface-variant">프로젝트를 불러오는 중...</div> : null}
      {error ? <div className="px-1 pb-4 text-sm text-red-300">{error}</div> : null}

      {!isLoading && !hasProjects && search ? <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-sm text-on-surface-variant">검색 결과가 없습니다.</div> : null}
      {!isLoading && !hasProjects && !search ? <EmptyState /> : null}

      {hasProjects ? (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
        </section>
      ) : null}
    </DashboardLayout>
  );
}
