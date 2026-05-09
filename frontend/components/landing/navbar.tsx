import Link from "next/link";

const navItems = [
  { label: "제품", href: "#product" },
  { label: "기능", href: "#features" },
  { label: "작동 방식", href: "#how-it-works" },
  { label: "데모", href: "#demo" },
];

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full bg-surface/80 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-4 py-4 md:px-8">
        <div className="text-xl font-bold tracking-tighter text-on-surface">KanBan Ai</div>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="border-b-2 border-transparent pb-1 text-sm font-medium text-on-surface-variant transition-colors duration-200 hover:border-primary-container hover:text-primary focus-visible:border-primary-container focus-visible:text-primary"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/login" className="px-2 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface md:px-4">
            로그인
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] px-4 py-2 text-sm font-semibold text-[#1d00a5] transition-transform active:scale-95"
          >
            시작하기
          </Link>
        </div>
      </nav>
    </header>
  );
}
