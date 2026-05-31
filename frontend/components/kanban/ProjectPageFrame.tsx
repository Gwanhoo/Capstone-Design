"use client";

import { ReactNode, useEffect, useState } from "react";
import { ProjectSidebar } from "./ProjectSidebar";
import { getProjectById, Project } from "@/lib/api/projectApi";

export function ProjectPageFrame({ projectId, title, description, children }: { projectId: string; title: string; description: string; children: ReactNode }) {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    getProjectById(projectId).then(setProject).catch(() => setProject(null));
  }, [projectId]);

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      <ProjectSidebar projectId={projectId} projectName={project?.name} />
      <main className="min-w-0 flex-1 p-6">
        <div className="mx-auto max-w-6xl">
          <header className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-on-surface-variant">{description}</p>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}
