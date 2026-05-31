import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Kanban AI | AI 기반 실시간 협업 칸반",
  description: "AI 기반 실시간 협업 칸반 시스템 랜딩페이지"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className={inter.className}><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
