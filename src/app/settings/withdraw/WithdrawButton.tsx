"use client";

import { useState } from "react";

import { ConfirmDialog } from "../ConfirmDialog";

/**
 * 회원탈퇴 확정 버튼 + 최종 확인 모달 — 디자인 L590(버튼) · L951-965(모달).
 *
 * 디자인 script 상 이 화면의 버튼이 `onWithdrawConfirm` 으로 모달을 연다
 * (L1327 `modal:'withdraw'`). 모달 컴포넌트 자체는 #46 이 만든
 * `../ConfirmDialog` 를 그대로 쓴다 — **같은 모달을 두 벌 만들지 않는다.**
 * Esc · 바깥 클릭 · 포커스 트랩 · 닫은 뒤 트리거로 포커스 복귀는 거기서 온다.
 *
 * 이 화면에서 상호작용이 필요한 유일한 조각이라 여기만 클라이언트 컴포넌트다.
 */
export function WithdrawButton({ disabled }: { disabled: boolean }) {
  const [open, setOpen] = useState(false);

  /**
   * TODO(F13 · P13): 서버가 붙으면 여기서 실제 탈퇴를 처리하고, 끝난 뒤
   * 완료 안내를 거쳐 로그인 화면으로 보낸다(`docs/07-screens.md:71`).
   *
   * **지금은 모달을 닫기만 한다.** 지울 서버가 없어 실제로 아무 일도 일어나지
   * 않으므로 화면 이동도, "탈퇴가 완료되었습니다" 같은 성공 문구도 넣지 않는다
   * — 가짜 성공을 만들지 않는다(팀 확정 2026-09-14, 이번 범위는 「버튼 → 확인
   * 모달」까지). 열어 둔 채 멈추면 사용자가 갇히므로 닫기만 한다.
   */
  function handleConfirm() {
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className={`mt-1.5 h-[58px] w-full rounded-xl text-button font-extrabold ${
          disabled
            ? "cursor-not-allowed bg-disabled-surface text-disabled"
            : "bg-danger text-on-primary shadow-danger"
        }`}
      >
        회원탈퇴
      </button>

      {/* 문구는 디자인 L954-955, 확인 버튼 색은 L958(`#EF6A5E` = danger). */}
      <ConfirmDialog
        open={open}
        title="정말 탈퇴하시겠어요?"
        description="러닝 기록과 저장된 경로 등 계정 데이터가 삭제되며 복구할 수 없습니다."
        confirmLabel="탈퇴하기"
        confirmClassName="bg-danger text-on-primary"
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
