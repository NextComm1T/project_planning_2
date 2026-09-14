import type { ReactNode } from "react";

/**
 * 안내 카드 하나(디자인 L454 · L458 · L462 · L466).
 * 회색 소제목 + 본문. 네 장이 같은 모양이라 여기서 한 번만 그린다.
 */
export function InfoCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border-[1.5px] border-border bg-surface px-5 py-[18px] shadow-card">
      <h2 className="mb-2.5 text-note font-bold text-muted">{title}</h2>
      {children}
    </section>
  );
}

/** 문단 본문(디자인 L461 · L465 — `15/500 line-height 1.65`). */
export function InfoParagraph({ children }: { children: string }) {
  return (
    <p className="text-content leading-[1.65] font-medium text-foreground">
      {children}
    </p>
  );
}

/**
 * 가운뎃점으로 시작하는 목록(디자인 L453 · L457 — `15/500 line-height 1.9`).
 *
 * 디자인은 `<br>` 로 줄을 나누지만 실제로 목록이라 `<ul>` 로 그린다.
 * 가운뎃점은 목록 표시라서 스크린리더에서 뺀다.
 */
export function DotList({ items }: { items: readonly string[] }) {
  return (
    <ul role="list" className="text-content font-medium text-foreground">
      {items.map((item) => (
        <li key={item} className="flex gap-1 leading-[1.9]">
          <span aria-hidden="true">·</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
