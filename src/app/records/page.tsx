import { AppShell } from "@/components/shared/AppShell";
import { BottomNav } from "@/components/shared/BottomNav";

import { AccumulatedCards } from "./AccumulatedCards";
import {
  EMPTY_PERSONAL_BEST,
  EMPTY_RECORDS_NOTICE,
  MOCK_PERSONAL_BEST,
  MOCK_SESSIONS,
} from "./mock";
import { PersonalBestCard } from "./PersonalBestCard";
import { RecordListItem } from "./RecordListItem";
import { RecordSection } from "./RecordSection";
import { SettingsGearLink } from "./SettingsGearLink";
import { sortLatestFirst, toTotals } from "./summary";

/**
 * 이 화면에는 실패할 요청이 없다 — 서버가 없으니 loading · error 가 성립하지 않는다.
 * 대신 기록이 있을 때와 0건일 때를 리뷰어가 코드를 고치지 않고 볼 수 있게 URL 쿼리로 고른다.
 * `/settings?state=` 가 이미 쓰는 방식 그대로다. 모르는 값은 기록 있음으로 묶는다.
 */
type RecordsVariant = "ready" | "empty";

function resolveVariant(raw: string | string[] | undefined): RecordsVariant {
  const value = Array.isArray(raw) ? raw[0] : raw;

  return value === "empty" ? "empty" : "ready";
}

export default async function RecordsPage({
  searchParams,
}: PageProps<"/records">) {
  const { state } = await searchParams;
  const isEmpty = resolveVariant(state) === "empty";

  const sessions = sortLatestFirst(isEmpty ? [] : MOCK_SESSIONS);
  const totals = toTotals(sessions);
  const personalBest = isEmpty ? EMPTY_PERSONAL_BEST : MOCK_PERSONAL_BEST;

  return (
    // 탭 화면이라 공용 `Header` 를 쓰지 않는다 — 기어가 제목 위 오른쪽에 있는 전용 상단이다(L831-839).
    <AppShell bottom={<BottomNav />}>
      {/*
        정본은 행간을 지정하지 않아 브라우저 기본값(normal)이다. 페이지 기본 1.5 를 상속하면
        글줄마다 높이가 커져 화면 전체가 밀리므로 두 블록에서 normal 로 되돌린다.
        자체 행간이 있는 `text-sm` 은 따로 지정한다. 숫자처럼 원본이 1 인 곳은 `leading-none` 이 이긴다.
      */}
      <div className="flex flex-col gap-2.5 py-4 leading-[normal]">
        <SettingsGearLink />
        <div>
          <h1 className="text-display font-extrabold tracking-[-0.8px]">
            내 기록
          </h1>
          <p className="mt-1 text-sm leading-[normal] font-medium text-muted">
            개인 최고 기록 및 러닝 히스토리
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-[22px] pb-6 leading-[normal]">
        <RecordSection title="누적 러닝">
          <AccumulatedCards totals={totals} />
        </RecordSection>

        <RecordSection title="개인 최고 기록">
          <PersonalBestCard best={personalBest} />
        </RecordSection>

        <RecordSection title="러닝 기록">
          {sessions.length > 0 ? (
            <ul className="flex flex-col gap-2.5">
              {sessions.map((session) => (
                <li key={session.id}>
                  <RecordListItem session={session} />
                </li>
              ))}
            </ul>
          ) : (
            // 디자인에 빈 상태가 없다. 랭킹 탭(#43)의 빈 상태와 같은 모양으로 둔다.
            <p className="py-16 text-center text-content text-muted">
              {EMPTY_RECORDS_NOTICE}
            </p>
          )}
        </RecordSection>
      </div>
    </AppShell>
  );
}
