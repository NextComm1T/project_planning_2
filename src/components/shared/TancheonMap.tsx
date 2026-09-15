/**
 * 탄천 지도 — 러닝 진행 · 결과 · 기록 상세 · 홈 달리기 탭 네 화면이 함께 쓴다.
 *
 * 디자인 원본은 `TancheonMapBrand.dc.html` 이고, 화면에서의 크기 · 배치 기준은
 * `탄천런.dc.html`(L230 · L316 · L642 · L719)이다.
 *
 * ## 네 화면이 각각 어떻게 쓰나
 *
 * | 화면 | 정본 | 호출 |
 * | --- | --- | --- |
 * | 러닝 진행 | L230 | `<TancheonMap route={segs} endMarker={gpsLost ? "gps-lost" : "running"} viewBox={zoomViewBox} />` |
 * | 결과 | L316 | `<TancheonMap route={segs} />` |
 * | 기록 상세 | L642 | `<TancheonMap route={segs} />` |
 * | 홈 달리기 탭 | L719 | `<TancheonMap userPin={{ x: 155, y: 112 }} viewBox={zoomViewBox} />` |
 *
 * ## 이 컴포넌트가 그리지 않는 것
 *
 * 확대 · 축소 · 재중심 버튼, 범례, GPS 경고 카드, GPS 확인 중 딤은 디자인에서
 * 지도 바깥의 형제 요소다(L231-261 · L720-743). **각 화면이 그린다.**
 * 확대 값 · 단계 계산도 화면 몫이라 여기서 helper 를 내보내지 않는다.
 *
 * 원본의 `progress`(경로를 시간에 따라 조금씩 드러내는 디자인 캔버스용 데모 장치)도
 * 옮기지 않았다. **넘겨받은 경로가 곧 지금까지의 경로다.**
 *
 * 속도 초과 구간(P9)을 위한 props 도 없다 — `docs/05-policy.md:22` 가 "일반 러닝
 * 구간과 같은 스타일로 그대로 그린다"고 정했으므로, 호출자가 그 지점의 `inZone` 만
 * 정해 주면 충족된다. `overSpeed` 같은 props 를 더하지 않는다.
 *
 * ## 크기 상자는 화면이 소유한다
 *
 * `size-full` 이라 **부모가 크기를 정해야 한다.** 정본 네 곳 모두 이미 그렇다 —
 * `position:absolute;inset:0`(L229 · L718) · `height:172px`(L315) ·
 * `flex:1;min-height:0`(L641). `className` props 를 뚫지 않는다.
 *
 * `preserveAspectRatio="xMidYMid slice"` 는 상자 비율에 맞춰 **잘라낸다**. 결과 화면
 * 카드는 350×172(2.03)인데 좌표계는 340×220(1.55)이라 위아래가 잘린다 — 디자인
 * 의도지만, 경로 일부가 화면 밖으로 나갈 수 있다는 뜻이기도 하다.
 *
 * ## `"use client"` 를 붙이지 않는다
 *
 * 서버 전용이라는 뜻이 아니라 **환경 중립**이라는 뜻이다. 러닝 진행 화면은 클라이언트
 * 컴포넌트라 거기서는 클라이언트로 돈다. 점이 십여 개뿐이라 `useMemo` 가 필요 없고,
 * 그걸 넣겠다고 이 파일에 `"use client"` 를 붙이면 네 화면 전부가 클라이언트가 된다.
 */

/**
 * 지도 좌표계. 원본 SVG 의 고정 크기다(`TancheonMapBrand.dc.html:12`).
 *
 * 경로 좌표도 이 좌표계의 값이고, 화면이 확대 `viewBox` 를 계산할 때의 기준도 이것이다.
 * 확대 계산 자체는 각 화면이 가진다 — 여기서 내보내는 것은 좌표계 두 숫자뿐이다.
 */
export const MAP_WIDTH = 340;
export const MAP_HEIGHT = 220;

/** 지도 좌표계(`MAP_WIDTH`×`MAP_HEIGHT`) 위의 한 점. */
export type MapPoint = { x: number; y: number };

/**
 * 경로의 한 측정 지점.
 *
 * `inZone` 은 원본 `z` 와 같은 의미다 — 탄천 Ranking Zone 내부 여부이고,
 * 이 컴포넌트에게는 "탄천 인정 구간 스타일로 그릴지"이기도 하다.
 */
export type RoutePoint = MapPoint & { inZone: boolean };

/**
 * GPS 가 끊기지 않고 이어진 한 구간.
 *
 * 구간과 구간 **사이는 선을 잇지 않는다** — 거기가 신호를 잃은 자리다.
 * 끊긴 구간을 임의의 직선으로 연결하거나 보간하지 않는다(P2 · `docs/05-policy.md:15`).
 */
export type RouteSegment = readonly RoutePoint[];

