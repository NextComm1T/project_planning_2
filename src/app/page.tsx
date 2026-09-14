import { redirect } from "next/navigation";

/**
 * 앱 진입점.
 *
 * 문서(07-screens.md:35-38)의 첫 화면 분기는 네 갈래다.
 *   로그아웃           → 로그인 화면
 *   진행 중 세션 있음  → 러닝 진행 화면(이어서 측정)
 *   가입 중            → 닉네임 설정 화면
 *   가입 완료 + 세션 없음 → 러닝 시작 화면
 *
 * 아직 인증이 없어 항상 로그아웃으로 본다. 인증이 붙으면 이 자리가 그대로
 * 분기점이 되고, 가입 완료 상태일 때 러닝 시작 화면(F1)을 여기서 그린다.
 */
export default function Home() {
  redirect("/login");
}
