import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { LinksProvider } from "./context/LinksContext";
import { SITE_NAME, SITE_DESCRIPTION, baseOpenGraph } from "./shared-metadata";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  // OG 이미지 등 상대 경로 메타 태그를 절대 URL로 만들 기준 주소 (배포 시 NEXT_PUBLIC_SITE_URL 설정)
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} - 링크 관리 앱`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["북마크", "즐겨찾기", "링크 관리", "링크 저장", "bookmark"],
  // 아이콘: app/favicon.ico 파일 규칙으로 <link rel="icon"> 자동 생성
  openGraph: {
    ...baseOpenGraph,
    url: "/",
    title: `${SITE_NAME} - 링크 관리 앱`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - 링크 관리 앱`,
    description: SITE_DESCRIPTION,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#2AC1BC",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LinksProvider>{children}</LinksProvider>
      </body>
    </html>
  );
}
