/**
 * 지도 확대 계산.
 *
 * 공용 `TancheonMap` 은 `viewBox` 를 받기만 한다 — 확대 값과 단계 계산은
 * 화면 몫이다(`docs/ARCHITECTURE.md` · `TancheonMap.tsx` 주석). 그래서 공용
 * 컴포넌트가 아니라 이 화면 폴더에 둔다.
 *
 * 숫자는 전부 디자인 L1134-1140 · L1178-1180 그대로다.
 */

import { MAP_HEIGHT, MAP_WIDTH } from "@/components/shared/TancheonMap";

/** 확대해도 화면 가운데에 두는 지점(디자인 L1135). 지도 좌표계의 값이다. */
const CENTER_X = 163;
const CENTER_Y = 110;

/** 확대 배율의 범위와 한 번에 움직이는 폭(디자인 L1178-1179). */
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.5;

/**
 * 배율을 `viewBox` 문자열로 바꾼다(디자인 L1134-1140).
 *
 * 확대한 창이 좌표계 밖으로 나가지 않도록 양쪽 끝에서 잘라 낸다 —
 * 그래서 가장자리에서는 중심이 `CENTER_X` · `CENTER_Y` 에서 밀린다.
 */
export function computeViewBox(zoom: number): string {
  const width = MAP_WIDTH / zoom;
  const height = MAP_HEIGHT / zoom;
  const x = Math.max(0, Math.min(MAP_WIDTH - width, CENTER_X - width / 2));
  const y = Math.max(0, Math.min(MAP_HEIGHT - height, CENTER_Y - height / 2));

  return `${x.toFixed(1)} ${y.toFixed(1)} ${width.toFixed(1)} ${height.toFixed(1)}`;
}

/**
 * 한 단계 확대 · 축소한 배율.
 *
 * 0.5 씩 더하면 부동소수 오차가 쌓여 `2.5` 가 `2.4999…` 가 되고 상한 비교가
 * 어긋난다. 원본과 같이 소수 첫째 자리에서 끊는다(디자인 L1178).
 */
export function stepZoom(zoom: number, direction: 1 | -1): number {
  const next = zoom + ZOOM_STEP * direction;

  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, parseFloat(next.toFixed(1))));
}
