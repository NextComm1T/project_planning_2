/**
 * 설정 화면이 보여 주는 값들.
 *
 * 서버가 아직 없어서(`docs/ARCHITECTURE.md:171`) 프로필은 mock 이다.
 * 인증이 붙으면 이 상수 자리가 그대로 서버 조회 자리가 된다.
 * 가짜 성공이나 가짜 실패로 흉내내지 않는다 — 값만 둔다.
 */

/**
 * 프로필 조회 결과. `docs/07-screens.md:14` 의 공통 완료 기준인
 * 「불러오는 중 · 빈 상태 · 오류 · 정상」 네 가지다.
 *
 * `empty` 는 계정 상태가 "가입 중"이라 닉네임이 아직 없는 경우다
 * (`docs/06-data.md:19` · P11). 설정 메뉴 자체는 늘 있으므로
 * 이 화면에서 데이터가 비는 경우는 이것뿐이다.
 */
export type SettingsState = "loading" | "empty" | "error" | "ready";

/** 위치 권한 상태(디자인 L1317-1318). */
export type LocationStatus = "granted" | "denied";

export type SettingsProfile = {
  /** 빈 상태(가입 중)에서는 아직 없다. */
  nickname: string | null;
  /**
   * 카카오 또는 구글(`docs/06-data.md:15`).
   * 디자인은 한글이 아니라 `Kakao` · `Google` 로 적는다(L1146).
   * 빈 상태(가입 중)여도 소셜 인증은 끝난 뒤라 이 값은 늘 있다.
   */
  loginProvider: string;
  locationStatus: LocationStatus;
};

/** 디자인의 기본값 — 닉네임 L1191 · 제공자 L1019 · 위치 권한 L1317. */
export const MOCK_PROFILE: SettingsProfile = {
  nickname: "뚝심주자",
  loginProvider: "Google",
  locationStatus: "granted",
};

/** 위치 권한 문구(디자인 L1317). */
export const LOCATION_STATUS_LABEL: Record<LocationStatus, string> = {
  granted: "사용 중",
  denied: "권한 필요",
};

/** 위치 권한 색(디자인 L1318) — 허용은 primary, 거부는 danger. */
export const LOCATION_STATUS_TONE: Record<LocationStatus, string> = {
  granted: "text-primary",
  denied: "text-danger",
};

/** 진행 중인 러닝이 있을 때 로그아웃·탈퇴를 막고 띄우는 안내(`docs/05-policy.md:25` · P12). */
export const ACTIVE_SESSION_NOTICE = "진행 중인 러닝을 먼저 종료해 주세요";
