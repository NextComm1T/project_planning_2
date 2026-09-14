import { AppShell } from "@/components/shared/AppShell";
import { Header } from "@/components/shared/Header";

import { POLICY_SECTIONS } from "./policySections";

/**
 * 개인정보처리방침 화면 — 디자인 L477-530.
 *
 * 로그인 화면과 설정 화면 두 곳에서 들어온다. 뒤로 가기는 `backHref` 없이
 * `BackButton` 의 `router.back()` 을 그대로 써서 **들어온 곳으로** 돌아간다.
 *
 * 공통 완료 기준의 네 상태(docs/07-screens.md:12) 중 이 화면에 있는 것은
 * 「정상」뿐이다. 본문이 코드 상수라 기다릴 대상도 비어 있을 대상도 실패할
 * 요청도 없다 — 근거는 modify/2026-09-14-privacy-policy.md 3번.
 */
export default function PrivacyPolicyPage() {
  return (
    <AppShell
      header={
        <Header
          showBack
          title={
            /*
              디자인의 2줄 헤더(L484-487). `Header` 가 title 을 <h1> 으로 감싸므로
              블록 요소를 넣지 않고 span 만 쓴다. 작은 "설정"은 eyebrow 라
              aria-hidden 으로 빼서 heading 이름을 "개인정보처리방침" 하나로 둔다.
            */
            <span className="flex flex-col items-start">
              <span
                aria-hidden="true"
                className="mb-0.5 text-label leading-[normal] font-semibold text-muted"
              >
                설정
              </span>
              <span className="text-title leading-[normal] font-extrabold text-foreground">
                개인정보처리방침
              </span>
            </span>
          }
        />
      }
    >
      <div className="py-[22px]">
        <div className="flex flex-col gap-5 rounded-2xl border-[1.5px] border-border bg-surface px-5 py-[22px] shadow-card">
          {POLICY_SECTIONS.map((section) => (
            <section key={section.id}>
              <h2 className="mb-2 text-base leading-[normal] font-extrabold">{section.title}</h2>
              <p className="text-content leading-[1.7] font-medium text-subtle">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
