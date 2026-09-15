import type { GpsState } from "./mock";
import { RunTab } from "./RunTab";

/**
 * 실제 GPS · 권한 요청은 이슈 #42 의 제외 범위라 준비 여부를 만들 방법이 없다.
 * `/settings?state=…` · `/login?error=…` 가 이미 쓰는 방식 그대로 URL 쿼리로 고른다 —
 * 리뷰어가 코드를 고치지 않고 두 상태를 눈으로 확인할 수 있고, 실제 GPS 가 붙으면
 * 이 자리가 그대로 권한 · 측위 결과가 된다.
 *
 * 기본값이 `checking` 인 건 정본의 초기 상태가 그렇기 때문이다(L1022 `gpsReady: false`).
 * 모르는 값도 `checking` 으로 묶어, 확인되지 않은 GPS 로 러닝이 시작되지 않게 한다(P1).
 */
function resolveGpsState(raw: string | string[] | undefined): GpsState {
  const value = Array.isArray(raw) ? raw[0] : raw;

  return value === "ready" ? "ready" : "checking";
}

/**
 * 홈 — 달리기 탭. 탭바의 「달리기」가 가리키는 route 다.
 *
 * `/` 가 아니라 `/home` 인 이유는 `/` 가 인증 분기 자리이기 때문이다
 * (이슈 #42 결정 이력 · `modify/2026-09-15-bottomnav.md`).
 * 이 화면을 만들면서 `src/app/page.tsx` 의 redirect 를 건드리지 않는다.
 */
export default async function HomePage({ searchParams }: PageProps<"/home">) {
  const { gps } = await searchParams;

  return <RunTab gps={resolveGpsState(gps)} />;
}
