import Link from "next/link";

import { AppShell } from "@/components/shared/AppShell";

import { LoginHero } from "./LoginHero";
import { SocialLoginButtons } from "./SocialLoginButtons";

/**
 * 로그인 실패 안내(F8 예외 · 디자인 L1144-1145).
 *
 * OAuth 콜백이 실패를 돌려줄 때 `/login?error=...` 로 돌아오게 해서
 * 이 문구를 띄운다.
 */
const LOGIN_ERROR_MESSAGES = {
  cancelled: "로그인이 취소되었습니다.",
  failed: "로그인에 실패했습니다. 다시 시도해주세요.",
} as const;

function resolveLoginError(raw: string | string[] | undefined): string | null {
  if (!raw) return null;

  const code = Array.isArray(raw) ? raw[0] : raw;

  // 알 수 없는 값은 일반 실패로 묶는다 — 사용자에게 원인 코드를 그대로 보이지 않는다.
  return code === "cancelled"
    ? LOGIN_ERROR_MESSAGES.cancelled
    : LOGIN_ERROR_MESSAGES.failed;
}

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { error } = await searchParams;
  const errorMessage = resolveLoginError(error);

  return (
    <AppShell padded={false}>
      <LoginHero />

      <div className="relative z-[2] -mt-[31px] px-7 pt-0.5">
        <h1 className="mt-[5px] mb-1 text-hero leading-[1.25] font-extrabold tracking-[-0.5px]">
          탄천에서
          <br />
          함께 달려요
        </h1>
        <p className="text-content leading-[1.6] font-medium text-muted">
          탄천에서 달리고, 이웃 러너와 경쟁해보세요.
        </p>
      </div>

      <div className="relative mt-auto flex flex-col gap-[11px] px-6 pt-[26px] pb-7">
        <SocialLoginButtons />

        {errorMessage ? (
          <div
            role="alert"
            className="mt-0.5 rounded-md border-[1.5px] border-error-border bg-error-soft px-4 py-3"
          >
            <p className="text-center text-sm font-bold text-error">
              {errorMessage}
            </p>
          </div>
        ) : null}

        <div className="mt-2.5 flex flex-col items-center gap-2.5">
          <Link
            href="/privacy-policy"
            className="text-label font-medium text-link-muted underline"
          >
            개인정보처리방침 보기
          </Link>
          <p className="text-center text-[10.5px] font-bold tracking-[2.5px] text-wordmark">
            TANCHEON RUN
          </p>
        </div>
      </div>
    </AppShell>
  );
}
