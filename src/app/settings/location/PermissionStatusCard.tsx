import Link from "next/link";

import {
  PERMISSION_LABEL,
  PERMISSION_TONE,
  type LocationPermission,
  type LocationQueryState,
} from "./mock";

const CARD_CLASS =
  "rounded-2xl border-[1.5px] border-border bg-surface px-5 py-[18px] shadow-card";

/**
 * 현재 권한 상태 카드(디자인 L450-453).
 *
 * 이 화면에서 값이 서버·브라우저에서 오는 유일한 블록이라 네 상태
 * (`docs/07-screens.md:14`)를 여기서 구분한다. 아래 안내 카드들은 권한 상태와
 * 무관하게 늘 옳은 문구라 불러오는 중에도 가리지 않는다.
 */
export function PermissionStatusCard({
  queryState,
  permission,
}: {
  queryState: LocationQueryState;
  permission: LocationPermission;
}) {
  if (queryState === "error") {
    return (
      <div
        role="alert"
        className="rounded-2xl border-[1.5px] border-error-border bg-error-soft px-5 py-[18px]"
      >
        <p className="text-sm font-bold text-error">
          권한 상태를 확인하지 못했어요.
        </p>
        {/*
          상태가 URL 에 있어서 쿼리를 뗀 주소로 다시 들어가면 서버 컴포넌트가
          실제로 다시 그려진다. 장식이 아니라 진짜 다음 행동이다.
          높이 48px 은 최소 터치 영역(`docs/07-screens.md:15`).
        */}
        <Link
          replace
          href="/settings/location"
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
      className={`${CARD_CLASS} flex items-center justify-between gap-3`}
    >
      <span className="text-base font-bold text-foreground">
        현재 권한 상태
      </span>

      {loading ? (
        <>
          {/* 값이 들어와도 줄 높이가 튀지 않도록 자리를 지킨다. */}
          <span
            aria-hidden="true"
            className="block h-[18px] w-14 animate-pulse rounded-full bg-surface-muted"
          />
          <span role="status" className="sr-only">
            위치 권한 상태를 확인하는 중이에요
          </span>
        </>
      ) : (
        <span
          className={`text-content font-extrabold ${PERMISSION_TONE[permission]}`}
        >
          {PERMISSION_LABEL[permission]}
        </span>
      )}
    </div>
  );
}
