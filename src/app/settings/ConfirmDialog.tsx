"use client";

import {
  useEffect,
  useId,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

/**
 * 확인 모달(디자인 L938-950).
 *
 * 이 저장소의 첫 모달이다. 의존성이 next · react · react-dom 뿐이라
 * 포커스 트랩 라이브러리를 쓸 수 없어 **네이티브 `<dialog>` + `showModal()`** 을 쓴다.
 * 브라우저가 보장해 주는 것 — 포커스가 모달 밖으로 나가지 않음, Tab·Shift+Tab 순환,
 * Esc 로 닫힘, 닫을 때 트리거로 포커스 복귀, top layer 렌더(카드의 `overflow-hidden`
 * 과 헤더의 `z-[5]` 에 걸리지 않는다). 손으로 짠 트랩보다 안전하고 어긋날 여지가 없다.
 *
 * 직접 붙이는 건 「바깥 클릭으로 닫기」와 배경 스크롤 잠금 둘뿐이다.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  confirmClassName = "bg-primary text-on-primary",
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  /** 확인 버튼 색. 로그아웃은 primary(디자인 L945). */
  confirmClassName?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  /** 패널 안에서 드래그를 시작해 바깥에서 손을 뗀 경우를 바깥 클릭으로 세지 않는다. */
  const pressedOutside = useRef(false);

  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!open) {
      // 취소·확인으로 닫는 경로. Esc 로 이미 닫혔으면 아무 일도 하지 않는다.
      if (dialog.open) dialog.close();
      return;
    }

    if (!dialog.open) {
      dialog.showModal();
      // 파괴적이지 않은 쪽(취소)에 먼저 포커스를 둔다.
      cancelRef.current?.focus();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function handlePointerDown(event: ReactPointerEvent<HTMLDialogElement>) {
    pressedOutside.current = !panelRef.current?.contains(event.target as Node);
  }

  function handleClick(event: ReactMouseEvent<HTMLDialogElement>) {
    const releasedOutside = !panelRef.current?.contains(event.target as Node);
    if (releasedOutside && pressedOutside.current) onClose();
    pressedOutside.current = false;
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      // Esc 로 닫힐 때도 부모의 열림 상태를 되돌린다.
      onClose={onClose}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      // preflight 가 `*, ::backdrop` 의 margin·padding 을 지워서 UA 의 `margin:auto` 가
      // 사라진다. 크기와 배경을 직접 준다(UA 기본 배경은 `Canvas` 라 투명이 아니다).
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-transparent"
    >
      {/* 디자인의 딤은 390px 앱 컬럼 안쪽만 덮는다(L939). 딤을 컬럼 폭에 맞춘다. */}
      <div className="flex h-full justify-center">
        <div className="flex w-full max-w-(--app-max-width) items-center justify-center bg-foreground/32 p-7">
          <div
            ref={panelRef}
            className="w-full rounded-3xl bg-surface px-[22px] py-6 shadow-modal"
          >
            <p
              id={titleId}
              className="mb-2 text-title font-extrabold text-foreground"
            >
              {title}
            </p>
            <p
              id={descriptionId}
              className="mb-5 text-content leading-[1.6] font-medium text-subtle"
            >
              {description}
            </p>
            <div className="flex gap-2.5">
              <button
                ref={cancelRef}
                type="button"
                onClick={onClose}
                className="h-13 flex-1 rounded-lg bg-surface-muted text-base font-extrabold text-foreground"
              >
                취소
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`h-13 flex-1 rounded-lg text-base font-extrabold ${confirmClassName}`}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
