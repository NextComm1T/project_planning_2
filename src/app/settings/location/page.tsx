import { AppShell } from "@/components/shared/AppShell";
import { Header } from "@/components/shared/Header";

import { DotList, InfoCard, InfoParagraph } from "./InfoCard";
import {
  needsPermissionAction,
  STORED_ITEMS,
  USAGE_PERIOD,
  USAGE_REASONS,
  WITHOUT_PERMISSION,
  type LocationPermission,
  type LocationQueryState,
} from "./mock";
import { PermissionStatusCard } from "./PermissionStatusCard";

/**
 * 서버도, 브라우저 권한 조회도 아직 없어서 네 상태를 실제로 만들 수 없다.
 * 설정 화면(#46)과 로그인 화면(`/login?error=cancelled`)이 이미 쓰는 방식 그대로
 * URL 쿼리로 고른다 — 리뷰어가 코드를 고치지 않고 눈으로 확인할 수 있고,
 * 나중에 실제 권한 조회가 붙으면 이 자리가 그대로 조회 결과로 바뀐다.
 * 모르는 값은 정상으로 묶어 원인 코드를 화면에 그대로 보이지 않는다.
 */
function resolveQueryState(raw: string | string[] | undefined): LocationQueryState {
  const value = Array.isArray(raw) ? raw[0] : raw;

  return value === "loading" || value === "error" ? value : "ready";
}

/**
 * 권한 조회 결과. `?state=empty` 는 조회 결과가 비는 경우라
 * 권한을 알 수 없는 상태(`unknown`)와 같은 것을 가리킨다.
 */
function resolvePermission(
  stateRaw: string | string[] | undefined,
  permissionRaw: string | string[] | undefined,
): LocationPermission {
  const state = Array.isArray(stateRaw) ? stateRaw[0] : stateRaw;
  if (state === "empty") return "unknown";

  const value = Array.isArray(permissionRaw) ? permissionRaw[0] : permissionRaw;

  return value === "denied" ? "denied" : "granted";
}

export default async function LocationSettingsPage({
  searchParams,
}: PageProps<"/settings/location">) {
  const { state, permission: permissionParam } = await searchParams;

  const queryState = resolveQueryState(state);
  const permission = resolvePermission(state, permissionParam);

  // 허용 여부를 확신할 수 있을 때만 버튼을 판단한다. 불러오는 중이거나 조회에
  // 실패했을 때는 띄우지 않는다 — 조회 실패의 다음 행동은 "다시 시도"다.
  const showPermissionAction =
    queryState === "ready" && needsPermissionAction(permission);

  return (
    // 설정에서 들어오는 서브 화면이라 탭바가 없다. 뒤로 가기 목적지가
    // `/settings` 로 정해져 있어 `backHref` 를 준다(디자인 L441 `onBackToSettings`).
    <AppShell
      header={
        <Header
          showBack
          backHref="/settings"
          title={
            // 디자인 L445-446 — 작은 "설정" 위에 화면 이름이 온다.
            <>
              <span className="mb-0.5 block text-label font-semibold text-muted">
                설정
              </span>
              <span className="block">위치정보</span>
            </>
          }
        />
      }
    >
      <div className="flex flex-col gap-3 py-[22px]">
        <PermissionStatusCard queryState={queryState} permission={permission} />

        <InfoCard title="위치정보를 사용하는 이유">
          <DotList items={USAGE_REASONS} />
        </InfoCard>

        <InfoCard title="저장되는 위치정보">
          <DotList items={STORED_ITEMS} />
        </InfoCard>

        <InfoCard title="사용 시점">
          <InfoParagraph>{USAGE_PERIOD}</InfoParagraph>
        </InfoCard>

        <InfoCard title="권한을 허용하지 않을 경우">
          <InfoParagraph>{WITHOUT_PERMISSION}</InfoParagraph>
        </InfoCard>

        {showPermissionAction ? (
          /*
            TODO(F1 · R1 · P1): 실제 위치 권한 요청을 연결한다. 브라우저·OS 권한
            요청은 이슈 #47 의 제외 범위이고, 눌렀을 때 가짜로 허용된 척하지
            않는다 — 로그인 버튼(`SocialLoginButtons.tsx`)과 같은 상태다.
          */
          <button
            type="button"
            className="mt-1.5 h-[58px] w-full rounded-xl bg-primary text-button font-extrabold text-on-primary shadow-primary"
          >
            위치 권한 허용하기
          </button>
        ) : null}
      </div>
    </AppShell>
  );
}
