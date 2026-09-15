import { MOCK_RANK } from "./mock";

/**
 * 내 탄천 순위 카드(디자인 L755-770).
 *
 * 지도 카드와 한 덩어리로 이어져서 위 모서리를 둥글리지 않는다.
 * 순위와 누적 거리는 탄천 Ranking Zone 안에서 달린 것만 센다(R11 · F1).
 */
export function MyRankCard() {
  const { position, total, tancheonDistanceKm } = MOCK_RANK;

  return (
    <section className="flex shrink-0 items-stretch justify-between gap-4 rounded-b-2xl border-[1.5px] border-border bg-surface px-5 py-3.5 shadow-card">
      <div>
        <h2 className="mb-1.5 text-label font-bold text-muted">내 탄천 순위</h2>
        <p className="flex items-baseline gap-1.5">
          <span className="text-[46px] leading-none font-extrabold tracking-[-2px] text-primary">
            {position}위
          </span>
          <span className="text-content font-semibold text-muted">/ {total}명</span>
        </p>
      </div>

      <div className="flex flex-col justify-between text-right">
        <h2 className="mb-1.5 text-label font-bold text-muted">탄천 누적</h2>
        <p className="flex items-baseline justify-end gap-[3px]">
          <span className="text-metric leading-none font-extrabold tracking-[-1px]">
            {tancheonDistanceKm.toFixed(1)}
          </span>
          <span className="text-label font-semibold text-muted">km</span>
        </p>
      </div>
    </section>
  );
}