type TancheonMapProps = {
  /** 연속 구간 배열. 없으면 경로를 그리지 않는다. */
  route?: readonly RouteSegment[];
  /**
   * 경로 끝점에 무엇을 찍을지.
   *
   * - `finished` (기본) — 종료된 경로의 끝점. **끝점이 Zone 안이면 파랑, 밖이면 회색**이다(원본 L106)
   * - `running` — 달리는 중 현재 위치. 헤일로 + 파랑
   * - `gps-lost` — 달리는 중이지만 신호를 잃음. 헤일로 없이 유실 색 + "위치 확인 중…"
   *
   * `finished` 만 끝점의 `inZone` 에 따라 색이 갈리고, `running` · `gps-lost` 는 갈리지
   * 않는다(원본 L105). 비대칭이지만 디자인 그대로다.
   */
  endMarker?: "finished" | "running" | "gps-lost";
  /**
   * 경로 없이 내 위치만 찍을 때(홈 달리기 탭).
   *
   * `route` 와 독립으로 그린다. 디자인에서 둘을 함께 쓰는 화면은 없다 —
   * 둘 다 넘기면 현재 위치 마커가 겹쳐 보인다.
   */
  userPin?: MapPoint;
  /** 기본은 좌표계 전체. 확대한 `viewBox` 는 화면이 계산해서 넘긴다. */
  viewBox?: string;
  /** 스크린리더가 읽을 이름. */
  label?: string;
};

const DEFAULT_VIEW_BOX = `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`;

/** 색이 같은 한 줄. `RouteSegment`(신호가 이어진 구간)와는 다른 개념이다. */
type ZoneLine = { points: RoutePoint[]; inZone: boolean };

/**
 * Zone 안 · 밖 선의 생김새(원본 L89-91).
 *
 * 클래스명을 문자열로 조립하면 Tailwind 스캐너가 보지 못해 유틸이 생성되지 않는다.
 * 완성된 리터럴로만 둔다. 두께 · 투명도는 색이 아니라 기하라 SVG 속성으로 남긴다.
 */
const ZONE_LINE = {
  in: { className: "stroke-primary", width: 4, opacity: 1 },
  out: { className: "stroke-route-out", width: 2.8, opacity: 0.7 },
} as const;

/**
 * 한 구간을 Zone 안 · 밖으로 쪼갠다(원본 `renderVals()` L77-86 과 같은 동작).
 *
 * `inZone` 이 바뀌는 점은 **앞뒤 선이 함께 갖는다** — 그래야 색이 그 점에서 정확히
 * 갈린다(R11 · `docs/03-requirements.md:24`). 경계점 자체를 만들어 넣는 계산은
 * 이 컴포넌트 밖에서 한다.
 *
 * 구간을 가로질러 부르지 않는다. 그래야 끊긴 자리에 선이 생기지 않는다(P2).
 */
function splitByZone(segment: RouteSegment): ZoneLine[] {
  const lines: ZoneLine[] = [];
  if (segment.length < 2) return lines;

  let current: ZoneLine = { points: [segment[0]], inZone: segment[0].inZone };
  for (let i = 1; i < segment.length; i++) {
    const point = segment[i];
    current.points.push(point);
    if (point.inZone !== current.inZone) {
      lines.push(current);
      current = { points: [point], inZone: point.inZone };
    }
  }
  // 마지막 점에서 Zone 이 바뀌면 점 하나짜리가 남는다. 선이 되지 않으므로 버린다.
  if (current.points.length > 1) lines.push(current);

  return lines;
}

function toPointsAttr(points: readonly RoutePoint[]): string {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}

/**
 * 현재 위치 마커. 달리는 중 현재 위치와 홈의 내 위치 핀이 같은 글리프다
 * (원본 L46·L48 ≡ L57·L58).
 */
function PositionMarker({ x, y, lost = false }: MapPoint & { lost?: boolean }) {
  return (
    <>
      {/* 신호를 잃으면 헤일로를 빼서 "지금 잡고 있는 위치가 아니다"를 드러낸다(원본 L107). */}
      {lost ? null : (
        <circle cx={x} cy={y} r={13} className="fill-primary" fillOpacity={0.15} />
      )}
      <circle
        cx={x}
        cy={y}
        r={6}
        className={lost ? "fill-gps-lost stroke-surface" : "fill-primary stroke-surface"}
        strokeWidth={2.5}
      />
      {lost ? (
        <text
          x={x}
          y={y - 15}
          fontSize={8}
          fontWeight={600}
          textAnchor="middle"
          className="fill-muted"
        >
          위치 확인 중…
        </text>
      ) : null}
    </>
  );
}

