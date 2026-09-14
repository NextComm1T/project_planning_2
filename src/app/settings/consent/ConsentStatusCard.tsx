import Link from "next/link";

import {
  CONSENT_ITEM_LABEL,
  CONSENT_STATUS_LABEL,
  CONSENT_STATUS_TONE,
  type ConsentQueryState,
  type ConsentStatus,
} from "./mock";

/**
 * 동의 상태 배너(디자인 L543-546).
 *
 * 이 화면에서 값이 계정에서 오는 유일한 블록이라 네 상태
 * (`docs/07-screens.md:14`)를 여기서 구분한다. 아래 고지 카드들은 동의 여부와
 * 무관하게 늘 옳은 문구라 불러오는 중에도 가리지 않는다.
 *
 * **읽기 전용이다** — 여기서 동의를 철회하거나 바꿀 수 없다(이슈 #49 제외 범위).
 * 철회에 해당하는 행동은 회원탈퇴(`/settings/withdraw` · #50)다.
 */
export function ConsentStatusCard({
  queryState,
  status,
}: {
  queryState: ConsentQueryState;
  status: ConsentStatus;
}) {
  if (queryState === "error") {
    return (
      <div
        role="alert"
        className="rounded-2xl border-[1.5px] border-error-border bg-error-soft px-5 py-[18px]"
      >
        <p className="text-sm font-bold text-error">
          동의 상태를 불러오지 못했어요.
        </p>
        {/*
          상태가 URL 에 있어서 쿼리를 뗀 주소로 다시 들어가면 서버 컴포넌트가
          실제로 다시 그려진다. 장식이 아니라 진짜 다음 행동이다.
          높이 48px 은 최소 터치 영역(`docs/07-screens.md:15`).
        */}
        <Link
          replace
          href="/settings/consent"
          className="mt-3 flex h-12 items-center justify-center rounded-lg bg-surface text-base font-extrabold text-foreground"
        >
          다시 시도
        </Link>
      </div>
    );
  }

  const loading = queryState === "loading";

  return (
    <div
      aria-busy={loading || undefined}
      className="flex items-center justify-between gap-3 rounded-2xl border-[1.5px] border-primary-border bg-primary-soft px-5 py-4"
    >
      <span className="text-base font-extrabold text-primary-strong">
        {CONSENT_ITEM_LABEL}
      </span>

      {loading ? (
        <>
          {/* 값이 들어와도 줄 높이가 튀지 않도록 자리를 지킨다. */}
          <span
            aria-hidden="true"
            className="block h-[18px] w-14 shrink-0 animate-pulse rounded-full bg-primary-border"
          />
          <span role="status" className="sr-only">
            동의 상태를 불러오는 중이에요
          </span>
        </>
      ) : (
        <span
          className={`shrink-0 text-sm font-extrabold ${CONSENT_STATUS_TONE[status]}`}
        >
          {CONSENT_STATUS_LABEL[status]}
        </span>
      )}
    </div>
  );
}
