const links = ["개인정보처리방침", "이용약관", "보안", "상태", "문의"];

export function Footer() {
  return (
    <footer className="px-6 pb-10 md:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 rounded-xl bg-[#0e0e0e] px-5 py-5 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-[#918fa1]">© 2026 Kinetic Void Labs. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-4">
          {links.map((link) => (
            <a key={link} href="#" className="text-xs text-[#c7c4d8] transition-colors hover:text-[#e5e2e1]">
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
