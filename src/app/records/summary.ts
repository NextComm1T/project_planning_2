import type { RunSession } from "./mock";

/** 누적 러닝 두 값(`docs/07-screens.md:27`). */
export type RunTotals = {
  totalDistanceKm: number;
  tancheonDistanceKm: number;
};

/**
 * 최신 러닝이 맨 위다(F7). 개수는 자르지 않는다.
 *
 * `YYYY-MM-DD` 는 문자열 비교가 곧 날짜 비교다. 복사한 뒤 정렬해 mock 원본을 흔들지 않는다.
 */
export function sortLatestFirst(sessions: readonly RunSession[]): RunSession[] {
  return [...sessions].sort((a, b) => b.date.localeCompare(a.date));
}

/** 전체 러닝 총 누적 거리 · 탄천 인정 누적 거리. 기록이 없으면 둘 다 0 이다(F7 예외). */
export function toTotals(sessions: readonly RunSession[]): RunTotals {
  return sessions.reduce<RunTotals>(
    (totals, session) => ({
      totalDistanceKm: totals.totalDistanceKm + session.totalDistanceKm,
      tancheonDistanceKm: totals.tancheonDistanceKm + session.tancheonDistanceKm,
    }),
    { totalDistanceKm: 0, tancheonDistanceKm: 0 },
  );
}
