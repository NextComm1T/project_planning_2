/**
 * 랭킹 화면이 보여 주는 값들.
 *
 * 서버가 아직 없어서(`docs/ARCHITECTURE.md:171`) 목록은 mock 이다.
 * 집계가 붙으면 이 상수 자리가 그대로 조회 결과 자리가 된다.
 * 가짜 성공이나 가짜 실패로 흉내내지 않는다 — 값만 둔다.
 */

/** 순위에 오르기 전의 한 사람. 순위 숫자는 저장하지 않고 정렬 결과에서 만든다. */
export type RankingEntry = {
  name: string;
  /**
   * 누적 탄천 인정 거리(km). **0 이면 랭킹에 오르지 않는다**(P5).
   * 랭킹은 탄천 구간으로 인정된 거리만 세고, 구간 밖 거리는 빼고 본다.
   */
  distance: number;
  /**
   * 그 거리에 처음 닿은 시각. 거리가 같으면 **이쪽이 빠른 사람이 위**다(P5 · P8).
   * 실제 집계가 붙으면 서버가 내려 줄 값이라 비교만 가능하면 된다.
   */
  firstReachedAt: string;
  /** 본인 여부. 목록에서 한 줄만 참이다. */
  isMe?: boolean;
};

/** 순위가 매겨진 한 줄. `toRanking()` 이 만든다. */
export type RankedEntry = RankingEntry & { rank: number };

/**
 * 디자인 원본의 목록(L969-983) 그대로다. 닉네임은 설정 화면의 mock 과 같은
 * "뚝심주자"(`src/app/settings/mock.ts:47`)가 본인이다.
 */
export const MOCK_RANKINGS: RankingEntry[] = [
  { name: "달리는공룡", distance: 127.3, firstReachedAt: "2026-09-11T07:12:00+09:00" },
  { name: "탄천마라토너", distance: 98.5, firstReachedAt: "2026-09-12T06:40:00+09:00" },
  { name: "새벽러너김", distance: 87.2, firstReachedAt: "2026-09-10T05:28:00+09:00" },
  { name: "성남러닝크루", distance: 74.8, firstReachedAt: "2026-09-13T19:05:00+09:00" },
  { name: "뚝심주자", distance: 61.0, firstReachedAt: "2026-09-09T20:31:00+09:00", isMe: true },
  { name: "탄천의별", distance: 54.3, firstReachedAt: "2026-09-13T08:14:00+09:00" },
  { name: "동네한바퀴", distance: 48.7, firstReachedAt: "2026-09-08T18:52:00+09:00" },
  { name: "매일조금씩", distance: 42.1, firstReachedAt: "2026-09-14T07:03:00+09:00" },
  { name: "바람같이", distance: 38.4, firstReachedAt: "2026-09-07T21:19:00+09:00" },
  { name: "오늘도달려", distance: 31.2, firstReachedAt: "2026-09-12T20:47:00+09:00" },
  { name: "꾸준함이최고", distance: 28.9, firstReachedAt: "2026-09-06T06:55:00+09:00" },
  { name: "느려도멀리", distance: 22.4, firstReachedAt: "2026-09-14T17:26:00+09:00" },
  { name: "탄천초보러너", distance: 18.1, firstReachedAt: "2026-09-05T19:38:00+09:00" },
  { name: "즐기는러너", distance: 12.7, firstReachedAt: "2026-09-13T12:09:00+09:00" },
];

/** 목록이 비었을 때(디자인에 없는 상태 — `modify/2026-09-15-ranking.md` 1번). */
export const EMPTY_RANKING_NOTICE = "아직 랭킹 데이터가 없습니다";
