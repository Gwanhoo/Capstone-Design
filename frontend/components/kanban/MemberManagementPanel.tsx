"use client";

import { FormEvent, useEffect, useState } from "react";
import { UserMinus, UserPlus } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { addProjectMember, getProjectById, getProjectMembers, ProjectMember, removeProjectMember } from "@/lib/api/projectApi";

const parseError = (error: unknown) => {
  const message = error instanceof Error ? error.message : "요청 처리 중 오류가 발생했습니다.";
  if (message.includes("401") || message.includes("unauthorized")) return "로그인이 만료되었습니다. 다시 로그인해주세요.";
  if (message.includes("403") || message.includes("권한")) return "권한이 없습니다. 프로젝트 소유자만 수행할 수 있습니다.";
  if (message.includes("404") || message.includes("not found")) return "대상을 찾을 수 없습니다. 이메일 또는 멤버를 확인해주세요.";
  if (message.includes("409") || message.includes("already")) return "이미 프로젝트 멤버로 등록된 사용자입니다.";
  return message;
};

export function MemberManagementPanel({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [projectOwnerId, setProjectOwnerId] = useState<string>("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwner = Boolean(user?.id && projectOwnerId && user.id === projectOwnerId);

  const loadMembers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [project, memberList] = await Promise.all([getProjectById(projectId), getProjectMembers(projectId)]);
      setProjectOwnerId(project.createdBy);
      setMembers(memberList);
    } catch (loadError) {
      setError(parseError(loadError));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [projectId]);

  const handleAdd = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await addProjectMember(projectId, email.trim());
      setEmail("");
      await loadMembers();
    } catch (addError) {
      setError(parseError(addError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    try {
      setError(null);
      await removeProjectMember(projectId, memberId);
      await loadMembers();
    } catch (removeError) {
      setError(parseError(removeError));
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <h3 className="text-sm font-semibold text-on-surface">프로젝트 멤버 관리</h3>

      {isOwner ? (
        <form onSubmit={handleAdd} className="mt-3 flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="초대할 사용자 이메일"
            className="h-9 flex-1 rounded-lg border border-white/10 bg-surface-container-lowest px-3 text-xs text-on-surface"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-3 text-xs text-on-surface transition hover:bg-white/10 disabled:opacity-60"
          >
            <UserPlus className="h-3.5 w-3.5" />
            추가
          </button>
        </form>
      ) : (
        <p className="mt-3 text-xs text-on-surface-variant">멤버 추가/제거는 프로젝트 소유자만 가능합니다.</p>
      )}

      {error ? <p className="mt-2 text-xs text-red-300">{error}</p> : null}

      <div className="mt-3 space-y-2">
        {isLoading ? (
          <p className="text-xs text-on-surface-variant">멤버 목록을 불러오는 중...</p>
        ) : members.length === 0 ? (
          <p className="text-xs text-on-surface-variant">멤버가 없습니다.</p>
        ) : (
          members.map((member) => (
            <div key={member.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-on-surface">{member.name}{member.isOwner ? " (소유자)" : ""}</p>
                <p className="truncate text-[11px] text-on-surface-variant">{member.email}</p>
              </div>
              {isOwner && !member.isOwner ? (
                <button onClick={() => handleRemove(member.id)} className="inline-flex items-center gap-1 text-[11px] text-red-300 transition hover:text-red-200">
                  <UserMinus className="h-3.5 w-3.5" /> 제거
                </button>
              ) : null}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
