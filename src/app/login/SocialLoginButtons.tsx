"use client";

type Provider = "kakao" | "google";

/**
 * 소셜 로그인 시작점.
 *
 * TODO(F8 · R13): 카카오 · 구글 OAuth 를 연동한다. 인증에 실패하거나 사용자가
 * 취소하면 `/login?error=cancelled` · `/login?error=failed` 로 돌아오게 해서
 * 이 화면의 에러 상태를 그대로 쓴다.
 *
 * 아직 연동 전이므로 아무 일도 하지 않는다 — 가짜 성공이나 가짜 실패로
 * 흉내내지 않는다.
 */
function signInWith(provider: Provider) {
  void provider;
}

export function SocialLoginButtons() {
  return (
    <>
      <button
        type="button"
        onClick={() => signInWith("kakao")}
        className="flex h-[58px] w-full items-center gap-3 rounded-xl bg-kakao px-[22px] text-button font-extrabold text-foreground shadow-button"
      >
        <KakaoIcon />
        <span className="flex-1 text-center">카카오로 계속하기</span>
      </button>

      <button
        type="button"
        onClick={() => signInWith("google")}
        className="flex h-[58px] w-full items-center gap-3 rounded-xl border-[1.5px] border-border bg-surface px-[22px] text-button font-extrabold text-foreground shadow-button-soft"
      >
        <GoogleIcon />
        <span className="flex-1 text-center">Google로 계속하기</span>
      </button>
    </>
  );
}

function KakaoIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 3C6.9 3 3 6.3 3 10.3c0 2.6 1.7 4.9 4.3 6.2-.2.7-.7 2.6-.8 3 0 0-.1.4.2.5.3.1.6-.1.6-.1.6-.4 3-2.1 3.7-2.6.3 0 .6.1 1 .1 5.1 0 9-3.3 9-7.1S17.1 3 12 3z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
