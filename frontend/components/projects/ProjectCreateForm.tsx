"use client";

import Link from "next/link";
import { FormEvent, KeyboardEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { createProject } from "@/lib/api/projectApi";

type ProjectStatus = "진행중" | "대기중";

export function ProjectCreateForm() {
  const router = useRouter();
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invites, setInvites] = useState<string[]>([]);
  const [status, setStatus] = useState<ProjectStatus>("진행중");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddInvite = () => {
    const trimmed = inviteEmail.trim();

    if (!trimmed || invites.includes(trimmed)) {
      return;
    }

    setInvites((prev) => [...prev, trimmed]);
    setInviteEmail("");
  };

  const handleInviteKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddInvite();
    }
  };

  const handleRemoveInvite = (email: string) => {
    setInvites((prev) => prev.filter((item) => item !== email));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!projectName.trim()) {
      setError("프로젝트 이름은 필수입니다.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const created = await createProject({
        name: projectName.trim(),
        description: description.trim(),
      });
      router.push(`/projects/${created.id}/board`);
    } catch (submitError) {
      console.error(submitError);
      setError("프로젝트 생성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">새 프로젝트 생성</h1>
          <p className="mt-1 text-sm text-on-surface-variant">AI와 함께 관리할 새로운 협업 프로젝트를 만들어보세요.</p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-medium text-on-surface transition hover:bg-white/10"
        >
          대시보드로 돌아가기
        </Link>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-7"
      >
        <div className="space-y-5">
          <div>
            <label htmlFor="project-name" className="mb-2 block text-sm font-medium text-on-surface">
              프로젝트 이름 <span className="text-tertiary">*</span>
            </label>
            <input
              id="project-name"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              required
              placeholder="예: AI 협업 칸반 시스템"
              className="h-12 w-full rounded-xl border border-white/10 bg-surface-container-lowest px-4 text-sm text-on-surface outline-none transition placeholder:text-outline focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-on-surface">프로젝트 설명</label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="프로젝트의 목적과 핵심 내용을 간단히 작성해주세요."
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none transition placeholder:text-outline focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="goal" className="mb-2 block text-sm font-medium text-on-surface">프로젝트 목표</label>
            <textarea
              id="goal"
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              placeholder="이 프로젝트에서 달성하고 싶은 목표를 작성해주세요."
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none transition placeholder:text-outline focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="invite" className="mb-2 block text-sm font-medium text-on-surface">팀원 초대</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="invite"
                type="email"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                onKeyDown={handleInviteKeyDown}
                placeholder="팀원의 이메일을 입력하세요"
                className="h-12 flex-1 rounded-xl border border-white/10 bg-surface-container-lowest px-4 text-sm text-on-surface outline-none transition placeholder:text-outline focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={handleAddInvite}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-medium text-on-surface transition hover:bg-white/10"
              >
                <Plus className="h-4 w-4" />
                추가
              </button>
            </div>

            <ul className="mt-3 space-y-2">
              {invites.length === 0 ? (
                <li className="rounded-xl border border-dashed border-white/10 px-3 py-2 text-sm text-on-surface-variant">
                  아직 초대된 팀원이 없습니다.
                </li>
              ) : (
                invites.map((email) => (
                  <li
                    key={email}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-on-surface"
                  >
                    <span>{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInvite(email)}
                      className="inline-flex items-center gap-1 text-on-surface-variant transition hover:text-error"
                    >
                      <Trash2 className="h-4 w-4" />
                      삭제
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div>
            <label htmlFor="status" className="mb-2 block text-sm font-medium text-on-surface">초기 상태</label>
            <select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value as ProjectStatus)}
              className="h-12 w-full rounded-xl border border-white/10 bg-surface-container-lowest px-4 text-sm text-on-surface outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
            >
              <option value="진행중">진행중</option>
              <option value="대기중">대기중</option>
            </select>
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 text-sm font-medium text-on-surface transition hover:bg-white/10"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] px-5 text-sm font-semibold text-[#1d00a5] shadow-lg transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "생성 중..." : "프로젝트 생성"}
          </button>
        </div>
      </form>
    </section>
  );
}
