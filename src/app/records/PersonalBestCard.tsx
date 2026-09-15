import { formatBestDuration, formatDistance, formatPace } from "./format";
import type { PersonalBest } from "./mock";

type BestItemProps = {
  label: string;
  value: string;
  unit: string;
  /** 가운데 칸만 좌우에 구분선이 있다. */
  divided?: boolean;
};

function BestItem({ label, value, unit, divided = false }: BestItemProps) {
  return (
    <div className="relative min-w-0 px-2.5 py-[18px] text-center">
      {divided ? (
        // 원본(L866)은 배경 그라데이션으로 위아래 14px 를 띄운 1px 선을 그린다.
        <>
          <span
            aria-hidden="true"
            className="absolute top-3.5 bottom-3.5 left-0 w-px bg-surface-muted"
          />
          <span
            aria-hidden="true"
            className="absolute top-3.5 right-0 bottom-3.5 w-px bg-surface-muted"
          />
        </>
      ) : null}
      <dt className="mb-2.5 text-[11.5px] font-bold text-muted">{label}</dt>
      <dd className="text-[23px] leading-none font-extrabold text-primary">
        {value}
      </dd>
      <dd className="mt-1.5 text-[11.5px] font-semibold text-muted">{unit}</dd>
    </div>
  );
}

/**
 * 개인 최고 기록 카드(디자인 L860-876).
 *
 * 값은 계산하지 않고 받은 그대로 형식만 바꾼다 — 갱신·보관은 F6 의 몫이다(`mock.ts` 의 `PersonalBest`).
 */
export function PersonalBestCard({ best }: { best: PersonalBest }) {
  return (
    <dl className="grid grid-cols-3 overflow-hidden rounded-xl border-[1.5px] border-border bg-surface shadow-button-soft">
      <BestItem
        label="최장 거리"
        value={formatDistance(best.longestDistanceKm)}
        unit="km"
      />
      <BestItem
        label="최대 시간"
        value={formatBestDuration(best.longestDurationSec)}
        unit="시:분:초"
        divided
      />
      <BestItem
        label="최고 페이스"
        value={formatPace(best.bestPaceSecPerKm)}
        unit="/km"
      />
    </dl>
  );
}
