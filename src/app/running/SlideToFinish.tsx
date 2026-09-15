"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * "밀어서 러닝 종료" 슬라이드 컨트롤(디자인 L288-295 · 핸들러 L1028-1046).
 *
 * 이 화면에서 나가는 유일한 길이다 — 하단 탭바가 없다(`docs/07-screens.md:56`).
 *
 * 끝까지 밀면 결과 화면으로 **`replace`** 한다. 완료된 러닝 화면으로 뒤로 가기가
 * 돌아가지 않게 하는 정상 흐름 통합 정책이다(이슈 #40 · #41 결정 이력).
 */

/**
 * 결과 화면(#41)의 mock session id `"2"` — 랭킹 반영 · 개인 최고 기록 아님.
 * 정본 `handleStop`(L1155-1167)이 인정 거리가 있는 보통 러닝을 이렇게 분류한다 · `modify/` 6번.
 */
const RESULT_HREF = "/result/2";

/** 트랙 안에서 핸들이 갖는 여백과 크기(디자인 L291-292). */
const KNOB_INSET = 6;
const KNOB_SIZE = 63;
/** 이만큼 밀면 끝까지 민 것으로 본다(원본 L1041). */
const FINISH_RATIO = 0.82;
/** 라벨이 완전히 사라지는 거리(원본 L1338). */
const LABEL_FADE_DISTANCE = 140;

export function SlideToFinish() {
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  // 포인터 이동 중에는 최신 값을 즉시 읽어야 해서 state 와 함께 ref 로도 들고 있는다.
  const offsetRef = useRef(0);
  const detachRef = useRef<(() => void) | null>(null);

  // 미는 도중에 화면이 바뀌어도 window 리스너가 남지 않게 한다.
  useEffect(() => () => detachRef.current?.(), []);

  function moveKnob(next: number) {
    offsetRef.current = next;
    setOffset(next);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    const track = trackRef.current;
    if (!track) return;

    const max = Math.max(0, track.clientWidth - KNOB_INSET * 2 - KNOB_SIZE);
    const startX = event.clientX;
    const startOffset = offsetRef.current;

    function detach() {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      detachRef.current = null;
    }

    function handleMove(moveEvent: PointerEvent) {
      setDragging(true);
      moveKnob(
        Math.max(0, Math.min(max, startOffset + moveEvent.clientX - startX)),
      );
    }

    function handleUp() {
      detach();
      setDragging(false);

      if (offsetRef.current >= max * FINISH_RATIO) {
        moveKnob(max);
        router.replace(RESULT_HREF);
        return;
      }

      // 덜 밀었으면 제자리로 돌아간다.
      moveKnob(0);
    }

    detachRef.current = detach;
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }

  return (
    <div className="shrink-0 px-4 pt-2 pb-[22px]">
      <div
        ref={trackRef}
        className="relative h-[75px] touch-none overflow-hidden rounded-full bg-danger shadow-danger select-none"
      >
        <span
          className="absolute inset-0 flex items-center justify-center pl-10 text-metric font-extrabold tracking-[-0.6px] text-on-primary"
          style={{ opacity: Math.max(0, 1 - offset / LABEL_FADE_DISTANCE) }}
        >
          밀어서 러닝 종료
        </span>

        <button
          type="button"
          aria-label="밀어서 러닝 종료"
          onPointerDown={handlePointerDown}
          className="absolute top-1.5 left-1.5 flex size-[63px] cursor-grab items-center justify-center rounded-full bg-surface text-danger shadow-raised"
          style={{
            transform: `translateX(${offset}px)`,
            transition: dragging ? "none" : "transform .22s ease",
          }}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
