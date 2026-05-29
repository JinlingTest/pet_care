import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "茸净宠物洗护",
  description: "茸净宠物洗护提供猫狗洗澡、护理、造型、除浮毛和皮毛状态评估服务。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
