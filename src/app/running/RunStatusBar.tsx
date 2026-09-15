import { formatElapsed } from "./mock";

/**
 * 러닝 진행 화면 상단 — 대형 러닝 시간 + GPS · 구역 배지(디자인 L209-227).
 *
 * 공용 `Header` 를 쓰지 않는다. 정본 상단이 sticky 헤더가 아니라 달리면서 읽는
 * 전용 구조이기 때문이다(이슈 #40 결정 이력 2026-09-14).
 *
 * **순위는 여기에도 어디에도 나오지 않는다** — 러닝 중에는 보여 주지 않는다 · R6.
 */

type RunStatusBarProps = {
  elapsedSec: number;
  gpsLost: boolean;
  inZone: boolean;
};

/** 배지 하나. 점 색만 다르고 모양은 전부 같다(디자인 L214-225). */
function StatusBadge({
  dotClassName,
  className,
  pulse = false,
  children,
}: {
  dotClassName: string;
  className: string;
  pulse?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-label font-bold ${className}`}
    >
      <span
        className={`size-[7px] rounded-full ${dotClassName} ${pulse ? "animate-pulse" : ""}`}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

export function RunStatusBar({ elapsedSec, gpsLost, inZone }: RunStatusBarProps) {
  return (
    <div className="flex shrink-0 items-start justify-between px-5 pt-1 pb-3">
      <p className="text-[64px] leading-none font-extrabold tracking-[-2px] text-foreground">
        {formatElapsed(elapsedSec)}
      </p>

      <div className="mt-2 flex flex-col items-end gap-1.5">
        {gpsLost ? (
          // 신호를 잃은 동안에는 구역 배지를 숨긴다 — 구역 판정이 성립하지 않는다.
          <StatusBadge
            dotClassName="bg-warning-dot"
            className="bg-warning-soft text-warning"
          >
            GPS 신호 약함
          </StatusBadge>
        ) : (
          <>
            <StatusBadge
              dotClassName="bg-success-dot"
              className="bg-success-soft text-success"
              pulse
            >
              GPS 정상
            </StatusBadge>
            {inZone ? (
              <StatusBadge
                dotClassName="bg-primary"
                className="bg-primary-soft text-primary-strong"
              >
                구역 내
              </StatusBadge>
            ) : (
              <StatusBadge
                dotClassName="bg-disabled"
                className="bg-surface-muted text-muted"
              >
                구역 밖
              </StatusBadge>
            )}
          </>
        )}
      </div>
    </div>
  );
}
