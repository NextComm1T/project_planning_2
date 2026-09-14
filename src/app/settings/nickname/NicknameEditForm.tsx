"use client";

import { useState } from "react";

/** 닉네임 길이 규칙(디자인 L609 maxLength · L1261). 문서는 9자 이하라 modify/ 에 기록했다. */
const MIN_LENGTH = 2;
const MAX_LENGTH = 10;

/**
 * 한글·영문·숫자만 허용한다(P10).
 *
 * `ㄱ-ㅎㅏ-ㅣ` 를 함께 허용해야 **한글 자음·모음만으로 된 닉네임**이 통과한다
 * (P10 팀 확정 2026-09-11 9차). `가-힣` 은 조합된 음절(U+AC00-U+D7A3)뿐이라
 * 이 범위가 없으면 "ㄱㄴㄷ" 이 특수문자로 걸린다.
 */
const DISALLOWED_CHAR = /[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]/;

/**
 * 중복 판정용 mock — 디자인 L1011 의 목록을 그대로 옮겼다.
 *
 * TODO(F10 · R15): 서버가 생기면 중복 검사를 API 로 옮긴다. 그때 응답을
 * 기다리는 「불러오는 중」 상태가 이 화면에 생긴다 — 지금은 로컬 목록이라
 * 즉시 판정되고 기다릴 것이 없다.
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

/**
 * 화면의 네 상태(`docs/07-screens.md:12`)를 이 한 값으로 읽는다.
 *
 * - 빈 상태 → `empty`
 * - 오류 → `invalid`(형식 위반) · `duplicate`(중복) — P10 의 실패 사유 3종을
 *   하나로 묶지 않으려고 미입력 · 형식 위반 · 중복을 서로 다른 분기로 둔다
 * - 정상 → `unchanged`(바꾼 것이 없음) · `ready`(저장 가능)
 * - 불러오는 중 → 없다. 현재 닉네임도 중복 목록도 mock 상수라 기다릴 것이 없다.
 */
type Status = "empty" | "invalid" | "duplicate" | "unchanged" | "ready";

type Result = { status: Status; message: string | null };

/**
 * 사유별로 다른 안내를 돌려준다(P10 · 디자인 L1263-1267).
 *
 * 판정 순서에서 `unchanged` 가 중복 검사보다 앞선다 — 서버가 붙어 중복 목록에
 * 본인 닉네임이 들어와도 "이미 사용 중"이라고 말하지 않게 하려는 것이다.
 */
function resolve(draft: string, currentNickname: string): Result {
  const nickname = draft.trim();

  if (nickname.length === 0) {
    // 디자인에는 이 문구가 없어 문서(P10) 쪽을 썼다 — #39 와 같은 문구다.
    return { status: "empty", message: "닉네임을 입력해 주세요" };
  }
  if (draft.includes(" ")) {
    return { status: "invalid", message: "공백은 포함할 수 없습니다." };
  }
  if (DISALLOWED_CHAR.test(nickname)) {
    return { status: "invalid", message: "특수문자는 사용할 수 없습니다." };
  }
  if (nickname.length < MIN_LENGTH) {
    return { status: "invalid", message: `${MIN_LENGTH}자 이상 입력해주세요.` };
  }
  if (nickname.length > MAX_LENGTH) {
    // 입력은 maxLength 가 막지만 규칙 자체는 남겨 둔다(디자인 L1266).
    return { status: "invalid", message: `${MAX_LENGTH}자 이하로 입력해주세요.` };
  }
  if (nickname === currentNickname) {
    return { status: "unchanged", message: "현재 닉네임과 동일합니다." };
  }
  if (isTaken(nickname)) {
    return { status: "duplicate", message: "이미 사용 중인 닉네임입니다." };
  }

  // 디자인의 수정 화면에는 성공 문구가 없다(최초 설정 화면과 다른 점).
  return { status: "ready", message: null };
}

/**
 * 닉네임 저장.
 *
 * TODO(F10 · P10): 서버가 생기면 여기서 저장하고 설정 화면으로 돌아간다.
 * 저장할 곳이 없어 아직 아무 일도 하지 않는다 — 가짜 성공이나 가짜 실패로
 * 흉내내지 않는다. 실패 안내("저장에 실패했습니다. 다시 시도해주세요." ·
 * 디자인 L1197)도 실제 실패가 생기는 시점에 붙인다.
 */
function saveNickname(nickname: string) {
  void nickname;
}

type NicknameEditFormProps = {
  /**
   * 현재 저장된 닉네임. **읽기 전용이다.**
   * 입력 중인 값은 이 컴포넌트의 draft state 이고, 검증 실패나 중복 판정이
   * 이 prop 을 바꾸지 않는다 — 저장에 실패해도 기존 닉네임이 유지된다(P10).
   */
  currentNickname: string;
};

/**
 * 닉네임 입력 · 검증 · 저장.
 *
 * 부모(AppShell 의 main)가 flex 컬럼이라 fragment 를 돌려준다 — 저장 버튼이
 * `mt-auto` 로 화면 바닥에 붙으려면 중간에 감싸는 div 가 없어야 한다.
 */
export function NicknameEditForm({ currentNickname }: NicknameEditFormProps) {
  // 들어오면 현재 닉네임이 채워져 있다(디자인 L1173).
  const [draft, setDraft] = useState(currentNickname);

  const { status, message } = resolve(draft, currentNickname);
  const canSave = status === "ready";
  const isError = status === "empty" || status === "invalid" || status === "duplicate";

  return (
    <>
      <div className="py-[22px]">
        {/* 그림자는 디자인이 alpha 0.05, 토큰(shadow-card)은 0.06 이다. */}
        <div className="rounded-xl border-[1.5px] border-info-border bg-surface px-5 py-[18px] shadow-card">
          <label
            htmlFor="nickname"
            className="mb-2 block text-label font-bold text-muted"
          >
            닉네임
          </label>
          <input
            id="nickname"
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="닉네임 입력"
            maxLength={MAX_LENGTH}
            autoFocus
            aria-describedby="nickname-hint nickname-feedback"
            aria-invalid={isError}
            className="w-full bg-transparent text-title font-bold text-foreground outline-none placeholder:text-disabled"
          />

          <div className="mt-3.5 flex items-center justify-between border-t border-surface-muted pt-3.5">
            <p
              id="nickname-hint"
              className="text-note leading-[1.45] font-medium text-muted"
            >
              다른 러너들에게 표시되는 이름이에요.
            </p>
            <span className="ml-2 shrink-0 text-note font-bold text-muted">
              {draft.length}/{MAX_LENGTH}
            </span>
          </div>
        </div>

        <p
          id="nickname-feedback"
          role="status"
          className={`mt-2.5 ml-1 text-sm ${
            isError ? "font-semibold text-danger" : "font-medium text-muted"
          }`}
        >
          {message ?? ""}
        </p>
      </div>

      <div className="mt-auto shrink-0 pb-[34px]">
        <button
          type="button"
          disabled={!canSave}
          onClick={() => saveNickname(draft.trim())}
          className={`h-[60px] w-full rounded-xl text-[19px] font-extrabold ${
            canSave
              ? "bg-primary text-on-primary"
              : "cursor-not-allowed bg-disabled-surface text-disabled"
          }`}
        >
          저장
        </button>
      </div>
    </>
  );
}
