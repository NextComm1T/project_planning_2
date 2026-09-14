import { AppShell } from "@/components/shared/AppShell";
import { Header } from "@/components/shared/Header";

import { WithdrawButton } from "./WithdrawButton";

/**
 * 회원탈퇴 — 삭제 항목 확인 단계(디자인 L567-594 · F13 · P12 · P13).
 *
 * 정적인 안내뿐이라 화면 전체가 Server Component 다. 클라이언트가 필요한
 * 조각은 뒤로 가기(BackButton)뿐이고 그건 이미 공용 컴포넌트가 맡는다.
 *
 * 디자인과 문서가 갈리는 지점은 modify/20260914-settings-withdraw.md 에 있다.
 */

/**
 * 탈퇴하면 지워지는 것(06-data.md:58 비기능 절 「회원 탈퇴(F13) 시 삭제 범위」).
 * 디자인 L580 의 목록과 같고, 순서도 그대로 뒀다.
 */
const DELETED_ITEMS = [
  "서비스 사용자 정보",
  "닉네임",
  "개인 러닝 기록",
  "저장된 GPS 이동 경로",
  "탄천 인정 누적 거리",
  "사용자 누적 데이터",
  "랭킹 반영 데이터",
];

/**
 * 로그인 제공자 mock(디자인 L1019 초기값).
 *
 * TODO(F8 · F13): 인증이 붙으면 로그인 세션에서 읽는다. 서버가 없어
 * 고정값이며, 값을 기다리는 「불러오는 중」 상태도 아직 없다.
 */
const LOGIN_PROVIDER = "Google";

/**
 * 진행 중인 러닝 세션이 있는지(P12).
 *
 * TODO(F13 · P12): 서버가 생기면 세션 상태를 조회해 판정한다. 지금은 조회할
 * 곳이 없어 `/settings/withdraw?session=running` 으로 차단 상태를 본다 —
 * 로그인 화면이 `/login?error=` 로 실패 안내를 보는 것과 같은 방식이고,
 * 가짜 조회 성공·실패를 만들지 않으려고 URL 로 뒀다.
 */
function hasRunningSession(raw: string | string[] | undefined): boolean {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === "running";
}

export default async function SettingsWithdrawPage({
  searchParams,
}: PageProps<"/settings/withdraw">) {
  const { session } = await searchParams;
  const isBlocked = hasRunningSession(session);

  return (
    <AppShell
      header={
        <Header
          showBack
          // 취소 = 뒤로 가기다. 아무것도 지우지 않고 설정으로 돌아간다(P13).
          backHref="/settings"
          title={
            <span className="block">
              <span className="mb-0.5 block text-label font-semibold text-muted">
                설정
              </span>
              회원탈퇴
            </span>
          }
        />
      }
    >
      <div className="flex flex-col gap-3 py-[22px]">
        <h2 className="mb-0.5 text-[22px] font-extrabold tracking-[-0.4px]">
          회원탈퇴 전에 확인해주세요.
        </h2>

        <section className="rounded-2xl border-[1.5px] border-border bg-surface px-5 py-[18px] shadow-card">
          <h3 className="mb-2.5 text-note font-bold text-muted">삭제되는 정보</h3>
          <ul className="text-content leading-[1.9] font-medium">
            {DELETED_ITEMS.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </section>

        {/* P13 — 되살릴 수 없고, 같은 소셜 계정으로 다시 가입해도 복원되지 않는다. */}
        <p className="rounded-2xl border-[1.5px] border-error-border bg-error-soft px-5 py-[18px] text-content leading-[1.7] font-bold text-error">
          삭제된 러닝 기록과 경로는 복구할 수 없습니다.
          <br />
          동일한 소셜 계정으로 다시 가입하더라도 이전 기록은 복원되지 않습니다.
        </p>

        <p className="rounded-2xl border-[1.5px] border-border bg-surface px-5 py-[18px] text-content leading-[1.65] font-medium text-subtle">
          현재 로그인한 {LOGIN_PROVIDER} 계정의 데이터만 삭제됩니다.
        </p>

        {/*
          P12 — 진행 중인 러닝이 있으면 탈퇴를 막는다. 디자인에는 이 안내가
          없어 문구를 문서(05-policy.md:25)에서 가져왔다. modify/ 2번.
        */}
        {isBlocked ? (
          <p
            role="alert"
            className="rounded-2xl border-[1.5px] border-warning-border bg-warning-soft px-5 py-[18px] text-content leading-[1.7] font-bold text-warning"
          >
            진행 중인 러닝을 먼저 종료해 주세요
          </p>
        ) : null}

        {/*
          확정 버튼과 최종 확인 모달(디자인 L590 · L951-965)은 상호작용이 있어
          클라이언트 조각으로 뺐다. 모달은 #46 의 `../ConfirmDialog` 를 그대로 쓴다.
        */}
        <WithdrawButton disabled={isBlocked} />
      </div>
    </AppShell>
  );
}
