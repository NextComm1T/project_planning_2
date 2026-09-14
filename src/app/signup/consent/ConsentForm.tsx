"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

type ConsentFormProps = {
  /** 동의 카드와 계속하기 버튼 사이에 들어가는 정적 블록(개인정보처리방침 카드). */
  children?: ReactNode;
};

/**
 * 필수 동의 항목과 계속하기 버튼 — 디자인 L107-132.
 *
 * 동의 상태는 이 컴포넌트의 지역 상태다. 서버가 없어 저장하지 않고,
 * 상세 화면(`/signup/consent/detail`)에 다녀왔을 때의 상태 유지는 그 화면을
 * 만드는 #38 에서 연결한다 — modify/2026-09-14-signup-consent.md 6번.
 */
export function ConsentForm({ children }: ConsentFormProps) {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  /**
   * TODO(F8 · F10): 서버가 붙으면 여기서 동의 결과를 저장한 뒤 닉네임 설정으로
   * 넘긴다. 지금은 저장할 곳이 없어 이동만 한다 — 가짜 성공을 만들지 않는다.
   */
  function handleContinue() {
    router.push("/signup/nickname");
  }

  return (
    <div className="flex flex-1 flex-col pb-[22px]">
      <div className="rounded-2xl border-[1.5px] border-border bg-surface shadow-card">
        {/*
          토글과 상세 이동은 서로 다른 동작이다. 두 영역이 겹치지 않게 형제로
          두고, 버튼 안에 버튼을 넣지 않는다. 체크 네모는 <span> 이고 클릭은
          바깥 토글 버튼이 받는다.
        */}
        <div className="flex items-center py-[17px] pr-5">
          <button
            type="button"
            role="checkbox"
            aria-checked={agreed}
            onClick={() => setAgreed((prev) => !prev)}
            /*
              세로 여백 11px 로 hit area 를 48px 로 만들고, 음수 margin 으로
              레이아웃 높이는 체크 네모 26px 그대로 둔다 — 카드 높이를
              디자인(L107 행 = 화살표 32px 기준)과 맞추기 위해서다.
            */
            className="-my-[11px] flex min-w-0 flex-1 cursor-pointer items-center gap-[14px] py-[11px] pl-5 text-left"
          >
            <span
              className={`flex size-[26px] shrink-0 items-center justify-center rounded-[9px] border-[1.5px] ${
                agreed
                  ? "border-primary bg-primary"
                  : "border-border-strong bg-surface"
              }`}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`text-on-primary ${agreed ? "opacity-100" : "opacity-0"}`}
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </span>

            <span className="flex min-w-0 items-center gap-1.5">
              <span className="shrink-0 text-sm font-extrabold text-primary">
                [필수]
              </span>
              <span className="truncate text-base font-bold">
                개인정보 수집·이용 동의
              </span>
            </span>
          </button>

          {/*
            디자인의 화살표 버튼은 배경이 없어(L115) 보이는 것은 아이콘뿐이다.
            클릭 상자만 48×48 로 키우고 음수 margin 으로 되돌리면 아이콘 위치는
            디자인 그대로(오른쪽에서 36px)이면서 터치 영역만 넓어진다.
          */}
          <Link
            href="/signup/consent/detail"
            aria-label="개인정보 수집·이용 동의 내용 보기"
            className="-my-2 -mr-2 flex size-12 shrink-0 items-center justify-center text-muted"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        </div>
      </div>

      {children}

      <div className="mt-auto pt-6 pb-2.5">
        <button
          type="button"
          disabled={!agreed}
          onClick={handleContinue}
          className={`h-[60px] w-full cursor-pointer rounded-xl text-[19px] font-extrabold disabled:cursor-not-allowed ${
            agreed
              ? "bg-primary text-on-primary"
              : "bg-disabled-surface text-disabled"
          }`}
        >
          동의하고 계속하기
        </button>
      </div>
    </div>
  );
}
