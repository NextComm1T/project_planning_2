import type {
  MapPoint,
  RoutePoint,
  RouteSegment,
} from "@/components/shared/TancheonMap";

/**
 * 러닝 진행 화면이 보여 주는 값들.
 *
 * 서버도 GPS 측정도 없다(`docs/ARCHITECTURE.md` 「아직 없는 것」). 실제 위치 추적은
 * 이슈 #40 의 제외 범위라, 여기 있는 것은 측정 결과 자리만 남긴 mock 이다.
 * 시간이 흐르거나 거리가 늘어나는 것을 흉내내지 않는다 — 값만 둔다.
 *
 * 좌표와 숫자 형식은 디자인 `탄천런.dc.html` L993-999(`MAP_ROUTE`) ·
 * L1119-1128(`fmtTime` · `fmtPace`) · L1206(페이스 계산)에서 그대로 옮겼다.
 */

/** 화면이 구분하는 도메인 상태. 요청 기반 loading · error 는 이 화면에 없다. */
export type RunningVariant = "in-zone" | "out-zone" | "gps-lost" | "start";

export type RunningSnapshot = {
  /** 달린 시간(초). */
  elapsedSec: number;
  /** 총 러닝 거리(km) — Zone 안팎 구분 없이 달린 전체 · `docs/06-data.md:24`. */
  totalDistanceKm: number;
  /** 탄천 인정 거리(km) — Ranking Zone 내부에서 측정된 것만 · R11. */
  tancheonDistanceKm: number;
  /** 현재 위치가 Ranking Zone 안인지. `gpsLost` 와 독립이다(원본 L1311). */
  inZone: boolean;
  /** GPS 신호를 잃은 상태인지 · P3. */
  gpsLost: boolean;
  /** 지나온 경로. 구간 사이는 신호를 잃은 자리라 선이 이어지지 않는다 · P2. */
  route: readonly RouteSegment[];
  /** 경로가 없을 때(시작 직후) 찍을 내 위치. */
  userPin?: MapPoint;
};

/**
 * 신호를 잃기 전까지 이어진 구간. 원본 `MAP_ROUTE` 의 0-5번 점이다.
 *
 * 5번째 점부터 Ranking Zone 안으로 들어간다(`inZone` = 원본의 `z`).
 */
const ROUTE_BEFORE_LOSS: readonly RoutePoint[] = [
  { x: 80, y: 18, inZone: false },
  { x: 96, y: 30, inZone: false },
  { x: 113, y: 44, inZone: false },
  { x: 124, y: 58, inZone: false },
  { x: 130, y: 67, inZone: true },
  { x: 136, y: 85, inZone: true },
];

/**
 * 신호가 복구된 뒤 다시 이어진 구간. 원본 `MAP_ROUTE` 의 7-12번 점이다.
 *
 * 6번 점 `(141,103)` 은 **일부러 없다.** 그 자리가 신호를 잃은 구간이고, 측정되지
 * 않은 지점을 지어내 선을 잇지 않는다 · P2(`docs/05-policy.md:15`).
 *
 * 원본 디자인의 지도(`TancheonMapBrand.dc.html:77-92`)는 경로를 Zone 기준으로만
 * 쪼개고 신호 끊김으로는 끊지 않는다. 끊김은 이슈 #40 의 인수 조건이라 여기서 만든다.
 */
const ROUTE_AFTER_LOSS: readonly RoutePoint[] = [
  { x: 145, y: 122, inZone: true },
  { x: 146, y: 140, inZone: true },
  { x: 144, y: 153, inZone: true },
  { x: 147, y: 163, inZone: false },
  { x: 153, y: 175, inZone: false },
  { x: 162, y: 186, inZone: false },
];

/**
 * Zone 안에서 달리는 중 — 복구 구간의 Zone 내부 점까지만 지나왔다.
 *
 * 세 점을 남긴다. 두 점만 남기면 구간 전체가 현재 위치 마커의 헤일로에 덮여
 * 끊긴 자리가 "선이 끝났다"처럼 보인다.
 */
