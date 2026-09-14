"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ConfirmDialog } from "./ConfirmDialog";
import { ROW_CLASS, ROW_DIVIDER_CLASS, RowChevron } from "./SettingsRow";

/**
 * 「계정」 섹션의 로그아웃 줄(디자인 L425) + 확인 모달(L938-950).
 *
 * 이 화면에서 상호작용이 필요한 유일한 조각이라 여기만 클라이언트 컴포넌트다.
 * 진행 중인 러닝이 있어 막힌 경우(P12)에는 이 줄 대신 서버가 그린
 * `SettingsBlockedRow` 가 들어가므로, 막힌 상태에서는 JS 가 아예 실리지 않는다.
 */
export function LogoutRow() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleConfirm() {
    setOpen(false);

    // TODO(F12 · R25): 인증이 붙으면 여기서 실제 세션을 지운다.
    // 지금은 지울 세션이 없어 로그인 화면으로 보내기만 한다 —
    // 가짜 성공 안내나 가짜 실패로 흉내내지 않는다(`SocialLoginButtons.tsx` 와 같은 방침).
    // push 가 아니라 replace 라서 뒤로 가기로 설정 화면에 되돌아오지 않는다.
    router.replace("/login");
  }

  return (
    <li className={ROW_DIVIDER_CLASS}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${ROW_CLASS} py-[17px]`}
      >
        <span className="text-base font-bold text-foreground">로그아웃</span>
        <span className="flex shrink-0 items-center text-disabled">
          <RowChevron />
        </span>
      </button>

      <ConfirmDialog
        open={open}
        title="로그아웃하시겠어요?"
        description="로그아웃해도 러닝 기록과 계정 데이터는 삭제되지 않습니다."
        confirmLabel="로그아웃"
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
      />
    </li>
  );
}
