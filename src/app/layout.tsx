import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Myeverok - 物流后台管理系统",
  description: "Myeverok国际供应链物流后台管理系统",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
