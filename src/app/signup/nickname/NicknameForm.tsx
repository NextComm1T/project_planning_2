"use client";

import { useState } from "react";

/** 닉네임 길이 규칙(디자인 L186 · L1194). 문서는 9자 이하라 modify/ 에 기록했다. */
const MIN_LENGTH = 2;
const MAX_LENGTH = 10;

/** 한글·영문·숫자만 허용한다(P10 · 디자인 L1194). */
const DISALLOWED_CHAR = /[^가-힣a-zA-Z0-9]/;

/**
 * 중복 판정용 mock.
 *
 * TODO(F10 · R15): 서버가 생기면 중복 검사를 API 로 옮긴다. 그때 응답을
 * 기다리는 「불러오는 중」 상태가 이 화면에 생긴다 — 지금은 로컬 목록이라
 * 즉시 판정되고 로딩이 없다.
 *
 * 디자인 L1011 의 목록을 그대로 옮겼다.
 */
const TAKEN_NICKNAMES = [
  "달리는공룡",
  "탄천마라토너",
  "새벽러너김",
  "성남러닝크루",
  "탄천의별",
  "동네한바퀴",
  "매일조금씩",
  "바람같이",
  "오늘도달려",
  "꾸준함이최고",
  "느려도멀리",
  "탄천초보러너",
  "즐기는러너",
];

/** 중복 판정에서 영문 대소문자는 구분하지 않는다(P10, `docs/05-policy.md:23`). */
function isTaken(nickname: string) {
  return TAKEN_NICKNAMES.some(
    (taken) => taken.toLowerCase() === nickname.toLowerCase(),
  );
}

type Feedback = { text: string; tone: "error" | "success" };

/**
 * 사유별로 다른 안내를 돌려준다(P10 · 디자인 L1196-1202).
 * 아직 한 번도 입력하지 않았으면 `null` — 처음부터 오류를 띄우지 않는다.
 */
function validate(raw: string | null): Feedback | null {
  if (raw === null) return null;

  const nickname = raw.trim();

  if (nickname.length === 0) {
    // 디자인에는 이 문구가 없어 문서(P10) 쪽을 썼다.
    return { text: "닉네임을 입력해 주세요", tone: "error" };
  }
  if (raw.includes(" ")) {
    return { text: "공백은 포함할 수 없습니다.", tone: "error" };
  }
  if (DISALLOWED_CHAR.test(nickname)) {
    return { text: "특수문자는 사용할 수 없습니다.", tone: "error" };
  }
  if (isTaken(nickname)) {
    return { text: "이미 사용 중인 닉네임입니다.", tone: "error" };
  }
  if (nickname.length < MIN_LENGTH) {
    return { text: `${MIN_LENGTH}자 이상 입력해주세요.`, tone: "error" };
  }
  if (nickname.length > MAX_LENGTH) {
    return { text: `${MAX_LENGTH}자 이하로 입력해주세요.`, tone: "error" };
  }

  return { text: "사용할 수 있는 닉네임입니다.", tone: "success" };
}

/**
 * 닉네임 저장.
 *
 * TODO(F10 · P10): 서버가 생기면 여기서 저장하고(가입 중 → 가입 완료)
 * 러닝 시작 화면으로 보낸다(`docs/07-screens.md:46`). 저장할 곳이 없어
 * 아직 아무 일도 하지 않는다 — 가짜 성공으로 흉내내지 않는다.
 */
function saveNickname(nickname: string) {
  void nickname;
}

/**
 * 닉네임 입력 · 검증 · 제출.
 *
 * 부모의 flex 컬럼에 그대로 얹히도록 fragment 를 돌려준다 — 버튼 블록의
 * `mt-auto` 가 화면 바닥에 붙으려면 중간에 감싸는 div 가 없어야 한다.
 */
export function NicknameForm() {
  // null 은 "아직 입력하지 않음". 지웠을 때의 미입력 안내와 구분하려고 쓴다.
  const [value, setValue] = useState<string | null>(null);
  const nickname = value ?? "";

  const feedback = validate(value);
  const isValid = feedback?.tone === "success";

  return (
    <>
      {/* 그림자는 디자인이 alpha 0.05, 토큰(shadow-card)은 0.06 이다. */}
      <div className="rounded-xl border-[1.5px] border-info-border bg-surface px-5 py-[18px] shadow-card">
        <input
          type="text"
          value={nickname}
          onChange={(event) => setValue(event.target.value)}
          placeholder="닉네임 입력"
          maxLength={MAX_LENGTH}
          autoFocus
          aria-label="닉네임"
          aria-describedby="nickname-rule nickname-feedback"
          aria-invalid={feedback?.tone === "error"}
          className="w-full bg-transparent text-[21px] font-bold text-foreground outline-none placeholder:text-disabled"
        />
      </div>

      <div className="mt-2.5 flex items-center justify-between px-1">
        <span id="nickname-rule" className="text-note font-medium text-muted">
          {MIN_LENGTH}~{MAX_LENGTH}자, 공백 · 특수문자 불가
        </span>
        <span className="text-note font-bold text-muted">
          {nickname.length}/{MAX_LENGTH}
        </span>
      </div>

      <p
        id="nickname-feedback"
        role="status"
        className={`mx-1 mt-2.5 text-sm font-semibold ${
          feedback?.tone === "success" ? "text-success" : "text-danger"
        }`}
      >
        {feedback?.text ?? ""}
      </p>

      <div className="mt-auto shrink-0 pt-5 pb-[34px]">
        <button
          type="button"
          disabled={!isValid}
          onClick={() => saveNickname(nickname.trim())}
          className={`h-[60px] w-full rounded-xl text-[19px] font-extrabold ${
            isValid
              ? "bg-primary text-on-primary"
              : "cursor-not-allowed bg-disabled-surface text-disabled"
          }`}
        >
          시작하기
        </button>
      </div>
    </>
  );
}
