import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { AppShell } from "@/components/shared/AppShell";
import { TancheonMap } from "@/components/shared/TancheonMap";

import { findSession, formatDuration, formatPace, type RunSession } from "../mock";

/**
 * 화면 로컬 헤더(정본 L630-638).
 *
 * 공용 `Header` 를 쓰지 않는다 — 뒤로 가기가 40 이 아니라 42, 제목이 20 이 아니라 21px 라
 * 공용 컴포넌트로는 정본 치수를 낼 수 없다(이슈 #45 결정 이력 2026-09-14). 그 사정으로
 * `src/components/shared/*` 를 고치지 않고 이 화면 안에 로컬로 그린다.
 */
function RecordDetailHeader({ date }: { date: string }) {
  return (
    <header className="sticky top-0 z-[5] flex shrink-0 items-center gap-3 border-b-[1.5px] border-surface-muted bg-background px-4 pt-[calc(4px+env(safe-area-inset-top))] pb-3.5">
      {/*
        정본은 `<button onClick>` 이지만 실제 앱에서는 route 이동이라 링크가 맞다
        (`modify/2026-09-15-ranking.md` 4번과 같은 사유). 덕분에 이 화면은
        `"use client"` 없이 전부 서버 컴포넌트다.
        시각 크기는 정본대로 42×42 를 유지하고 ::after 로 터치 영역만 48×48 로
        넓힌다 — `BackButton.tsx:28` 과 같은 방식(`docs/07-screens.md:15`).
      */}
      <Link
        href="/records"
        aria-label="기록 탭으로 돌아가기"
        className="relative flex size-[42px] shrink-0 items-center justify-center rounded-sm bg-surface-muted text-foreground after:absolute after:-inset-[3px] after:content-['']"
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
      </Link>

      <div className="min-w-0">
        <h1 className="truncate text-[21px] font-extrabold leading-[1.2]">
          {date}
        </h1>
        <p className="mt-0.5 text-note font-semibold text-muted">
          러닝 기록 상세
        </p>
      </div>
    </header>
  );
}

/** 지도 아래 범례(정본 L645-654). 구역 외 러닝이면 범례 대신 한 줄 안내가 온다. */
function RouteLegend({ hasZone }: { hasZone: boolean }) {
  if (!hasZone) {
    return (
      <span className="text-note font-bold text-muted">
        탄천 구역 외 러닝 — 랭킹 미반영
      </span>
    );
  }

  return (
    <div className="flex items-center gap-5">
      <LegendItem className="bg-primary">탄천 인정 구간</LegendItem>
      <LegendItem className="bg-route-out">일반 러닝 구간</LegendItem>
    </div>
  );
}

function LegendItem({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-[5px] w-[26px] rounded-[3px] ${className}`}
        aria-hidden="true"
      />
      <span className="text-note font-bold text-foreground">{children}</span>
    </div>
  );
}

/**
 * 숫자 한 칸(정본 L659-674). 칸 사이 divider 는 `borderClassName` 으로 받는다.
 *
 * 개인 순위는 넣지 않는다 — 결과 화면(#41)에만 나온다(`docs/07-screens.md:28`).
 */
function Metric({
  label,
  value,
  unit,
  tone = "",
  borderClassName,
}: {
  label: string;
  value: string;
  unit?: string;
  tone?: string;
  borderClassName: string;
}) {
  return (
    <div className={`p-5 ${borderClassName}`}>
      <p className={`mb-2 text-label font-bold ${tone || "text-muted"}`}>
        {label}
      </p>
      <p className={`text-hero font-extrabold tracking-[-1.5px] ${tone}`}>
        {value}
        {unit ? (
          <span className="ml-[5px] text-content font-semibold text-muted">
            {unit}
          </span>
        ) : null}
      </p>
    </div>
  );
}

/** 수치 4개 카드(정본 L658-676). */
function MetricGrid({ session }: { session: RunSession }) {
  // 정본 `zoneColor`(L1252) — 인정 거리가 0이면 강조하지 않고 기본 글자색으로 둔다.
  const zoneTone = session.tancheonDist > 0 ? "text-success" : "text-foreground";

  return (
    <div className="mx-4 mt-3 mb-[22px] shrink-0 overflow-hidden rounded-2xl border-[1.5px] border-border bg-surface shadow-card">
      <div className="grid grid-cols-2">
        <Metric
          label="총 거리"
          value={String(session.totalDist)}
          unit="km"
          borderClassName="border-b border-surface-muted"
        />
        <Metric
          label="탄천 인정"
          value={String(session.tancheonDist)}
          unit="km"
          tone={zoneTone}
          borderClassName="border-b border-l border-surface-muted"
        />
        <Metric label="러닝 시간" value={formatDuration(session.time)} borderClassName="" />
        <Metric
          label="평균 페이스"
          value={formatPace(session.pace)}
          unit="/km"
          borderClassName="border-l border-surface-muted"
        />
      </div>
    </div>
  );
}

/**
 * 기록 상세(#45 · F11 · 정본 L628-679).
 *
 * 조회 요청이 없으므로 불러오는 중 · 오류 상태는 성립하지 않는다. 지원하지 않는 session
 * id 는 요청 실패가 아니라 **잘못된 route 식별자**라 `notFound()` 로 보낸다(이슈 #45 AC ·
 * 결정 이력). 가짜 Promise 나 query error 를 만들지 않는다.
 */
export default async function RecordDetailPage({
  params,
}: PageProps<"/records/[sessionId]">) {
  const { sessionId } = await params;
  const session = findSession(sessionId);

  if (!session) notFound();

  return (
    <AppShell padded={false} header={<RecordDetailHeader date={session.date} />}>
      <div className="mx-4 mt-3.5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border-[1.5px] border-border bg-surface shadow-card">
        <div className="min-h-0 flex-1">
          {/* 끝난 경로라 기본 `endMarker="finished"` 그대로다(`docs/ARCHITECTURE.md`). */}
          <TancheonMap route={session.route} label={`${session.date} 러닝 경로`} />
        </div>

        <div className="shrink-0 border-t border-surface-muted px-[18px] pt-2 pb-2.5">
          <RouteLegend hasZone={session.tancheonDist > 0} />
        </div>
      </div>

      <MetricGrid session={session} />
    </AppShell>
  );
}
