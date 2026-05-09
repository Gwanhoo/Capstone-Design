"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthFooterLink } from "@/components/auth/AuthFooterLink";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordMismatch = useMemo(() => {
    if (!confirmPassword) {
      return false;
    }
    return password !== confirmPassword;
  }, [password, confirmPassword]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passwordMismatch) {
      return;
    }
    // TODO: 백엔드 회원가입 API 연동
  };

  return (
    <AuthLayout>
      <AuthCard title="회원가입" description="새 계정을 만들고 협업을 시작하세요">
        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthInput id="email" label="이메일" type="email" placeholder="name@company.com" value={email} onChange={setEmail} icon={Mail} />
          <AuthInput id="password" label="비밀번호" type="password" placeholder="••••••••" value={password} onChange={setPassword} icon={Lock} />
          <AuthInput id="confirm-password" label="비밀번호 확인" type="password" placeholder="••••••••" value={confirmPassword} onChange={setConfirmPassword} icon={ShieldCheck} />

          {passwordMismatch ? <p className="text-sm text-error">비밀번호가 일치하지 않습니다.</p> : null}

          <p className="px-4 text-center text-[11px] leading-relaxed text-outline">
            가입 시 <span className="cursor-pointer text-on-surface transition-colors hover:text-primary">이용약관</span> 및{" "}
            <span className="cursor-pointer text-on-surface transition-colors hover:text-primary">개인정보처리방침</span>에 동의하게 됩니다.
          </p>

          <button
            type="submit"
            className="group mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] py-3.5 font-bold text-[#1d00a5] shadow-lg transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
          >
            <span>회원가입</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>
      </AuthCard>
      <AuthFooterLink text="이미 계정이 있으신가요?" linkText="로그인" href="/login" />
    </AuthLayout>
  );
}
