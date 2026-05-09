"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthFooterLink } from "@/components/auth/AuthFooterLink";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: 백엔드 인증 API 연동
  };

  return (
    <AuthLayout>
      <AuthCard title="로그인" description="계정에 로그인하고 협업을 이어가세요">
        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthInput id="email" label="이메일" type="email" placeholder="name@company.com" value={email} onChange={setEmail} icon={Mail} />
          <AuthInput id="password" label="비밀번호" type="password" placeholder="••••••••" value={password} onChange={setPassword} icon={Lock} />

          <button
            type="submit"
            className="group mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] py-3.5 font-bold text-[#1d00a5] shadow-lg transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
          >
            <span>로그인</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>
      </AuthCard>
      <AuthFooterLink text="아직 계정이 없으신가요?" linkText="회원가입" href="/signup" />
    </AuthLayout>
  );
}
