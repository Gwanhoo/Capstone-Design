import Link from "next/link";
import { CalendarClock, Users } from "lucide-react";
import { ProjectItem } from "./types";

const statusStyle = {
  진행중: "bg-primary/20 text-primary",
  보관됨: "bg-emerald-400/20 text-emerald-300",
};

export function ProjectCard({ project }: { project: ProjectItem }) {
  const boardHref = `/projects/${encodeURIComponent(project.id)}/board`;

  return (
    <article className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_10px_28px_rgba(0,0,0,0.3)] transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_36px_rgba(0,0,0,0.45)]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-on-surface">{project.name}</h3>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[project.status]}`}>{project.status}</span>
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
