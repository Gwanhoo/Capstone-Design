"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { ProjectItem } from "@/components/dashboard/types";
import { Project, archiveProject, deleteProject, getProjects, unarchiveProject } from "@/lib/api/projectApi";

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

export function ProjectListPage({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [activeProjects, setActiveProjects] = useState<ProjectItem[]>([]);
  const [archivedProjects, setArchivedProjects] = useState<ProjectItem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) router.replace("/login");
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    const onProjectsRefresh = () => setRefreshKey((value) => value + 1);
    window.addEventListener("projects:refresh", onProjectsRefresh);
    return () => window.removeEventListener("projects:refresh", onProjectsRefresh);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const timeoutId = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [activeData, archivedData] = await Promise.all([
          getProjects(search.trim() || undefined),
          getProjects(search.trim() || undefined, "true"),
        ]);
        setActiveProjects(activeData.map((project) => toProjectItem(project, user?.id)));
        setArchivedProjects(archivedData.map((project) => toProjectItem(project, user?.id)));
      } catch (loadError) {
        console.error(loadError);
        setError("프로젝트 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [isAuthenticated, search, refreshKey, user?.id]);

  const hasActiveProjects = useMemo(() => activeProjects.length > 0, [activeProjects]);
  const hasArchivedProjects = useMemo(() => archivedProjects.length > 0, [archivedProjects]);

  const handleArchive = async (project: ProjectItem) => {
    const previousActive = activeProjects;
    const previousArchived = archivedProjects;
    const archivedProject = { ...project, isArchived: true, status: "보관됨" as const };

    try {
      setError(null);
      setActiveProjects((current) => current.filter((item) => item.id !== project.id));
      setArchivedProjects((current) => [archivedProject, ...current]);
      await archiveProject(project.id);
      window.dispatchEvent(new Event("projects:refresh"));
    } catch (archiveError) {
      console.error(archiveError);
      setActiveProjects(previousActive);
      setArchivedProjects(previousArchived);
      setError("프로젝트를 보관하지 못했습니다.");
    }
  };

  const handleUnarchive = async (project: ProjectItem) => {
    const previousActive = activeProjects;
    const previousArchived = archivedProjects;
    const activeProject = { ...project, isArchived: false, status: "진행중" as const, archivedAt: null };

    try {
      setError(null);
      setArchivedProjects((current) => current.filter((item) => item.id !== project.id));
      setActiveProjects((current) => [activeProject, ...current]);
      await unarchiveProject(project.id);
      window.dispatchEvent(new Event("projects:refresh"));
    } catch (unarchiveError) {
      console.error(unarchiveError);
      setActiveProjects(previousActive);
      setArchivedProjects(previousArchived);
      setError("프로젝트 보관을 해제하지 못했습니다.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;

    const target = projectToDelete;
    const previousActive = activeProjects;
    const previousArchived = archivedProjects;

    try {
      setIsDeleting(true);
      setError(null);
      setActiveProjects((current) => current.filter((project) => project.id !== target.id));
      setArchivedProjects((current) => current.filter((project) => project.id !== target.id));
      setProjectToDelete(null);
      await deleteProject(target.id);
      window.dispatchEvent(new Event("projects:refresh"));
    } catch (deleteError) {
      console.error(deleteError);
      setActiveProjects(previousActive);
      setArchivedProjects(previousArchived);
      setError("프로젝트를 삭제하지 못했습니다.");
    } finally {
      setIsDeleting(false);
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

      {!isLoading && !hasActiveProjects && !hasArchivedProjects && search ? <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-sm text-on-surface-variant">검색 결과가 없습니다.</div> : null}
      {!isLoading && !hasActiveProjects && !hasArchivedProjects && !search ? <EmptyState /> : null}

      {!isLoading && (hasActiveProjects || hasArchivedProjects) ? (
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-lg font-bold text-on-surface">진행 중 프로젝트</h2>
            {hasActiveProjects ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {activeProjects.map((project) => <ProjectCard key={project.id} project={project} onArchive={handleArchive} onDelete={setProjectToDelete} />)}
              </div>
            ) : <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-on-surface-variant">진행 중 프로젝트가 없습니다.</div>}
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-on-surface">보관된 프로젝트</h2>
            {hasArchivedProjects ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {archivedProjects.map((project) => <ProjectCard key={project.id} project={project} onUnarchive={handleUnarchive} onDelete={setProjectToDelete} />)}
              </div>
            ) : <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-on-surface-variant">보관된 프로젝트가 없습니다.</div>}
          </section>
        </div>
      ) : null}

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
