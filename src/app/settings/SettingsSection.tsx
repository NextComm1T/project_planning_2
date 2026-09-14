import type { ReactNode } from "react";

/**
 * 섹션 하나 = 회색 라벨 + 흰 카드(디자인 L384 · L403 · L423).
 *
 * 라벨 여백은 디자인이 첫 섹션만 `0 0 10px 4px`, 나머지는 `26px 0 10px 4px` 다.
 * `first:mt-0` 로 첫 섹션만 위 여백을 뗀다.
 */
export function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-[26px] first:mt-0">
      <h2 className="mb-2.5 ml-1 text-button font-bold text-muted">{title}</h2>
      {children}
    </section>
  );
}

/**
 * 줄을 담는 흰 카드(디자인 L385).
 *
 * preflight 가 `list-style` 을 지워서 Safari·VoiceOver 가 목록으로 읽지 않는다.
 * `role="list"` 로 되살린다.
 */
export function SettingsCard({
  children,
  busy = false,
}: {
  children: ReactNode;
  busy?: boolean;
}) {
  return (
    <ul
      role="list"
      aria-busy={busy || undefined}
      className="overflow-hidden rounded-2xl border-[1.5px] border-border bg-surface shadow-card"
    >
      {children}
    </ul>
  );
}
