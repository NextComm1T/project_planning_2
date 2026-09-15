"use client";

import { useState } from "react";
import Image from "next/image";
import otterGps from "@assets/otter-gps.png";
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  TancheonMap,
  type MapPoint,
  type RouteSegment,
} from "@/components/shared/TancheonMap";

/**
 * 러닝 중 지도와 그 위에 얹히는 것들(디자인 L228-262).
 *
 * `TancheonMap`(#33)은 지도만 그린다 — 확대 · 축소 · 재중심 버튼, 범례, GPS 경고
 * 카드, 딤은 디자인에서 지도 바깥의 형제 요소라 이 화면이 그린다. 확대 값 계산도
 * 화면 몫이다(`src/components/shared/TancheonMap.tsx` 머리 주석).
 *
 * `className` props 를 받지 않으므로 크기 상자는 여기서 만들고 지도를 `inset-0` 로 깐다.
 *
 * 디자인 L258 의 "GPS 복구 시뮬레이션 →" 버튼은 **넣지 않는다.** 디자인 캔버스에서
 * 상태를 보여 주려고 둔 데모 장치이고, 이슈 #40 의 제외 범위다.
 */

type RunMapProps = {
  route: readonly RouteSegment[];
  userPin?: MapPoint;
  gpsLost: boolean;
};

/**
 * 확대 단계와 중심(원본 L1134-1141 · L1178-1180).
 *
 * 중심 x 가 좌표계 한가운데(170)가 아니라 163 인 것은 디자인 그대로다 — 경로 쪽으로
 * 조금 치우쳐 있다.
 */
const ZOOM_MIN = 1;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 0.5;
const ZOOM_CENTER: MapPoint = { x: 163, y: 110 };

function computeViewBox(zoom: number): string {
  const width = MAP_WIDTH / zoom;
  const height = MAP_HEIGHT / zoom;
  // 확대해도 좌표계 밖으로 나가지 않게 가둔다.
  const x = Math.max(0, Math.min(MAP_WIDTH - width, ZOOM_CENTER.x - width / 2));
  const y = Math.max(0, Math.min(MAP_HEIGHT - height, ZOOM_CENTER.y - height / 2));

  return `${x.toFixed(1)} ${y.toFixed(1)} ${width.toFixed(1)} ${height.toFixed(1)}`;
}

/**
 * 34×34 버튼 두 개가 맞붙은 스택이다. 시각 크기는 디자인대로 두고 터치 영역만
 * 넓히되(이슈 #40 결정 이력), 서로 겹치지 않게 **바깥쪽으로만** 늘린다 —
 * 가로는 48px 을 채우고 세로는 맞붙은 변을 침범하지 않는다(`modify/` 3번).
 */
const ZOOM_BUTTON_BASE =
  "relative flex size-[34px] items-center justify-center bg-surface/94 text-[19px] font-extrabold text-foreground after:absolute after:-inset-x-[7px] after:content-[''] disabled:text-disabled";

export function RunMap({ route, userPin, gpsLost }: RunMapProps) {
  const [zoom, setZoom] = useState(ZOOM_MIN);

  const canZoomIn = zoom < ZOOM_MAX;
  const canZoomOut = zoom > ZOOM_MIN;

  return (
    <div className="relative mx-4 min-h-0 flex-1 overflow-hidden rounded-2xl border-[1.5px] border-border shadow-card">
      <div className="absolute inset-0">
        <TancheonMap
          route={route}
          userPin={userPin}
          endMarker={gpsLost ? "gps-lost" : "running"}
          viewBox={computeViewBox(zoom)}
        />
      </div>

      {/* 확대 · 축소 (L231-234) */}
      <div className="absolute top-3 right-3 flex flex-col rounded-sm shadow-raised">
        <button
          type="button"
          aria-label="지도 확대"
          disabled={!canZoomIn}
          onClick={() => setZoom((current) => Math.min(ZOOM_MAX, current + ZOOM_STEP))}
          className={`${ZOOM_BUTTON_BASE} rounded-t-sm border-b border-border after:-top-[7px] after:bottom-0`}
        >
          +
        </button>
        <button
          type="button"
          aria-label="지도 축소"
          disabled={!canZoomOut}
          onClick={() => setZoom((current) => Math.max(ZOOM_MIN, current - ZOOM_STEP))}
          className={`${ZOOM_BUTTON_BASE} rounded-b-sm after:top-0 after:-bottom-[7px]`}
        >
          −
        </button>
      </div>

      {/* 재중심 (L235-237) — 46×46 이라 ::after 로 48×48 을 채운다 */}
      <button
        type="button"
        aria-label="지도를 처음 배율로"
        onClick={() => setZoom(ZOOM_MIN)}
        className="absolute right-3 bottom-3 flex size-[46px] items-center justify-center rounded-lg bg-surface/94 text-primary shadow-raised after:absolute after:-inset-px after:content-['']"
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
      </button>

      {/* 범례 (L238-246) */}
      <div className="absolute bottom-3 left-3 rounded-sm bg-surface/90 px-[11px] py-2 shadow-raised">
        <div className="mb-[5px] flex items-center gap-[7px]">
          <div
            className="size-3 shrink-0 rounded-full border-[2.5px] border-primary bg-primary/22"
            aria-hidden="true"
          />
          <span className="text-caption leading-none font-bold text-foreground">
            내 위치
          </span>
        </div>
        <div className="flex items-center gap-[7px]">
          <div
            className="h-[7px] w-3 shrink-0 rounded-[3px] border-[1.5px] border-dashed border-primary/60 bg-primary/22"
            aria-hidden="true"
          />
          <span className="text-caption leading-none font-bold text-foreground">
            Ranking Zone
          </span>
        </div>
      </div>

      {/* GPS 유실 — 토스트가 아니라 지도 위 딤 + 경고 카드다 (L247-261) */}
      {gpsLost ? (
        <div
          role="status"
          className="absolute inset-0 flex items-center justify-center bg-foreground/28 p-5"
        >
          <div className="w-full max-w-[300px] rounded-2xl border-[1.5px] border-warning-border bg-warning-soft p-[18px] shadow-toast">
            <div className="flex items-center gap-3">
              <Image
                src={otterGps}
                alt=""
                width={52}
                height={44}
                className="h-11 w-13 shrink-0 rounded-xs object-cover"
              />
              <div className="flex-1">
                <p className="text-content font-extrabold text-warning-strong">
                  GPS 신호가 약합니다
                </p>
                <p className="mt-[3px] text-note leading-[1.45] font-medium text-warning">
                  신호가 복구될 때까지 거리를 측정하지 않습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
