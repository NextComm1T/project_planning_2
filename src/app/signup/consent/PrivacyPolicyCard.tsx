import Link from "next/link";

/**
 * 개인정보처리방침으로 가는 카드 — 디자인 L121-126.
 *
 * 위쪽 여백 14px 은 디자인에서 이 카드가 가진 값이다(L121).
 */
export function PrivacyPolicyCard() {
  return (
    <Link
      href="/privacy-policy"
      className="mt-[14px] flex items-center justify-between rounded-2xl border-[1.5px] border-border bg-surface px-5 py-[17px] shadow-card"
    >
      <span className="text-base font-bold">개인정보처리방침 보기</span>
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
        className="shrink-0 text-disabled"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </Link>
  );
}
