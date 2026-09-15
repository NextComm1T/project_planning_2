/**
 * 러닝 결과 mock 데이터.
 *
 * 서버가 없어서(`docs/ARCHITECTURE.md:171`) 세션 결과는 sessionId 로 미리 만든
 * 값을 찾아 보여준다. 랭킹 반영·미반영·개인 최고 기록 배지 유무를 각각
 * mock session id 로 확인할 수 있도록 구성했다(#41 AC).
 *
 * 지원하지 않는 sessionId 는 서버 조회 실패가 아니라 잘못된 route 식별자라
 * `notFound()` 로 처리한다 — 이 파일은 그 판단에 쓰이는 값만 둔다.
 */

import type { RouteSegment } from "@/components/shared/TancheonMap";

export type RunResult = {
  date: string;
  totalDistKm: number;
  tancheonDistKm: number;
  runTimeSec: number;
  /** km 당 초. 0 이하면 아직 페이스를 낼 수 없는 기록이다(`fmtPace` L1125). */
  paceSecPerKm: number;
  /** 랭킹 미반영이면 -1(디자인 `handleStop` L1163). */
  rank: number;
  isPersonalBest: boolean;
  route: readonly RouteSegment[];
};

/** 랭킹 반영 여부(디자인 `ranked` 계산 L1212 그대로). */
export function isRanked(result: RunResult): boolean {
  return result.rank > 0 && result.tancheonDistKm > 0.05;
}

/** `fmtTime` L1119-1122 와 동일한 규칙. */
export function formatRunTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** `fmtPace` L1124-1128 와 동일한 규칙 — 0 이하는 `--'--"`. */
export function formatPace(secPerKm: number): string {
  if (secPerKm <= 0) return "--'--\"";
  const m = Math.floor(secPerKm / 60);
  const s = secPerKm % 60;
  return `${m}'${String(s).padStart(2, "0")}"`;
}

/** `MAP_ROUTE` L993-999 — 인정 구간을 지나는 경로. */
const ROUTE_RANKED: RouteSegment = [
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
];

/** `MAP_ROUTE_V1` L1000-1005 — 인정 구간을 지나는 다른 경로. */
const ROUTE_RANKED_ALT: RouteSegment = [
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
];

/** `MAP_ROUTE_V2` L1006-1010 — 전 구간이 인정 구역 밖이다. */
const ROUTE_UNRANKED: RouteSegment = [
  { x: 260, y: 20, inZone: false },
  { x: 265, y: 40, inZone: false },
  { x: 268, y: 62, inZone: false },
  { x: 270, y: 85, inZone: false },
  { x: 268, y: 110, inZone: false },
  { x: 265, y: 135, inZone: false },
  { x: 263, y: 160, inZone: false },
  { x: 262, y: 184, inZone: false },
];

export const MOCK_RESULTS: Record<string, RunResult> = {
  /** 랭킹 반영 + 개인 최고 기록. */
  "1": {
    date: "2026. 09. 15",
    totalDistKm: 10.5,
    tancheonDistKm: 7.8,
    runTimeSec: 3180,
    paceSecPerKm: 303,
    rank: 2,
    isPersonalBest: true,
    route: [ROUTE_RANKED],
  },
  /** 랭킹 반영, 개인 최고 기록 아님. */
  "2": {
    date: "2026. 09. 13",
    totalDistKm: 6.5,
    tancheonDistKm: 4.2,
    runTimeSec: 2010,
    paceSecPerKm: 309,
    rank: 12,
    isPersonalBest: false,
    route: [ROUTE_RANKED_ALT],
  },
  /** 랭킹 미반영 — 탄천 구역 밖에서 달렸다. */
  "3": {
    date: "2026. 09. 02",
    totalDistKm: 5.0,
    tancheonDistKm: 0,
    runTimeSec: 1542,
    paceSecPerKm: 308,
    rank: -1,
    isPersonalBest: false,
    route: [ROUTE_UNRANKED],
  },
  /** 총 러닝 거리 0 — 페이스 `--'--"` 표기 확인용. */
  "4": {
    date: "2026. 09. 01",
    totalDistKm: 0,
    tancheonDistKm: 0,
    runTimeSec: 0,
    paceSecPerKm: 0,
    rank: -1,
    isPersonalBest: false,
    route: [],
  },
};
