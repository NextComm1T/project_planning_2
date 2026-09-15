/**
 * 기록 탭(#44)과 기록 상세(#45)가 함께 쓰는 러닝 기록 mock.
 *
 * 서버가 아직 없어서(`docs/ARCHITECTURE.md` 「아직 없는 것」) 조회 결과 자리에 값만 둔다.
 * 가짜 성공이나 가짜 실패로 흉내내지 않는다.
 *
 * 기록 탭에 필요한 필드만 갖는다. 기록 상세가 쓰는 경로 등은 #45 가 이 타입을 확장해 더한다.
 */

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
};

/** 디자인 원본 `HISTORY`(L985-991)의 값 그대로다. id 는 원본에 없어 순서대로 붙였다. */
export const MOCK_SESSIONS: readonly RunSession[] = [
  { id: "s1", date: "2026-09-09", totalDistanceKm: 8.2, tancheonDistanceKm: 5.1, durationSec: 2538, paceSecPerKm: 308 },
  { id: "s2", date: "2026-09-07", totalDistanceKm: 6.5, tancheonDistanceKm: 4.2, durationSec: 2010, paceSecPerKm: 309 },
  { id: "s3", date: "2026-09-05", totalDistanceKm: 10.1, tancheonDistanceKm: 7.3, durationSec: 3142, paceSecPerKm: 311 },
  { id: "s4", date: "2026-09-02", totalDistanceKm: 5.0, tancheonDistanceKm: 0.0, durationSec: 1542, paceSecPerKm: 308 },
  { id: "s5", date: "2026-08-31", totalDistanceKm: 7.8, tancheonDistanceKm: 5.8, durationSec: 2418, paceSecPerKm: 310 },
  { id: "s6", date: "2026-08-28", totalDistanceKm: 9.3, tancheonDistanceKm: 6.1, durationSec: 2887, paceSecPerKm: 310 },
];

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
