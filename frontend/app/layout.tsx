import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "VoidIDE | AI 기반 실시간 협업 칸반",
  description: "AI 기반 실시간 협업 칸반 시스템 랜딩페이지"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
