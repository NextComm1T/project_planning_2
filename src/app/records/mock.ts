/**
 * 기록 탭(#44)과 기록 상세(#45)가 함께 쓰는 러닝 기록 mock.
 *
 * 서버가 아직 없어서(`docs/ARCHITECTURE.md` 「아직 없는 것」) 조회 결과 자리에 값만 둔다.
 * 가짜 성공이나 가짜 실패로 흉내내지 않는다.
 *
 * 기록 탭 필드에 기록 상세(#45)가 쓰는 경로(`route`)와 `findSession` 을 더해 두 화면이 같은 세션을 쓴다.
 */

import type { RouteSegment } from "@/components/shared/TancheonMap";

/** 저장된 러닝 세션 하나(`docs/06-data.md:23-27`). */
export type RunSession = {
  /** `/records/[sessionId]` 의 식별자. */
  id: string;
  /** 러닝 일자 `YYYY-MM-DD`. 자정을 넘긴 러닝은 시작한 날이다. */
  date: string;
  /** 총 러닝 거리(km). Zone 밖에서 달린 거리도 포함한다(R12). */
  totalDistanceKm: number;
  /** 탄천 인정 거리(km). Zone 밖에서만 달린 세션은 0 이다. */
  tancheonDistanceKm: number;
  /** 러닝 시간(초). */
  durationSec: number;
  /** 평균 페이스(초/km). 세션에 저장된 값을 그대로 보여 준다. */
  paceSecPerKm: number;
  /**
   * 저장된 GPS 이동 경로(R8 · F6). 구간 배열인 이유는 **GPS 가 끊긴 자리를 잇지 않기**
   * 위해서다(P2) — 정본의 세 경로는 끊긴 적이 없어 각각 구간이 하나다.
   */
  route: readonly RouteSegment[];
};

/**
 * 정본 `MAP_ROUTE`(L993-999). Zone 밖에서 시작해 들어갔다가 다시 나온다.
 *
 * `z` → `inZone` 이름만 바꿨고 좌표는 손대지 않았다. `z` 가 바뀌는 지점이 곧 경계점이라
 * 공용 지도의 `splitByZone` 이 그 점에서 색을 가른다(R11) — 따로 계산해 끼워 넣지 않는다.
 */
const ROUTE_WEST: readonly RouteSegment[] = [
  [
    { x: 80, y: 18, inZone: false },
    { x: 96, y: 30, inZone: false },
    { x: 113, y: 44, inZone: false },
    { x: 124, y: 58, inZone: false },
    { x: 130, y: 67, inZone: true },
    { x: 136, y: 85, inZone: true },
    { x: 141, y: 103, inZone: true },
    { x: 145, y: 122, inZone: true },
    { x: 146, y: 140, inZone: true },
    { x: 144, y: 153, inZone: true },
    { x: 147, y: 163, inZone: false },
    { x: 153, y: 175, inZone: false },
    { x: 162, y: 186, inZone: false },
  ],
];

/** 정본 `MAP_ROUTE_V1`(L1000-1005). 동쪽에서 들어오는 경로다. */
const ROUTE_EAST: readonly RouteSegment[] = [
  [
    { x: 220, y: 22, inZone: false },
    { x: 204, y: 36, inZone: false },
    { x: 190, y: 50, inZone: false },
    { x: 182, y: 62, inZone: false },
    { x: 175, y: 70, inZone: true },
    { x: 168, y: 88, inZone: true },
    { x: 163, y: 106, inZone: true },
    { x: 160, y: 125, inZone: true },
    { x: 159, y: 143, inZone: true },
    { x: 162, y: 158, inZone: false },
    { x: 168, y: 170, inZone: false },
    { x: 176, y: 183, inZone: false },
  ],
];

/** 정본 `MAP_ROUTE_V2`(L1006-1010). **Zone 을 한 번도 지나지 않는다** — 구역 외 러닝. */
const ROUTE_OUTSIDE: readonly RouteSegment[] = [
  [
    { x: 260, y: 20, inZone: false },
    { x: 265, y: 40, inZone: false },
    { x: 268, y: 62, inZone: false },
    { x: 270, y: 85, inZone: false },
    { x: 268, y: 110, inZone: false },
    { x: 265, y: 135, inZone: false },
    { x: 263, y: 160, inZone: false },
    { x: 262, y: 184, inZone: false },
  ],
];

/**
 * 디자인 원본 `HISTORY`(L985-991)의 값 그대로다. id 는 원본에 없어 순서대로 붙였다.
 * 경로는 원본 `routeVariant`(0 · 1 · 2 → WEST · EAST · OUTSIDE)를 따른다.
 */
export const MOCK_SESSIONS: readonly RunSession[] = [
  { id: "s1", date: "2026-09-09", totalDistanceKm: 8.2, tancheonDistanceKm: 5.1, durationSec: 2538, paceSecPerKm: 308, route: ROUTE_WEST },
  { id: "s2", date: "2026-09-07", totalDistanceKm: 6.5, tancheonDistanceKm: 4.2, durationSec: 2010, paceSecPerKm: 309, route: ROUTE_EAST },
  { id: "s3", date: "2026-09-05", totalDistanceKm: 10.1, tancheonDistanceKm: 7.3, durationSec: 3142, paceSecPerKm: 311, route: ROUTE_WEST },
  { id: "s4", date: "2026-09-02", totalDistanceKm: 5.0, tancheonDistanceKm: 0.0, durationSec: 1542, paceSecPerKm: 308, route: ROUTE_OUTSIDE },
  { id: "s5", date: "2026-08-31", totalDistanceKm: 7.8, tancheonDistanceKm: 5.8, durationSec: 2418, paceSecPerKm: 310, route: ROUTE_WEST },
  { id: "s6", date: "2026-08-28", totalDistanceKm: 9.3, tancheonDistanceKm: 6.1, durationSec: 2887, paceSecPerKm: 310, route: ROUTE_EAST },
];

/** route 의 `[sessionId]` 로 세션을 찾는다. 없으면 `undefined` — 화면이 404 로 처리한다. */
export function findSession(id: string): RunSession | undefined {
  return MOCK_SESSIONS.find((session) => session.id === id);
}

/**
 * 개인 최고 기록.
 *
 * 러닝 종료 처리(F6)가 세션 목록과 **별개로** 갱신·보관하는 값이다(`docs/04-features.md:21`).
 * 기록 탭(F7)은 받은 값을 표시만 하므로 세션 목록에서 계산하지 않는다.
 */
export type PersonalBest = {
  longestDistanceKm: number;
  longestDurationSec: number;
  /** 최고 페이스(초/km). 거리가 0 인 세션은 판정에서 빠지므로(F6) 아직 없을 수 있다. */
  bestPaceSecPerKm: number | null;
};

/** 디자인이 기록 있음 상태에서 보여 주는 값(L1242-1244 · L1357-1358). */
export const MOCK_PERSONAL_BEST: PersonalBest = {
  longestDistanceKm: 10.1,
  longestDurationSec: 36000,
  bestPaceSecPerKm: 308,
};

/** 기록이 없을 때. 이슈 #44 의 빈 상태 표기 `0.0` · `0:00:00` · `--'--"` 가 된다. */
export const EMPTY_PERSONAL_BEST: PersonalBest = {
  longestDistanceKm: 0,
  longestDurationSec: 0,
  bestPaceSecPerKm: null,
};

/** 기록 0건 안내(F7 예외). 디자인에 빈 상태가 없어 문구는 문서를 따른다. */
export const EMPTY_RECORDS_NOTICE = "아직 기록이 없습니다";
