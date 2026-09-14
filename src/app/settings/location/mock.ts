/**
 * 위치정보 화면이 보여 주는 값들.
 *
 * 서버도 인증도 없고(`docs/ARCHITECTURE.md:171`) 실제 브라우저·OS 권한 요청은
 * 이슈 #47 의 제외 범위라, 권한 상태는 조회 결과 자리만 남긴 mock 이다.
 * 가짜 성공·실패로 흉내내지 않는다 — 값만 둔다.
 *
 * 안내 문구는 전부 디자인 `탄천런.dc.html` L450-469 의 것을 그대로 옮겼다.
 */

/**
 * 위치 권한 조회 결과.
 *
 * 디자인에는 허용 · 미허용 둘뿐이다(L1317 `s.gpsReady ? '사용 중' : '권한 필요'`).
 * `unknown` 은 이 화면의 **빈 상태**로 쓰려고 더한 값이다 — 브라우저가 권한 조회를
 * 지원하지 않아 조회 결과가 비는 경우이며, 안내 문구는 늘 옳으므로 이 화면에서
 * 데이터가 빌 수 있는 곳은 여기뿐이다(`docs/07-screens.md:14`).
 */
export type LocationPermission = "granted" | "denied" | "unknown";

/** 권한 조회 자체의 진행 상태. 조회 결과(`LocationPermission`)와 구분한다. */
export type LocationQueryState = "loading" | "error" | "ready";

/** 권한 상태 문구 — 허용 · 미허용은 디자인 L1317 그대로다. */
export const PERMISSION_LABEL: Record<LocationPermission, string> = {
  granted: "사용 중",
  denied: "권한 필요",
  unknown: "확인 불가",
};

/** 권한 상태 색 — 디자인 L1318 은 허용 `#2F6FE8`(primary) · 미허용 `#EF6A5E`(danger). */
export const PERMISSION_TONE: Record<LocationPermission, string> = {
  granted: "text-primary",
  denied: "text-danger",
  unknown: "text-muted",
};

/**
 * 권한 허용 버튼을 띄울 상태.
 *
 * 디자인은 미허용일 때만 버튼을 그린다(L470 `sc-if locationDenied`) — 허용된
 * 상태에서는 버튼 자체가 없다. 조회에 실패했거나(`unknown`) 허용 여부를 확신할 수
 * 없을 때도 허용할 길은 있어야 하므로 함께 띄운다.
 */
export function needsPermissionAction(permission: LocationPermission): boolean {
  return permission !== "granted";
}

/** 위치정보를 사용하는 이유(디자인 L452). */
export const USAGE_REASONS = [
  "러닝 중 현재 위치 확인",
  "총 러닝 거리 계산",
  "탄천 Ranking Zone 내부·외부 판정",
  "탄천 인정 거리 계산",
  "러닝 경로 기록",
  "기록 상세 화면의 이동 경로 표시",
] as const;

/** 저장되는 위치정보(디자인 L456). */
export const STORED_ITEMS = [
  "러닝 중 측정한 GPS 위치정보",
  "러닝 이동 경로",
] as const;

/** 사용 시점(디자인 L460). */
export const USAGE_PERIOD =
  "러닝을 시작한 후 종료할 때까지 위치정보를 사용합니다. 러닝 종료 후에는 기록 상세 화면에서 경로를 다시 보여주기 위해 저장된 이동 경로를 사용합니다.";

/** 권한을 허용하지 않을 경우(디자인 L464 · P1). */
export const WITHOUT_PERMISSION =
  "위치 권한이 없으면 러닝을 시작할 수 없습니다. 로그인, 홈 확인, 기존 기록 조회, 설정, 로그아웃, 회원탈퇴는 그대로 이용할 수 있습니다.";
