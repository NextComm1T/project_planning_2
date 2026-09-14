import { AppShell } from "@/components/shared/AppShell";
import { Header } from "@/components/shared/Header";

import { NicknameEditForm } from "./NicknameEditForm";

/**
 * 닉네임 수정 — 가입 후 변경(디자인 L595-627 · F10 ② · P10).
 *
 * 최초 설정(#39)과 다른 점은 **실패해도 기존 닉네임이 그대로 유지**된다는 것이다.
 * 그래서 「현재 저장된 닉네임」은 이 서버 컴포넌트가 쥐고 prop 으로만 내려보내고,
 * 입력 중인 draft 는 NicknameEditForm 의 state 로 따로 둔다 — 검증 실패나 중복
 * 판정이 현재 닉네임을 건드릴 수 있는 경로 자체가 없다.
 *
 * 디자인과 문서가 갈리는 지점은 modify/2026-09-14-settings-nickname.md 에 있다.
 */

/**
 * 현재 저장된 닉네임 mock(디자인 L1173 의 기본값).
 *
 * TODO(F10 · R15): 인증이 붙으면 로그인 세션의 「사용자 · 닉네임」을 읽는다.
 * 서버가 없어 고정값이며, 값을 기다리는 「불러오는 중」 상태도 아직 없다.
 */
const CURRENT_NICKNAME = "뚝심주자";

export default function SettingsNicknamePage() {
  return (
    <AppShell
      header={
        <Header
          showBack
          backHref="/settings"
          title={
            <span className="block">
              <span className="mb-0.5 block text-label font-semibold text-muted">
                설정
              </span>
              닉네임 수정
            </span>
          }
        />
      }
    >
      <NicknameEditForm currentNickname={CURRENT_NICKNAME} />
    </AppShell>
  );
}
