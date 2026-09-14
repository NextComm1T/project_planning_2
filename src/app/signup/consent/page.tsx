import { AppShell } from "@/components/shared/AppShell";
import { Header } from "@/components/shared/Header";

import { ConsentForm } from "./ConsentForm";
import { PrivacyPolicyCard } from "./PrivacyPolicyCard";

/**
 * 가입 절차를 시작한 소셜 제공자 이름(디자인 L105 · L1146).
 *
 * 아직 인증이 없어 화면 스스로는 제공자를 알 수 없다. OAuth 콜백이 붙으면
 * `/signup/consent?provider=kakao` 로 넘겨 주는 자리다.
 */
const PROVIDER_LABELS = {
  kakao: "카카오",
  google: "Google",
} as const;

/** 제공자를 모를 때 쓰는 문구. 디자인에는 없는 문장이다(modify 기록 3번). */
const UNKNOWN_PROVIDER_LABEL = "소셜";

function resolveProviderLabel(raw: string | string[] | undefined): string {
  if (!raw) return UNKNOWN_PROVIDER_LABEL;

  const provider = Array.isArray(raw) ? raw[0] : raw;

  // 알 수 없는 값을 그대로 문장에 넣지 않는다.
  return provider === "kakao" || provider === "google"
    ? PROVIDER_LABELS[provider]
    : UNKNOWN_PROVIDER_LABEL;
}

/**
 * 가입하기(개인정보 수집·이용 동의) 화면 — 디자인 L95-135.
 *
 * 공통 완료 기준의 네 상태(docs/07-screens.md:12) 중 이 화면에 있는 것은
 * 「정상」뿐이다. 원격 데이터도 서버 요청도 없어 불러오는 중 · 빈 상태 · 오류가
 * 성립하지 않는다 — 근거는 modify/2026-09-14-signup-consent.md 5번.
 */
export default async function SignupConsentPage({
  searchParams,
}: PageProps<"/signup/consent">) {
  const { provider } = await searchParams;
  const providerLabel = resolveProviderLabel(provider);

  return (
    <AppShell header={<Header title="가입하기" showBack backHref="/login" />}>
      <h2 className="mb-2.5 pt-[22px] text-metric leading-[normal] font-extrabold tracking-[-0.5px]">
        서비스 이용을 위해
        <br />
        아래 내용을 확인해주세요.
      </h2>
      <p className="mb-[22px] text-content leading-[1.6] font-medium text-muted">
        {providerLabel} 계정으로 가입을 진행합니다.
      </p>

      {/*
        정책 카드는 상태가 없다. children 으로 넘겨 서버 렌더로 남긴다
        (AppShell 의 슬롯과 같은 방식).
      */}
      <ConsentForm>
        <PrivacyPolicyCard />
      </ConsentForm>
    </AppShell>
  );
}