/** 지도 바탕 — 블록 · 도로 · 공원 · 하천 · Ranking Zone. 겹치는 순서가 곧 디자인이다. */
function MapBase() {
  return (
    <>
      <rect width={MAP_WIDTH} height={MAP_HEIGHT} className="fill-map-base" />

      {/* 건물 블록 (원본 L13-22) */}
      <rect x={6} y={6} width={84} height={26} rx={4} className="fill-map-block" />
      <rect x={6} y={44} width={68} height={42} rx={4} className="fill-map-block" />
      <rect x={6} y={100} width={76} height={36} rx={4} className="fill-map-block" />
      <rect x={6} y={152} width={60} height={42} rx={4} className="fill-map-block" />
      <rect x={6} y={204} width={84} height={14} rx={4} className="fill-map-block" />
      <rect x={218} y={6} width={116} height={32} rx={4} className="fill-map-block" />
      <rect x={222} y={54} width={112} height={44} rx={4} className="fill-map-block" />
      <rect x={214} y={112} width={120} height={40} rx={4} className="fill-map-block" />
      <rect x={220} y={166} width={114} height={30} rx={4} className="fill-map-block" />
      <rect x={220} y={204} width={114} height={14} rx={4} className="fill-map-block" />

      {/* 도로 (원본 L23-28) */}
      <rect x={96} y={0} width={8} height={MAP_HEIGHT} className="fill-map-road" />
      <rect x={208} y={0} width={7} height={MAP_HEIGHT} className="fill-map-road" />
      <rect x={0} y={38} width={MAP_WIDTH} height={4} className="fill-map-road" />
      <rect x={0} y={96} width={MAP_WIDTH} height={4} className="fill-map-road" />
      <rect x={0} y={152} width={MAP_WIDTH} height={4} className="fill-map-road" />
      <rect x={0} y={200} width={MAP_WIDTH} height={4} className="fill-map-road" />

      {/* 공원 (원본 L29-30) */}
      <rect x={112} y={0} width={24} height={MAP_HEIGHT} className="fill-map-park" opacity={0.85} />
      <rect x={186} y={0} width={22} height={MAP_HEIGHT} className="fill-map-park" opacity={0.85} />

      {/* 하천 (원본 L31-33) */}
      <path
        d="M 136 0 C 133 55 148 105 140 156 C 135 176 142 192 139 220 L 188 220 C 186 192 191 176 187 156 C 180 105 196 55 193 0 Z"
        className="fill-map-water"
      />
      <path
        d="M 149 0 C 146 55 160 105 153 156 C 149 176 155 192 152 220"
        fill="none"
        className="stroke-map-water-edge"
        strokeWidth={2.5}
        opacity={0.6}
      />
      <text
        x={163}
        y={32}
        fontSize={11}
        fontWeight={700}
        textAnchor="middle"
        className="fill-map-label"
      >
        탄천
      </text>

      {/* 탄천 Ranking Zone (원본 L34-37) */}
      <path
        d="M 96 0 C 93 55 108 105 100 156 C 95 176 102 192 99 220 L 229 220 C 226 192 233 176 229 156 C 222 105 237 55 234 0 Z"
        className="fill-primary"
        fillOpacity={0.09}
      />
      <path
        d="M 96 0 C 93 55 108 105 100 156 C 95 176 102 192 99 220"
        fill="none"
        className="stroke-primary"
        strokeWidth={1.6}
        strokeOpacity={0.45}
        strokeDasharray="7 4"
      />
      <path
        d="M 234 0 C 237 55 222 105 229 156 C 233 176 226 192 229 220"
        fill="none"
        className="stroke-primary"
        strokeWidth={1.6}
        strokeOpacity={0.45}
        strokeDasharray="7 4"
      />
      <text
        x={163}
        y={14}
        fontSize={8}
        fontWeight={700}
        textAnchor="middle"
        className="fill-primary"
        opacity={0.8}
      >
        Ranking Zone
      </text>
    </>
  );
}

export function TancheonMap({
  route,
  endMarker = "finished",
  userPin,
  viewBox = DEFAULT_VIEW_BOX,
  label = "탄천 지도",
}: TancheonMapProps) {
  const segments = route ?? [];

  // 마커 위치는 전체 점 목록에서 뽑는다. 빈 구간(`[[]]`)이 섞여도 터지지 않아야 한다.
  const points = segments.flat();
  const start = points.length > 0 ? points[0] : null;
  const end = points.length > 0 ? points[points.length - 1] : null;

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      className="size-full"
      role="img"
      aria-label={label}
    >
      <MapBase />

      {segments.map((segment, segmentIndex) =>
        splitByZone(segment).map((line, lineIndex) => {
          const style = line.inZone ? ZONE_LINE.in : ZONE_LINE.out;
          return (
            <polyline
              key={`${segmentIndex}-${lineIndex}`}
              points={toPointsAttr(line.points)}
              fill="none"
              className={style.className}
              strokeWidth={style.width}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={style.opacity}
            />
          );
        }),
      )}

      {/* 시작점 (원본 L42). 끝 마커보다 먼저 그려야 한 점짜리 경로에서 위아래가 맞는다. */}
      {start ? (
        <circle
          cx={start.x}
          cy={start.y}
          r={4.5}
          className="fill-surface stroke-route-out"
          strokeWidth={2}
        />
      ) : null}

      {end && endMarker === "finished" ? (
        <circle
          cx={end.x}
          cy={end.y}
          r={5.5}
          className={end.inZone ? "fill-primary stroke-surface" : "fill-route-out stroke-surface"}
          strokeWidth={2}
        />
      ) : null}

      {end && endMarker !== "finished" ? (
        <PositionMarker x={end.x} y={end.y} lost={endMarker === "gps-lost"} />
      ) : null}

      {userPin ? <PositionMarker x={userPin.x} y={userPin.y} /> : null}
    </svg>
  );
}
