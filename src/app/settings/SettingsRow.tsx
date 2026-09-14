import Link from "next/link";
import type { ReactNode } from "react";

/**
 * 카드 안 한 줄의 공통 배치. 세로 여백은 줄마다 달라서(메뉴 17px · 내 정보 18px)
 * 여기 넣지 않고 쓰는 쪽에서 붙인다 — 임의값끼리 겹치면 어느 쪽이 이길지
 * 클래스 순서가 아니라 생성된 CSS 순서가 정해 버리기 때문이다.
 */
export const ROW_CLASS =
  "flex w-full items-center justify-between gap-3 px-5 text-left";

/**
 * 줄 사이 구분선(디자인 L395 `border-top:1px solid #F1EDE2`).
 * 카드 테두리는 1.5px 인데 이 선은 1px 로, 굵기가 다르다.
 */
export const ROW_DIVIDER_CLASS = "border-t border-surface-muted first:border-t-0";

/** 오른쪽 끝 쉐브론(디자인 L393). 색은 감싸는 쪽에서 정한다. */
export function RowChevron() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

/** 다른 화면으로 나가는 줄(디자인 L405 · L412 · L416 · L429). */
export function SettingsLinkRow({
  href,
  label,
  labelClassName = "text-foreground",
  trailing,
  trailingClassName = "text-disabled",
}: {
  href: string;
  label: string;
  labelClassName?: string;
  trailing?: ReactNode;
  trailingClassName?: string;
}) {
  return (
    <li className={ROW_DIVIDER_CLASS}>
      <Link href={href} className={`${ROW_CLASS} py-[17px]`}>
        <span className={`text-base font-bold ${labelClassName}`}>{label}</span>
        <span
          className={`flex shrink-0 items-center gap-[5px] ${trailingClassName}`}
        >
          {trailing}
          <RowChevron />
        </span>
      </Link>
    </li>
  );
}

/**
 * 진행 중인 러닝 때문에 막힌 줄(P12 · `docs/05-policy.md:25`).
 *
 * `disabled` 를 쓰지 않는 이유: 탭 순서에서 빠지고 스크린리더가 건너뛰어
 * 「왜 막혔는지」를 알 수 없다. `aria-disabled` 로 두고 `aria-describedby` 로
 * 같은 카드 안의 안내 문구를 읽게 한다. 누를 수는 있지만 아무 일도 하지 않는다.
 */
export function SettingsBlockedRow({
  label,
  labelClassName = "text-foreground",
  describedBy,
}: {
  label: string;
  labelClassName?: string;
  describedBy: string;
}) {
  return (
    <li className={ROW_DIVIDER_CLASS}>
      <button
        type="button"
        aria-disabled="true"
        aria-describedby={describedBy}
        className={`${ROW_CLASS} py-[17px] opacity-60`}
      >
        <span className={`text-base font-bold ${labelClassName}`}>{label}</span>
        <span className="flex shrink-0 items-center text-disabled">
          <RowChevron />
        </span>
      </button>
    </li>
  );
}
