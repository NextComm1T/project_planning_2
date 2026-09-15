"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import runIcon from "@assets/icon-otter-run-v2.png";

/** 활성 ↔ 비활성 아이콘 선 굵기 (디자인 L1370-1373). */
const STROKE_ACTIVE = 2.6;
const STROKE_INACTIVE = 1.9;

type Tab = {
  label: string;
  href: string;
  /** 굵기는 활성 여부에 따라 달라져서 렌더 시점에 받는다. */
  icon: (strokeWidth: number) => ReactNode;
};

/**
 * 달리기 탭은 SVG 가 아니라 PNG 마스크다(디자인 L923).
 * 이미지를 그대로 그리면 색이 고정되므로, 마스크로 잘라 내고 면을
 * currentColor 로 칠해 활성 색을 따라가게 한다.
 */
function RunIcon() {
  return (
    <span
      aria-hidden="true"
      className="mt-[3px] block size-[25px] bg-current"
      style={{
        maskImage: `url(${runIcon.src})`,
        WebkitMaskImage: `url(${runIcon.src})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

const TABS: Tab[] = [
  {
    // 문서는 `/` 지만 `/` 는 로그인 redirect 자리라 탭 대상이 될 수 없다.
    // → `/home` (이슈 #34 결정 이력 · modify/2026-09-15-bottomnav.md)
    label: "달리기",
    href: "/home",
    icon: () => <RunIcon />,
  },
  {
    label: "랭킹",
    href: "/ranking",
    icon: (strokeWidth) => (
      <svg
        width="23"
        height="23"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 9H3.5a1 1 0 01-1-1V5h3.5M18 9h2.5a1 1 0 001-1V5H18" />
        <path d="M6 5h12v5a6 6 0 01-12 0V5z" />
        <path d="M12 16v4" />
        <path d="M8.5 20h7" />
      </svg>
    ),
  },
  {
    label: "기록",
    href: "/records",
    icon: (strokeWidth) => (
      <svg
        width="23"
        height="23"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" />
      </svg>
    ),
  },
];

/**
 * 홈의 3개 탭이 공유하는 하단 탭바(디자인 L921-934).
 *
 * 탭바가 없어야 하는 화면(로그인 · 가입 · 러닝 진행 · 결과 · 설정 하위)은
 * AppShell 의 bottom 슬롯을 비워 두면 된다 — 여기서 경로를 분기하지 않는다.
 *
 * 설정은 탭이 아니라 홈 헤더의 기어로 들어간다(modify/2026-09-14.md 1번).
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="주요 화면"
      className="grid grid-cols-3 border-t-[1.5px] border-surface-muted bg-surface pb-1.5"
    >
      {TABS.map(({ label, href, icon }) => {
        // 하위 경로(/records/[sessionId])에서도 그 탭이 활성이어야 한다.
        const isActive = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            // 칸 높이 65px · 폭 130px 라 최소 터치 영역 48×48 을 넘는다(07-screens.md:15).
            className={`flex flex-col items-center justify-center gap-[5px] pt-[11px] pb-[7px] ${
              isActive ? "text-primary" : "text-disabled"
            }`}
          >
            {icon(isActive ? STROKE_ACTIVE : STROKE_INACTIVE)}
            <span className="text-[11.5px] font-extrabold">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
