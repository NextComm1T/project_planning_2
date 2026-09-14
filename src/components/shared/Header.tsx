import type { ReactNode } from "react";

import { BackButton } from "./BackButton";

type HeaderProps = {
  /** 없으면 타이틀 없는 헤더가 된다. */
  title?: ReactNode;
  /** 없으면 뒤로 가기 없는 헤더가 된다. */
  showBack?: boolean;
  /**
   * 지정하면 history 뒤로가기 대신 이 경로로 이동한다.
   * 결과 화면처럼 뒤로 갈 목적지가 정해진 경우에 쓴다(docs/07-screens.md:59).
   */
  backHref?: string;
  /** 우측 액션 슬롯(설정 아이콘, "전체보기" 링크 등). */
  right?: ReactNode;
};

/**
 * 화면 상단 공통 헤더.
 *
 * 화면별 조건은 전부 props 로만 제어한다 — 화면 이름이나 분기를
 * 이 안에 하드코딩하지 않는다.
 */
export function Header({ title, showBack = false, backHref, right }: HeaderProps) {
  return (
    <header className="sticky top-0 z-[5] flex items-center gap-3 border-b-[1.5px] border-surface-muted bg-background px-4 pt-[calc(4px+env(safe-area-inset-top))] pb-3.5">
      {showBack ? <BackButton href={backHref} /> : null}

      {title ? (
        <h1 className="min-w-0 truncate text-title font-extrabold">{title}</h1>
      ) : null}

      {right ? (
        <div className="ml-auto flex shrink-0 items-center gap-2">{right}</div>
      ) : null}
    </header>
  );
}
