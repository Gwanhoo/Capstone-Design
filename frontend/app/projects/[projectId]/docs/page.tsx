"use client";

import { useEffect, useState } from "react";
import { ProjectPageFrame } from "@/components/kanban/ProjectPageFrame";
import { getProjectById, getProjectDocs, updateProjectDocs } from "@/lib/api/projectApi";

export default function ProjectDocsPage({ params }: { params: { projectId: string } }) {
  const [description, setDescription] = useState("");
  const [docs, setDocs] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getProjectById(params.projectId), getProjectDocs(params.projectId)]).then(([project, docData]) => {
      setDescription(project.description || "프로젝트 설명이 없습니다.");
      setDocs(docData.docs);
    });
  }, [params.projectId]);

  const save = async () => {
    const result = await updateProjectDocs(params.projectId, docs);
    setDocs(result.docs);
    setMessage("문서가 저장되었습니다.");
  };

  return (
    <ProjectPageFrame projectId={params.projectId} title="문서" description="프로젝트 설명과 팀 메모를 관리하세요.">
      <section className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="font-semibold">프로젝트 설명</h2><p className="mt-2 text-sm text-on-surface-variant">{description}</p></div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-semibold">팀 문서 / 메모</h2>
          <textarea value={docs} onChange={(event) => setDocs(event.target.value)} rows={12} className="mt-3 w-full rounded-xl border border-white/10 bg-surface-container-lowest p-3 text-sm" placeholder="회의록, 결정 사항, 참고 링크를 기록하세요." />
          <button onClick={save} className="mt-3 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">저장</button>
          {message ? <span className="ml-3 text-sm text-emerald-300">{message}</span> : null}
        </div>
      </section>
    </ProjectPageFrame>
  );
}
