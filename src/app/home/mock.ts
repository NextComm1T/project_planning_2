/**
 * 홈 달리기 탭이 보여 주는 값들.
 *
 * 서버가 아직 없어서(`docs/ARCHITECTURE.md:171`) 닉네임 · 순위 · 누적 거리는 mock 이다.
 * 인증과 랭킹 조회가 붙으면 이 상수 자리가 그대로 서버 조회 자리가 된다.
 * 가짜 성공이나 가짜 실패로 흉내내지 않는다 — 값만 둔다.
 */

import type { MapPoint } from "@/components/shared/TancheonMap";

/**
 * GPS 준비 상태.
 *
 * 디자인의 비준비 상태는 "GPS 확인 중" 하나뿐이다(이슈 #42 「상태 정의」).
 * 위치 권한 미허용 · GPS 미확보 안내는 정본에 없어 만들지 않는다.
 */
export type GpsState = "checking" | "ready";

/** 상단 배지 문구(디자인 L693 · L696). 확인 중의 말줄임은 원본이 애니메이션으로 늘리는 자리다. */
export const GPS_BADGE_LABEL: Record<GpsState, string> = {
  checking: "GPS 확인 중...",
  ready: "GPS 준비완료",
};

/** 러닝 시작 버튼 문구(디자인 L1304). 확인 중에는 P1 대로 누를 수 없다. */
export const START_BUTTON_LABEL: Record<GpsState, string> = {
  checking: "GPS 확인 중...",
  ready: "러닝 시작하기",
};

/** 지도를 덮는 GPS 확인 중 안내(디자인 L724-730). */
export const GPS_CHECKING_NOTICE = ["GPS 확인 중", "러닝을 준비 중입니다"] as const;

/** 인사말(디자인 L705) — 닉네임은 설정 화면 mock 과 같은 값을 쓴다. */
export const MOCK_NICKNAME = "뚝심주자";

/** 내 탄천 순위 카드의 값(디자인 L760-768). */
export const MOCK_RANK = {
  position: 5,
  total: 14,
  /** 탄천 Ranking Zone 안에서 달린 누적 거리(km). 소수 첫째 자리까지 보여 준다. */
  tancheonDistanceKm: 61.0,
} as const;

/**
 * 내 위치 핀(`TancheonMapBrand.dc.html:57-58`).
 *
 * 실제 GPS 는 이슈 #42 의 제외 범위라 좌표도 mock 이다. 확인 중 · 준비완료
 * 어느 쪽이든 같은 자리에 찍힌다 — 정본도 핀 자체는 상태로 가르지 않고,
 * 확인 중에는 딤이 지도를 덮는다(L724-730).
 */
export const MOCK_USER_PIN: MapPoint = { x: 155, y: 112 };

/** 카운트다운이 끝나면 가는 곳(#40). 아직 없으면 404 가 정상이다. */
export const RUNNING_ROUTE = "/running";
