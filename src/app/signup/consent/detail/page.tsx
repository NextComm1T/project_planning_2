import { AppShell } from "@/components/shared/AppShell";
import { Header } from "@/components/shared/Header";

/**
 * 동의 상세에 보여 주는 고지 4절(디자인 L149-162).
 *
 * 법적 고지라 문구를 임의로 다듬지 않고 디자인 원문 그대로 둔다.
 * 문서(05-policy.md:43 SP3)와 갈리는 지점은
 * modify/2026-09-14-signup-consent-detail.md 에 기록했다.
 */
const CONSENT_SECTIONS = [
  {
    title: "수집·이용 목적",
    body: "소셜 로그인 기반 회원 식별, 탄천 러닝 기록 저장 및 랭킹 제공",
  },
  {
    title: "수집·이용 항목",
    body: "소셜 계정 식별자, 닉네임, 러닝 기록(거리·시간·페이스), 러닝 중 위치정보",
  },
  {
    title: "보유 및 이용기간",
    body: "회원 탈퇴 시까지 보유하며, 탈퇴 후 지체 없이 삭제합니다.",
  },
  {
    title: "동의 거부 권리 및 제한",
    body: "동의를 거부할 수 있습니다. 다만 필수 항목에 동의하지 않으면 회원가입 및 러닝 기록·랭킹 서비스를 이용할 수 없습니다.",
  },
] as const;

/**
 * 개인정보 수집·이용 동의 상세(디자인 L136-167).
 *
 * 동의를 받는 화면이 아니라 동의 내용을 읽기만 하는 화면이다 — 체크박스도
 * CTA 도 없다. 동의 자체는 진입 화면인 `/signup/consent`(#37)에서 받는다.
 */
export default function SignupConsentDetailPage() {
  return (
    <AppShell
      header={
        <Header
          showBack
          backHref="/signup/consent"
          title={
            // <h1> 안이라 블록 요소 대신 span 을 쓴다(h1 은 phrasing content 만 받는다).
            <span className="block">
              <span className="mb-0.5 block text-label font-semibold text-muted">
                가입하기
              </span>
              <span className="block text-title font-extrabold">
                개인정보 수집·이용 동의
              </span>
            </span>
          }
        />
      }
    >
      <div className="flex flex-col gap-3 py-[22px]">
        {CONSENT_SECTIONS.map((section) => (
          <section
            key={section.title}
            className="rounded-2xl border-[1.5px] border-border bg-surface px-5 py-[18px] shadow-card"
          >
            <h2 className="mb-2 text-note font-bold text-muted">
              {section.title}
            </h2>
            <p className="text-content leading-[1.65] font-medium">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