const ROUTE_AFTER_LOSS_IN_ZONE: readonly RoutePoint[] = ROUTE_AFTER_LOSS.slice(
  0,
  3,
);

/**
 * 경로가 아직 없을 때 찍는 내 위치. `docs/ARCHITECTURE.md` 가 홈 달리기 탭 예시로
 * 적어 둔 좌표와 같다.
 *
 * 경로의 첫 점 `(80,18)` 을 쓰지 않는 것은 그 자리가 **화면에 보이지 않기 때문**이다 —
 * 지도는 `preserveAspectRatio="xMidYMid slice"` 라 세로로 긴 상자에서 좌우가 잘리고,
 * 남는 x 범위가 대략 96-244 다. 잘려 나간 자리에 핀을 찍으면 아무것도 보이지 않는다.
 */
const START_POINT: MapPoint = { x: 155, y: 112 };

const SNAPSHOTS: Record<RunningVariant, RunningSnapshot> = {
  "in-zone": {
    elapsedSec: 1458,
    totalDistanceKm: 4.12,
    tancheonDistanceKm: 3.05,
    inZone: true,
    gpsLost: false,
    route: [ROUTE_BEFORE_LOSS, ROUTE_AFTER_LOSS_IN_ZONE],
  },
  "out-zone": {
    elapsedSec: 1900,
    totalDistanceKm: 5.4,
    // Zone 을 벗어난 뒤로는 인정 거리가 늘지 않는다 — 구역 내 상태와 같은 값이다.
    tancheonDistanceKm: 3.05,
    inZone: false,
    gpsLost: false,
    route: [ROUTE_BEFORE_LOSS, ROUTE_AFTER_LOSS],
  },
  "gps-lost": {
    elapsedSec: 1085,
    totalDistanceKm: 2.98,
    tancheonDistanceKm: 2.1,
    // 마지막으로 알던 위치는 Zone 안이지만, 신호를 잃은 동안은 구역 배지를 숨긴다.
    inZone: true,
    gpsLost: true,
    route: [ROUTE_BEFORE_LOSS],
  },
  start: {
    elapsedSec: 0,
    totalDistanceKm: 0,
    tancheonDistanceKm: 0,
    // 출발점이 Zone 경계(x 96-234) 안이라 "구역 내"로 시작한다.
    inZone: true,
    gpsLost: false,
    route: [],
    userPin: START_POINT,
  },
};

export function getSnapshot(variant: RunningVariant): RunningSnapshot {
  return SNAPSHOTS[variant];
}

/** 달린 시간. 1시간을 넘기면 시간 자리가 붙는다(원본 `fmtTime` L1119-1123). */
export function formatElapsed(totalSec: number): string {
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const mmss = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return hours > 0 ? `${hours}:${mmss}` : mmss;
}

/** 거리는 언제나 소수점 두 자리다(원본 L1312). 0 이어도 특수 처리하지 않는다 · F9 ①. */
export function formatDistance(km: number): string {
  return km.toFixed(2);
}

/**
 * 현재 페이스(초/km). 잴 수 없으면 `null` 이다(원본 L1206).
 *
 * 신호를 잃었거나 아직 충분히 달리지 않았으면 재지 않는다 — 별도로 저장하지 않고
 * 시간과 거리에서 파생한다.
 */
export function resolvePaceSecPerKm({
  elapsedSec,
  totalDistanceKm,
  gpsLost,
}: RunningSnapshot): number | null {
  if (gpsLost || totalDistanceKm <= 0.05) return null;

  return Math.round(elapsedSec / totalDistanceKm);
}

/** 페이스 표기. 잴 수 없으면 `--'--"` 다(원본 `fmtPace` L1124-1128). */
export function formatPace(secPerKm: number | null): string {
  if (secPerKm === null || secPerKm <= 0) return "--'--\"";

  const minutes = Math.floor(secPerKm / 60);
  const seconds = secPerKm % 60;

  return `${minutes}'${String(seconds).padStart(2, "0")}"`;
}
