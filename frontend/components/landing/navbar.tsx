import { BrainCircuit, Menu } from "lucide-react";

const navItems = ["제품", "기능", "워크플로우", "가격", "문서"];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-none">
      <nav className="mx-auto mt-4 flex w-[min(1200px,calc(100%-2rem))] items-center justify-between rounded-xl bg-[#1c1b1b]/80 px-4 py-3 backdrop-blur-xl md:px-6">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#4f46e5]/25 text-[#c3c0ff]">
            <BrainCircuit className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-[#e5e2e1] md:text-base">VoidIDE</span>
        </div>

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <a key={item} href="#" className="text-sm font-medium text-[#c7c4d8] transition-colors hover:text-[#e5e2e1]">
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button className="hidden rounded-md bg-[#2a2a2a] px-3 py-2 text-sm font-medium text-[#e5e2e1] transition-colors hover:bg-[#353534] md:block">
            로그인
          </button>
          <button className="rounded-md bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] px-3 py-2 text-xs font-semibold text-[#1d00a5] md:px-4 md:text-sm">
            시작하기
          </button>
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#2a2a2a] text-[#c7c4d8] md:hidden">
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </nav>
    </header>
  );
}
