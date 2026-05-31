"use client";

import { FormEvent, useEffect, useState } from "react";
import { ProjectPageFrame } from "@/components/kanban/ProjectPageFrame";
import { getProjectById, getProjectMembers, ProjectMember, updateProject } from "@/lib/api/projectApi";
import { createProjectInvitation } from "@/lib/api/invitationApi";

export default function ProjectSettingsPage({ params }: { params: { projectId: string } }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const [project, memberData] = await Promise.all([getProjectById(params.projectId), getProjectMembers(params.projectId)]);
    setName(project.name);
    setDescription(project.description);
    setMembers(memberData);
  };

  useEffect(() => { load().catch(() => setError("프로젝트 설정을 불러오지 못했습니다.")); }, [params.projectId]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await updateProject(params.projectId, { name, description });
      setMessage("프로젝트 정보가 저장되었습니다.");
    } catch {
      setError("프로젝트 정보 저장에 실패했습니다.");
    }
  };

  const invite = async () => {
    try {
      setError(null);
      await createProjectInvitation(params.projectId, inviteEmail);
      setInviteEmail("");
      setMessage("초대를 보냈습니다.");
    } catch {
      setError("멤버 추가에 실패했습니다.");
    }
  };

  return (
    <ProjectPageFrame projectId={params.projectId} title="프로젝트 설정" description="프로젝트 정보와 멤버를 관리하세요.">
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <form onSubmit={save} className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-semibold">기본 정보</h2>
          <input value={name} onChange={(event) => setName(event.target.value)} className="mt-4 h-11 w-full rounded-xl border border-white/10 bg-surface-container-lowest px-3 text-sm" placeholder="프로젝트 이름" />
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={5} className="mt-3 w-full rounded-xl border border-white/10 bg-surface-container-lowest p-3 text-sm" placeholder="프로젝트 설명" />
          <button className="mt-3 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">저장</button>
          {message ? <p className="mt-3 text-sm text-emerald-300">{message}</p> : null}
          {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
        </form>
        <aside className="space-y-5">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="font-semibold">멤버</h2>
            <div className="mt-3 space-y-2">{members.map((member) => <div key={member.id} className="rounded-xl bg-black/20 p-3 text-sm"><p className="font-semibold">{member.name}{member.isOwner ? " · Owner" : ""}</p><p className="text-on-surface-variant">{member.email}</p></div>)}</div>
          </section>
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="font-semibold">초대</h2>
            <input value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} className="mt-3 h-10 w-full rounded-xl border border-white/10 bg-surface-container-lowest px-3 text-sm" placeholder="email@example.com" />
            <button onClick={invite} type="button" className="mt-3 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">초대 보내기</button>
          </section>
        </aside>
      </div>
    </ProjectPageFrame>
  );
}
