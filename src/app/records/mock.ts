/**
 * 기록 탭(#44) · 기록 상세(#45)가 함께 쓰는 러닝 세션 mock.
 *
 * 서버가 없어서(`docs/ARCHITECTURE.md` 「아직 없는 것」) 세션은 mock 이다. 값은 전부 정본
 * `탄천런.dc.html` L985-1010(`Component.HISTORY` · `MAP_ROUTE` · `MAP_ROUTE_V1` ·
 * `MAP_ROUTE_V2`)에서 그대로 옮겼다. 집계가 붙으면 이 상수 자리가 그대로 조회 결과
 * 자리가 된다 — 가짜 성공이나 가짜 실패로 흉내내지 않는다.
 */

import type { RouteSegment } from "@/components/shared/TancheonMap";

/**
 * 저장된 러닝 세션 하나(`docs/06-data.md` 「러닝 세션」).
 *
 * 거리는 정본이 그대로 출력하는 값이라 문자열이 아니라 숫자로 둔다. 시간 · 페이스만
 * 원시값(초)을 갖고 화면에서 포맷한다 — 기록 탭의 개인 최고 기록(최대 시간 · 최고
 * 페이스)이 비교를 해야 해서 숫자가 원본이어야 한다.
 */
export type RunSession = {
  /** route 식별자. 날짜에서 만든다 — `2026. 09. 09` → `20260909`. */
  id: string;
  /** 정본 표기 그대로(L986). */
  date: string;
  /** 총 러닝 거리(km). Zone 밖 거리도 포함한다(R12). */
  totalDist: number;
  /** 탄천 인정 거리(km). **0 이면 구역 외 러닝**이라 랭킹에 반영되지 않는다(P5). */
  tancheonDist: number;
  /** 러닝 시간(초). */
  time: number;
  /** 평균 페이스(초/km). 거리가 0이면 낼 수 없어 0이다(`docs/06-data.md`). */
  pace: number;
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

/** 정본 `HISTORY`(L985-992) 그대로. 최신 러닝이 맨 위다(F7). */
export const MOCK_SESSIONS: readonly RunSession[] = [
  { id: "20260909", date: "2026. 09. 09", totalDist: 8.2, tancheonDist: 5.1, time: 2538, pace: 308, route: ROUTE_WEST },
  { id: "20260907", date: "2026. 09. 07", totalDist: 6.5, tancheonDist: 4.2, time: 2010, pace: 309, route: ROUTE_EAST },
  { id: "20260905", date: "2026. 09. 05", totalDist: 10.1, tancheonDist: 7.3, time: 3142, pace: 311, route: ROUTE_WEST },
  { id: "20260902", date: "2026. 09. 02", totalDist: 5.0, tancheonDist: 0.0, time: 1542, pace: 308, route: ROUTE_OUTSIDE },
  { id: "20260831", date: "2026. 08. 31", totalDist: 7.8, tancheonDist: 5.8, time: 2418, pace: 310, route: ROUTE_WEST },
  { id: "20260828", date: "2026. 08. 28", totalDist: 9.3, tancheonDist: 6.1, time: 2887, pace: 310, route: ROUTE_EAST },
];

/** route 의 `[sessionId]` 로 세션을 찾는다. 없으면 `undefined` — 화면이 404 로 처리한다. */
export function findSession(id: string): RunSession | undefined {
  return MOCK_SESSIONS.find((session) => session.id === id);
}

/** 정본 `fmtTime`(L1119-1123). 한 시간을 넘으면 `1:02:03`, 아니면 `42:18`. */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  const mmss = `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;

  return hours > 0 ? `${hours}:${mmss}` : mmss;
}

/** 정본 `fmtPace`(L1124-1128). 거리가 0이라 페이스를 낼 수 없으면 `--'--"`. */
export function formatPace(secondsPerKm: number): string {
  if (secondsPerKm <= 0) return `--'--"`;

  const minutes = Math.floor(secondsPerKm / 60);
  const rest = secondsPerKm % 60;

  return `${minutes}'${String(rest).padStart(2, "0")}"`;
}
