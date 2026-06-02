"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Archive, ArchiveRestore, CalendarClock, Ellipsis, Trash2, Users } from "lucide-react";
import { ProjectItem } from "./types";

const statusStyle = {
  진행중: "bg-primary/20 text-primary",
  보관됨: "bg-emerald-400/20 text-emerald-300",
};

type Props = {
  project: ProjectItem;
  onDelete?: (project: ProjectItem) => void;
  onArchive?: (project: ProjectItem) => void;
  onUnarchive?: (project: ProjectItem) => void;
};

export function ProjectCard({ project, onDelete, onArchive, onUnarchive }: Props) {
  const boardHref = `/projects/${encodeURIComponent(project.id)}/board`;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const canManage = project.isOwner && Boolean(onDelete || onArchive || onUnarchive);

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [menuOpen]);

  return (
    <article className={`group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_10px_28px_rgba(0,0,0,0.3)] transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_36px_rgba(0,0,0,0.45)] ${project.isArchived ? "opacity-75" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 flex-1 text-lg font-semibold text-on-surface">{project.name}</h3>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[project.status]}`}>{project.status}</span>
          {canManage ? (
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={(event) => { event.preventDefault(); event.stopPropagation(); setMenuOpen((value) => !value); }}
                className="rounded-lg p-1.5 text-on-surface-variant transition hover:bg-white/10 hover:text-on-surface"
                aria-label={`${project.name} 프로젝트 메뉴 열기`}
              >
                <Ellipsis className="h-4 w-4" />
              </button>
              {menuOpen ? (
                <div className="absolute right-0 top-8 z-30 min-w-[132px] rounded-xl border border-white/10 bg-surface-container-low p-1.5 shadow-2xl shadow-black/40">
                  {project.isArchived ? (
                    <button
                      type="button"
                      onClick={(event) => { event.preventDefault(); event.stopPropagation(); setMenuOpen(false); onUnarchive?.(project); }}
                      className="flex w-full items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-left text-xs font-semibold text-primary transition hover:bg-primary/10"
                    >
                      <ArchiveRestore className="h-3.5 w-3.5 shrink-0" /> 보관 해제
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(event) => { event.preventDefault(); event.stopPropagation(); setMenuOpen(false); onArchive?.(project); }}
                      className="flex w-full items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-left text-xs font-semibold text-primary transition hover:bg-primary/10"
                    >
                      <Archive className="h-3.5 w-3.5 shrink-0" /> 보관
                    </button>
                  )}
                  {onDelete ? (
                    <button
                      type="button"
                      onClick={(event) => { event.preventDefault(); event.stopPropagation(); setMenuOpen(false); onDelete(project); }}
                      className="flex w-full items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-left text-xs font-semibold text-error transition hover:bg-error/10"
                    >
                      <Trash2 className="h-3.5 w-3.5 shrink-0" /> 삭제
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      <p className="mt-3 min-h-12 text-sm leading-relaxed text-on-surface-variant">{project.description}</p>

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-on-surface-variant">
        <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {project.members}명</span>
        <span className="flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5" /> {project.updatedAt}</span>
      </div>

      <Link href={boardHref} className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-primary/30 bg-primary/10 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
        보드 열기
      </Link>
    </article>
  );
}
