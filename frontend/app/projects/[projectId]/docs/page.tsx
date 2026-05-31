"use client";

import { useEffect, useState } from "react";
import { ProjectPageFrame } from "@/components/kanban/ProjectPageFrame";
import { getProjectById, getProjectDocs, updateProjectDocs } from "@/lib/api/projectApi";

export default function ProjectDocsPage({ params }: { params: { projectId: string } }) {
  const [description, setDescription] = useState("");
  const [docs, setDocs] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [project, docData] = await Promise.all([getProjectById(params.projectId), getProjectDocs(params.projectId)]);
        setDescription(project.description || "프로젝트 설명이 없습니다.");
        setDocs(docData.docs);
      } catch (_loadError) {
        setError("문서를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [params.projectId]);

  const save = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setMessage(null);
      const result = await updateProjectDocs(params.projectId, docs);
      setDocs(result.docs);
      setMessage("문서가 저장되었습니다.");
    } catch (_saveError) {
      setError("문서 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProjectPageFrame projectId={params.projectId} title="문서" description="프로젝트 설명과 팀 메모를 관리하세요.">
      <section className="space-y-4">
        {isLoading ? <p className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-on-surface-variant">문서를 불러오는 중...</p> : null}
        {error ? <p className="rounded-2xl border border-red-400/20 bg-red-500/5 p-5 text-sm text-red-300">{error}</p> : null}
        {!isLoading ? (
          <>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="font-semibold">프로젝트 설명</h2><p className="mt-2 text-sm text-on-surface-variant">{description}</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="font-semibold">팀 문서 / 메모</h2>
              <textarea value={docs} onChange={(event) => setDocs(event.target.value)} rows={12} className="mt-3 w-full rounded-xl border border-white/10 bg-surface-container-lowest p-3 text-sm" placeholder="회의록, 결정 사항, 참고 링크를 기록하세요." />
              <button onClick={save} disabled={isSaving} className="mt-3 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{isSaving ? "저장 중..." : "저장"}</button>
              {message ? <span className="ml-3 text-sm text-emerald-300">{message}</span> : null}
            </div>
          </>
        ) : null}
      </section>
    </ProjectPageFrame>
  );
}
