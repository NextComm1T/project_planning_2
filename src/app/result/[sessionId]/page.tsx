import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import otterMedal from "@assets/otter-medal.png";
import { AppShell } from "@/components/shared/AppShell";
import { TancheonMap } from "@/components/shared/TancheonMap";

import { formatPace, formatRunTime, isRanked, MOCK_RESULTS } from "./mock";

/**
 * 러닝 결과 화면(#41, `탄천런.dc.html` L298-374).
 *
 * 정본에 헤더 · 뒤로 가기가 없다 — `AppShell` 만 쓰고 `Header` 는 넣지 않는다
 * (2026-09-14 결정 이력). 하단 탭바도 없는 화면이라 `bottom` 슬롯도 비운다.
 */
export default async function ResultPage({
  params,
}: PageProps<"/result/[sessionId]">) {
  const { sessionId } = await params;
  const result = MOCK_RESULTS[sessionId];

  // 지원하지 않는 sessionId 는 서버 조회 실패가 아니라 잘못된 route
  // 식별자다 — 전용 오류 화면 없이 404 로 처리한다(#41 AC).
  if (!result) notFound();

  const ranked = isRanked(result);

  return (
    <AppShell padded={false}>
      <div className="flex items-start justify-between gap-2.5 px-5 pt-1.5 pb-3">
        <div>
          <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-success-soft px-[11px] py-[5px] text-label font-extrabold text-success">
              ✓ 완료
            </span>
            {result.isPersonalBest ? (
              <span className="rounded-full bg-primary-soft px-[11px] py-[5px] text-label font-extrabold text-primary-strong">
                개인 최고 기록
              </span>
            ) : null}
          </div>
          <h1 className="m-0 text-[28px] font-extrabold tracking-[-0.5px]">
            {result.date}
          </h1>
          <p className="mt-[3px] text-content font-semibold text-muted">
            오늘도 수고했어요!
          </p>
        </div>
        <Image
          src={otterMedal}
          alt="완주한 수달"
          className="h-[88px] w-[104px] shrink-0 rounded-md object-cover object-bottom"
        />
      </div>

      <div className="mx-5 shrink-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
        <div className="h-[172px]">
          <TancheonMap route={result.route} />
        </div>
        <div className="flex items-center gap-[18px] border-t border-surface-muted px-4 py-3">
          <div className="flex items-center gap-[7px]">
            <div className="h-1 w-[22px] rounded-full bg-primary" />
            <span className="text-label font-bold text-foreground">
              탄천 인정 구간
            </span>
          </div>
          <div className="flex items-center gap-[7px]">
            <div className="h-1 w-[22px] rounded-full bg-route-out" />
            <span className="text-label font-bold text-foreground">
              일반 러닝 구간
            </span>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 px-5 pt-3 pb-[30px]">
        {ranked ? (
          <div className="rounded-2xl bg-primary px-5 py-[18px] shadow-primary">
            <p className="mb-2 text-note font-bold text-white/85">
              탄천 랭킹 순위
            </p>
            <div className="flex items-end justify-between">
              <span className="text-[52px] font-extrabold tracking-[-2px] text-white leading-none">
                {result.rank}위
              </span>
              <div className="text-right">
                <p className="m-0 text-[35px] font-extrabold text-white leading-none">
                  {result.tancheonDistKm.toFixed(2)} km
                </p>
                <p className="mt-[3px] text-label font-semibold text-white/80">
                  탄천 인정 거리 반영
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-surface-muted px-5 py-[18px]">
            <p className="mb-1 text-note font-extrabold text-muted">
              랭킹 미반영
            </p>
            <p className="text-sm leading-[1.5] font-medium text-muted">
              탄천 구역 밖에서 달린 기록은 랭킹에 반영되지 않습니다.
            </p>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
          <div className="grid grid-cols-2">
            <div className="border-b border-surface-muted px-5 py-[18px]">
              <p className="mb-1.5 text-label font-bold text-muted">총 거리</p>
              <p className="m-0 text-metric font-extrabold tracking-[-1px]">
                {result.totalDistKm.toFixed(2)}
                <span className="ml-1 text-sm font-semibold text-muted">
                  km
                </span>
              </p>
            </div>
            <div className="border-b border-l border-surface-muted px-5 py-[18px]">
              <p className="mb-1.5 text-label font-bold text-success">
                탄천 인정
              </p>
              <p className="m-0 text-metric font-extrabold tracking-[-1px] text-success">
                {result.tancheonDistKm.toFixed(2)}
                <span className="ml-1 text-sm font-semibold text-muted">
                  km
                </span>
              </p>
            </div>
            <div className="px-5 py-[18px]">
              <p className="mb-1.5 text-label font-bold text-muted">
                러닝 시간
              </p>
              <p className="m-0 text-metric font-extrabold tracking-[-1px]">
                {formatRunTime(result.runTimeSec)}
              </p>
            </div>
            <div className="border-l border-surface-muted px-5 py-[18px]">
              <p className="mb-1.5 text-label font-bold text-muted">페이스</p>
              <p className="m-0 text-metric font-extrabold tracking-[-1px]">
                {formatPace(result.paceSecPerKm)}
                <span className="ml-1 text-sm font-semibold text-muted">
                  /km
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3 pt-3">
          {ranked ? (
            <Link
              href="/ranking"
              className="flex h-[58px] w-full items-center justify-center rounded-xl bg-primary text-lg font-extrabold text-on-primary shadow-primary"
            >
              탄천 랭킹 보기
            </Link>
          ) : null}
          <Link
            href="/records"
            className="flex h-[58px] w-full items-center justify-center rounded-xl border border-border bg-surface text-lg font-extrabold text-foreground shadow-button-soft"
          >
            내 기록 보기
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
