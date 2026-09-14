import { AppShell } from "@/components/shared/AppShell";
import { Header } from "@/components/shared/Header";

import { ConsentStatusCard } from "./ConsentStatusCard";
import { DotList, InfoCard, InfoParagraph } from "./InfoCard";
import {
  COLLECTED_ITEMS,
  COLLECTION_PURPOSES,
  REFUSAL_RIGHT,
  RETENTION_PERIOD,
  type ConsentQueryState,
  type ConsentStatus,
} from "./mock";

/**
 * 서버도 인증도 아직 없어서 네 상태를 실제로 만들 수 없다.
 * 로그인 화면(`/login?error=cancelled`)이 이미 쓰는 방식 그대로 URL 쿼리로 고른다 —
 * 리뷰어가 코드를 고치지 않고 눈으로 확인할 수 있고, 나중에 실제 동의 기록 조회가
 * 붙으면 이 자리가 그대로 조회 결과로 바뀐다.
 * 모르는 값은 정상으로 묶어 원인 코드를 화면에 그대로 보이지 않는다.
 */
function resolveQueryState(raw: string | string[] | undefined): ConsentQueryState {
  const value = Array.isArray(raw) ? raw[0] : raw;

  return value === "loading" || value === "error" ? value : "ready";
}

/**
 * 동의 기록 조회 결과. `?state=empty` 는 계정에 연결된 동의 기록이 조회되지 않는
 * 경우라 동의 여부를 알 수 없는 상태(`unknown`)와 같은 것을 가리킨다.
 */
function resolveStatus(raw: string | string[] | undefined): ConsentStatus {
  const value = Array.isArray(raw) ? raw[0] : raw;

  return value === "empty" ? "unknown" : "agreed";
}

export default async function ConsentSettingsPage({
  searchParams,
}: PageProps<"/settings/consent">) {
  const { state } = await searchParams;

  const queryState = resolveQueryState(state);
  const status = resolveStatus(state);

  return (
    // 설정에서 들어오는 서브 화면이라 탭바가 없다. 뒤로 가기 목적지가
    // `/settings` 로 정해져 있어 `backHref` 를 준다(디자인 L534 `onBackToSettings`).
    <AppShell
      header={
        <Header
          showBack
          backHref="/settings"
          title={
            // 디자인 L538-539 — 작은 "설정" 위에 화면 이름이 온다.
            <>
              <span className="mb-0.5 block text-label font-semibold text-muted">
                설정
              </span>
              <span className="block">개인정보 수집·이용 동의</span>
            </>
          }
        />
      }
    >
      <div className="flex flex-col gap-3 py-[22px]">
        <ConsentStatusCard queryState={queryState} status={status} />

        <InfoCard title="수집·이용 목적">
          <DotList items={COLLECTION_PURPOSES} />
        </InfoCard>

        <InfoCard title="수집·이용 항목">
          <DotList items={COLLECTED_ITEMS} />
        </InfoCard>

        <InfoCard title="보유 및 이용기간">
          <InfoParagraph>{RETENTION_PERIOD}</InfoParagraph>
        </InfoCard>

        <InfoCard title="동의 거부 권리 및 제한">
          <InfoParagraph>{REFUSAL_RIGHT}</InfoParagraph>
        </InfoCard>
      </div>
    </AppShell>
  );
}
