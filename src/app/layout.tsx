import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "탄천런",
  description: "성남 탄천에서 달린 거리로 이웃 러너들과 가볍게 경쟁하는 러닝 앱",
};

export const viewport: Viewport = {
  themeColor: "#FBF7EF",
  // AppShell 과 Header 가 env(safe-area-inset-*) 를 쓰려면 필요하다.
  viewportFit: "cover",
};

/**
 * 모든 화면에 공통으로 걸리는 것만 둔다.
 *
 * AppShell 은 여기에 넣지 않는다 — 넣으면 모든 페이지에 같은 헤더가 박혀서
 * 화면별 header 상태를 분리할 수 없다. 각 화면이 스스로 AppShell 을 감싼다.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
