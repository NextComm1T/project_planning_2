"use client";

import { useRouter } from "next/navigation";

type BackButtonProps = {
  /** 지정하면 history 뒤로가기 대신 이 경로로 이동한다. */
  href?: string;
  /** 스크린리더가 읽을 이름. */
  label?: string;
};

/**
 * 공통 뒤로 가기 버튼.
 *
 * 시각 크기는 디자인대로 40×40 을 유지하되, ::after 로 터치 영역만
 * 48×48 로 넓힌다 — docs/07-screens.md:15 의 최소 터치 영역 규칙.
 */
export function BackButton({ href, label = "뒤로 가기" }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => (href ? router.push(href) : router.back())}
      className="relative flex size-10 shrink-0 items-center justify-center rounded-sm bg-surface-muted text-foreground after:absolute after:-inset-1 after:content-['']"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}
