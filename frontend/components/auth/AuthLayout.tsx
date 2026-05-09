import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface px-6 text-on-surface" style={{ fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif" }}>
      <div className="pointer-events-none absolute -left-[10%] -top-[10%] h-[50%] w-[50%] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full bg-tertiary/10 blur-[120px]" />
      <section className="relative z-10 w-full max-w-[420px]">
        <div className="mb-10 flex flex-col items-center">
          <Link href="/" className="mb-2 flex items-center gap-2 text-on-surface transition-opacity hover:opacity-90" aria-label="KanBan Ai 홈으로 이동">
            <LayoutGrid className="h-7 w-7 text-primary" />
            <span className="text-2xl font-black tracking-tighter">KanBan Ai</span>
          </Link>
          <div className="h-px w-8 bg-primary/30" />
        </div>
        {children}
      </section>
    </main>
  );
}
