"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/shared/AppShell";
import { BottomNav } from "@/components/shared/BottomNav";

import { Countdown } from "./Countdown";
import { HomeHeader } from "./HomeHeader";
import { MOCK_NICKNAME, RUNNING_ROUTE, type GpsState } from "./mock";
import { MyRankCard } from "./MyRankCard";
import { RunMapCard } from "./RunMapCard";
import { computeViewBox, MAX_ZOOM, MIN_ZOOM, stepZoom } from "./zoom";

/** 카운트다운 숫자와 간격(디자인 L1074-1086). `0` 은 "GO!" 를 띄우는 자리다. */
const COUNTDOWN_START = 3;
const TICK_MS = 1000;
/** "GO!" 를 이만큼 보여 준 뒤 러닝 진행 화면으로 넘어간다(디자인 L1081). */
const GO_HOLD_MS = 900;

/**
 * 홈 — 달리기 탭(디자인 L684-771).
 *
 * 화면 전체가 클라이언트인 이유는 **카운트다운이 탭바의 유무까지 바꾸기** 때문이다.
 * 정본에서 카운트다운은 홈과 형제인 별도 화면 상태라 `<nav>` 바깥에 있다(L199 · L921).
 * `AppShell` 의 `bottom` 슬롯을 비우려면 조립 자체가 상태를 알아야 해서, 여기서
 * 껍데기까지 함께 조립한다.
 *
 * GPS 준비 여부는 상태가 아니라 props 다 — 실제 GPS 조회가 없으므로 이 화면 안에서
 * 바뀌지 않는다. 타이머로 가짜 GPS 확보를 만들지 않는다(이슈 #42 제외 범위).
 */
export function RunTab({ gps }: { gps: GpsState }) {
  const router = useRouter();

  /** `null` 이면 카운트다운 중이 아니다. 홈과 카운트다운을 가르는 값이기도 하다. */
  const [countdown, setCountdown] = useState<number | null>(null);
  const [zoom, setZoom] = useState(MIN_ZOOM);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown <= 0) {
      const toRunning = setTimeout(() => router.push(RUNNING_ROUTE), GO_HOLD_MS);
      return () => clearTimeout(toRunning);
    }

    const tick = setTimeout(
      () => setCountdown((left) => (left === null ? null : left - 1)),
      TICK_MS,
    );
    return () => clearTimeout(tick);
  }, [countdown, router]);

  if (countdown !== null) {
    // 탭바 없이 화면 전체를 채운다(디자인 L199-206).
    return (
      <AppShell padded={false}>
        <Countdown count={countdown} />
      </AppShell>
    );
  }

  return (
    <AppShell
      header={<HomeHeader gps={gps} />}
      bottom={<BottomNav />}
      // 좌우 여백이 헤더 20px · 본문 16px 로 달라서 공통 여백을 끄고 직접 준다.
      padded={false}
    >
      <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
        <div className="shrink-0 px-1 pb-3">
          <h1 className="text-[22px] leading-[1.3] font-extrabold tracking-[-0.5px]">
            안녕하세요, {MOCK_NICKNAME}님
          </h1>
          <p className="mt-[3px] text-sm font-medium text-muted">
            오늘도 탄천에서 달려볼까요?
          </p>
        </div>

        <RunMapCard
          gps={gps}
          viewBox={computeViewBox(zoom)}
          canZoomIn={zoom < MAX_ZOOM}
          canZoomOut={zoom > MIN_ZOOM}
          onZoomIn={() => setZoom((current) => stepZoom(current, 1))}
          onZoomOut={() => setZoom((current) => stepZoom(current, -1))}
          onZoomReset={() => setZoom(MIN_ZOOM)}
          onStart={() => setCountdown(COUNTDOWN_START)}
        />

        <MyRankCard />
      </div>
    </AppShell>
  );
}
