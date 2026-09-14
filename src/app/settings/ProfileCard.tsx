import Link from "next/link";

import type { SettingsProfile, SettingsState } from "./mock";
import { ROW_CLASS, ROW_DIVIDER_CLASS, RowChevron } from "./SettingsRow";
import { SettingsCard, SettingsSection } from "./SettingsSection";

/** 내 정보 줄의 작은 라벨(디자인 L388 `12/700 #8B93A5`). */
function RowLabel({ children }: { children: string }) {
  return <p className="mb-[5px] text-label font-bold text-muted">{children}</p>;
}

/** 값을 불러오는 동안 자리를 지키는 막대. 값이 들어와도 줄 높이가 튀지 않는다. */
function ValueSkeleton({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block h-[18px] animate-pulse rounded-full bg-surface-muted ${className}`}
    />
  );
}

/**
 * 「내 정보」 섹션(디자인 L384-401). 이 화면에서 서버 데이터를 쓰는 유일한 블록이라
 * 네 상태(`docs/07-screens.md:14`)를 여기서 구분한다.
 *
 * 메뉴 줄들은 서버 값과 무관하게 늘 옳으므로 스켈레톤으로 가리지 않는다 —
 * 가릴 이유가 없는 것을 가리면 거짓말이 되고 레이아웃도 흔들린다.
 */
export function ProfileCard({
  state,
  profile,
}: {
  state: SettingsState;
  profile: SettingsProfile;
}) {
  if (state === "error") {
    return (
      <SettingsSection title="내 정보">
        <div
          role="alert"
          className="rounded-2xl border-[1.5px] border-error-border bg-error-soft px-5 py-[18px]"
        >
          <p className="text-sm font-bold text-error">
            계정 정보를 불러오지 못했어요.
          </p>
          {/*
            상태가 URL 에 있어서 `?state=error` 를 뗀 주소로 다시 들어가면
            서버 컴포넌트가 실제로 다시 그려진다. 장식이 아니라 진짜 다음 행동이다.
            높이 48px 은 최소 터치 영역(`docs/07-screens.md:15`).
          */}
          <Link
            replace
            href="/settings"
            className="mt-3 flex h-12 items-center justify-center rounded-lg bg-surface text-base font-extrabold text-foreground"
          >
            다시 시도
          </Link>
        </div>
      </SettingsSection>
    );
  }

  const loading = state === "loading";

  return (
    <SettingsSection title="내 정보">
      <SettingsCard busy={loading}>
        <li className={ROW_DIVIDER_CLASS}>
          {loading ? (
            <div className={`${ROW_CLASS} py-[18px]`}>
              <div>
                <RowLabel>닉네임</RowLabel>
                <ValueSkeleton className="w-24" />
              </div>
            </div>
          ) : (
            <Link
              href="/settings/nickname"
              className={`${ROW_CLASS} py-[18px]`}
            >
              <div>
                <RowLabel>닉네임</RowLabel>
                {profile.nickname ? (
                  <p className="text-lg font-extrabold text-foreground">
                    {profile.nickname}
                  </p>
                ) : (
                  // 계정 상태 "가입 중" — 소셜 인증은 끝났지만 닉네임이 아직 없다
                  // (`docs/06-data.md:19` · P11).
                  <p className="text-lg font-extrabold text-disabled">
                    아직 없어요
                  </p>
                )}
              </div>
              <span className="flex shrink-0 items-center gap-1 text-primary">
                <span className="text-content font-extrabold">
                  {profile.nickname ? "수정" : "설정"}
                </span>
                <RowChevron />
              </span>
            </Link>
          )}
        </li>

        <li className={`${ROW_DIVIDER_CLASS} ${ROW_CLASS} py-[18px]`}>
          <div>
            <RowLabel>로그인 계정</RowLabel>
            {loading ? (
              <ValueSkeleton className="w-16" />
            ) : (
              <p className="text-lg font-extrabold text-foreground">
                {profile.loginProvider}
              </p>
            )}
          </div>
        </li>
      </SettingsCard>

      {loading ? (
        <p role="status" className="sr-only">
          계정 정보를 불러오는 중이에요
        </p>
      ) : null}
    </SettingsSection>
  );
}
