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
import { Project, archiveProject, deleteProject, getProjects } from "@/lib/api/projectApi";

const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toISOString().slice(0, 10).replaceAll("-", ".");
};

const toProjectItem = (project: Project, currentUserId?: string): ProjectItem => ({
  id: project.id,
  name: project.name,
  description: project.description || "프로젝트 설명이 없습니다.",
  status: project.isArchived ? "보관됨" : "진행중",
  members: project.memberCount,
  updatedAt: formatDate(project.updatedAt),
  createdBy: project.createdBy,
  isOwner: Boolean(currentUserId && project.createdBy === currentUserId),
  isArchived: Boolean(project.isArchived),
  archivedAt: project.archivedAt,
});

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [archivedCount, setArchivedCount] = useState(0);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const onProjectsRefresh = () => setRefreshKey((value) => value + 1);
    window.addEventListener("projects:refresh", onProjectsRefresh);
    return () => window.removeEventListener("projects:refresh", onProjectsRefresh);
  }, []);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!isAuthenticated) return;

    const loadProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [activeData, archivedData] = await Promise.all([
          getProjects(search.trim() || undefined),
          getProjects(search.trim() || undefined, "true"),
        ]);
        setProjects(activeData.map((project) => toProjectItem(project, user?.id)));
        setArchivedCount(archivedData.length);
      } catch (loadError) {
        console.error(loadError);
        setError("프로젝트 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [isAuthLoading, isAuthenticated, router, search, refreshKey, user?.id]);

  const hasProjects = useMemo(() => projects.length > 0, [projects]);

  const handleArchive = async (project: ProjectItem) => {
    const previousProjects = projects;
    const previousArchivedCount = archivedCount;

    try {
      setError(null);
      setProjects((current) => current.filter((item) => item.id !== project.id));
      setArchivedCount((count) => count + 1);
      await archiveProject(project.id);
      window.dispatchEvent(new Event("projects:refresh"));
    } catch (archiveError) {
      console.error(archiveError);
      setProjects(previousProjects);
      setArchivedCount(previousArchivedCount);
      setError("프로젝트를 보관하지 못했습니다.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;

    const target = projectToDelete;
    const previousProjects = projects;

    try {
      setIsDeleting(true);
      setError(null);
      setProjects((current) => current.filter((project) => project.id !== target.id));
      setProjectToDelete(null);
      await deleteProject(target.id);
      window.dispatchEvent(new Event("projects:refresh"));
    } catch (deleteError) {
      console.error(deleteError);
      setProjects(previousProjects);
      setError("프로젝트를 삭제하지 못했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const stats = useMemo(() => [
    { title: "전체 프로젝트", value: String(projects.length + archivedCount), note: "진행중 + 보관 프로젝트" },
    { title: "진행중 프로젝트", value: String(projects.length), note: "기본 목록에 표시되는 프로젝트" },
    { title: "보관된 프로젝트", value: String(archivedCount), note: "내 프로젝트 화면에서 관리" },
  ], [archivedCount, projects.length]);

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
            <ProjectCard key={project.id} project={project} onArchive={handleArchive} onDelete={setProjectToDelete} />
          ))}
        </section>
      )}

      {projectToDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm" onClick={() => { if (!isDeleting) setProjectToDelete(null); }}>
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface-container-high p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <h2 className="text-lg font-bold text-on-surface">프로젝트 삭제</h2>
            <p className="mt-3 text-sm leading-6 text-on-surface-variant">
              <span className="font-semibold text-on-surface">{projectToDelete.name}</span> 프로젝트를 삭제하시겠습니까? 관련 카드, 컬럼, 문서, 초대, 채팅 기록이 함께 삭제됩니다.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setProjectToDelete(null)} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-on-surface-variant transition hover:bg-white/10" disabled={isDeleting}>취소</button>
              <button type="button" onClick={handleConfirmDelete} className="rounded-xl bg-error px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60" disabled={isDeleting}>
                {isDeleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
}
