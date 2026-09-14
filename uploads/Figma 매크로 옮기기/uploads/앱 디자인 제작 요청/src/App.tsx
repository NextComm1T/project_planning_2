import { useState, useEffect, useCallback } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────
type Screen = 'login' | 'nickname' | 'home' | 'countdown' | 'running' | 'result'
type Tab = 'run' | 'ranking' | 'records'
type SettingsScreen = 'settings' | 'nickname-edit' | null

interface RunResult {
  totalDist: number
  tancheonDist: number
  runTime: number
  paceStr: string
  date: string
  rank: number
  isPR: boolean
}

// ─── Static Data ──────────────────────────────────────────────────────────────
const RANKINGS: Array<{ rank: number; name: string; distance: number; isMe?: boolean }> = [
  { rank: 1, name: '달리는공룡', distance: 127.3 },
  { rank: 2, name: '탄천마라토너', distance: 98.5 },
  { rank: 3, name: '새벽러너김', distance: 87.2 },
  { rank: 4, name: '성남러닝크루', distance: 74.8 },
  { rank: 5, name: '뚝심주자', distance: 61.0, isMe: true },
  { rank: 6, name: '탄천의별', distance: 54.3 },
  { rank: 7, name: '동네한바퀴', distance: 48.7 },
  { rank: 8, name: '매일조금씩', distance: 42.1 },
  { rank: 9, name: '바람같이', distance: 38.4 },
  { rank: 10, name: '오늘도달려', distance: 31.2 },
  { rank: 11, name: '꾸준함이최고', distance: 28.9 },
  { rank: 12, name: '느려도멀리', distance: 22.4 },
  { rank: 13, name: '탄천초보러너', distance: 18.1 },
  { rank: 14, name: '즐기는러너', distance: 12.7 },
]

interface HistRecord {
  date: string
  totalDist: number
  tancheonDist: number
  time: number
  pace: number
  // route variant index for demo variety
  routeVariant?: number
}

const HISTORY: HistRecord[] = [
  { date: '2026. 09. 09', totalDist: 8.2, tancheonDist: 5.1, time: 2538, pace: 308, routeVariant: 0 },
  { date: '2026. 09. 07', totalDist: 6.5, tancheonDist: 4.2, time: 2010, pace: 309, routeVariant: 1 },
  { date: '2026. 09. 05', totalDist: 10.1, tancheonDist: 7.3, time: 3142, pace: 311, routeVariant: 0 },
  { date: '2026. 09. 02', totalDist: 5.0, tancheonDist: 0.0, time: 1542, pace: 308, routeVariant: 2 },
  { date: '2026. 08. 31', totalDist: 7.8, tancheonDist: 5.8, time: 2418, pace: 310, routeVariant: 0 },
  { date: '2026. 08. 28', totalDist: 9.3, tancheonDist: 6.1, time: 2887, pace: 310, routeVariant: 1 },
]

// ─── Map Route Data ───────────────────────────────────────────────────────────
// Waypoints defining the demo running route through the Tancheon zone
// z = true means this point is inside the Ranking Zone
const MAP_ROUTE: Array<{ x: number; y: number; z: boolean }> = [
  { x: 80,  y: 18,  z: false }, // 0  start: neighborhood street (pre-zone)
  { x: 96,  y: 30,  z: false }, // 1
  { x: 113, y: 44,  z: false }, // 2
  { x: 124, y: 58,  z: false }, // 3  approaching zone boundary
  { x: 130, y: 67,  z: true  }, // 4  zone entry
  { x: 136, y: 85,  z: true  }, // 5
  { x: 141, y: 103, z: true  }, // 6
  { x: 145, y: 122, z: true  }, // 7
  { x: 146, y: 140, z: true  }, // 8
  { x: 144, y: 153, z: true  }, // 9  near zone exit
  { x: 147, y: 163, z: false }, // 10 zone exit
  { x: 153, y: 175, z: false }, // 11
  { x: 162, y: 186, z: false }, // 12 end
]

// Variant routes for past records
const MAP_ROUTE_V1: Array<{ x: number; y: number; z: boolean }> = [
  { x: 220, y: 22,  z: false },
  { x: 204, y: 36,  z: false },
  { x: 190, y: 50,  z: false },
  { x: 182, y: 62,  z: false },
  { x: 175, y: 70,  z: true  },
  { x: 168, y: 88,  z: true  },
  { x: 163, y: 106, z: true  },
  { x: 160, y: 125, z: true  },
  { x: 159, y: 143, z: true  },
  { x: 162, y: 158, z: false },
  { x: 168, y: 170, z: false },
  { x: 176, y: 183, z: false },
]

// Variant 2: outside zone only (탄천 외)
const MAP_ROUTE_V2: Array<{ x: number; y: number; z: boolean }> = [
  { x: 260, y: 20,  z: false },
  { x: 265, y: 40,  z: false },
  { x: 268, y: 62,  z: false },
  { x: 270, y: 85,  z: false },
  { x: 268, y: 110, z: false },
  { x: 265, y: 135, z: false },
  { x: 263, y: 160, z: false },
  { x: 262, y: 184, z: false },
]

function getRouteForVariant(v: number) {
  if (v === 1) return MAP_ROUTE_V1
  if (v === 2) return MAP_ROUTE_V2
  return MAP_ROUTE
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtTime(s: number): string {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

function fmtPace(secPerKm: number): string {
  if (secPerKm <= 0) return "--'--\""
  const m = Math.floor(secPerKm / 60)
  const s = secPerKm % 60
  return `${m}'${String(s).padStart(2, '0')}"`
}

// ─── Map SVG ──────────────────────────────────────────────────────────────────
// Reusable SVG map. Width & height are both 100% so it fills any container.
// preserveAspectRatio="xMidYMid slice" crops like CSS object-fit:cover.
function TancheonMapSvg({
  showRoute = false,
  routeProgress = 1,
  showUserPin = true,
  gpsLost = false,
  route = MAP_ROUTE,
  viewBoxStr = '0 0 340 220',
}: {
  showRoute?: boolean
  routeProgress?: number
  showUserPin?: boolean
  gpsLost?: boolean
  route?: Array<{ x: number; y: number; z: boolean }>
  viewBoxStr?: string
}) {
  const totalPts = route.length
  const visibleCount = showRoute
    ? Math.max(1, Math.round(routeProgress * totalPts))
    : 0
  const visible = route.slice(0, visibleCount)
  const currentPos = visible.length > 0 ? visible[visible.length - 1] : null

  type Segment = { points: Array<{ x: number; y: number }>; inZone: boolean }
  const segments: Segment[] = []
  if (visible.length > 1) {
    let seg: Segment = { points: [visible[0]], inZone: visible[0].z }
    for (let i = 1; i < visible.length; i++) {
      const pt = visible[i]
      if (pt.z === seg.inZone) {
        seg.points.push(pt)
      } else {
        seg.points.push(pt)
        segments.push(seg)
        seg = { points: [pt], inZone: pt.z }
      }
    }
    if (seg.points.length > 1) segments.push(seg)
  }

  const previewPin = { x: 155, y: 112 }

  return (
    <svg
      viewBox={viewBoxStr}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{ display: 'block' }}
      aria-label="탄천 지도"
    >
      {/* ── Ground ── */}
      <rect width="340" height="220" fill="#F4F0E8" />

      {/* ── City blocks ── */}
      <rect x="6"   y="6"   width="84" height="26" rx="3" fill="#E9E4D9" />
      <rect x="6"   y="44"  width="68" height="42" rx="3" fill="#E9E4D9" />
      <rect x="6"   y="100" width="76" height="36" rx="3" fill="#E9E4D9" />
      <rect x="6"   y="152" width="60" height="42" rx="3" fill="#E9E4D9" />
      <rect x="6"   y="204" width="84" height="14" rx="3" fill="#E9E4D9" />
      <rect x="218" y="6"   width="116" height="32" rx="3" fill="#E9E4D9" />
      <rect x="222" y="54"  width="112" height="44" rx="3" fill="#E9E4D9" />
      <rect x="214" y="112" width="120" height="40" rx="3" fill="#E9E4D9" />
      <rect x="220" y="166" width="114" height="30" rx="3" fill="#E9E4D9" />
      <rect x="220" y="204" width="114" height="14" rx="3" fill="#E9E4D9" />

      {/* ── Roads ── */}
      <rect x="96"  y="0"  width="8"  height="220" fill="#DDD8CE" />
      <rect x="208" y="0"  width="7"  height="220" fill="#DDD8CE" />
      <rect x="0"   y="38"  width="340" height="4" fill="#DDD8CE" />
      <rect x="0"   y="96"  width="340" height="4" fill="#DDD8CE" />
      <rect x="0"   y="152" width="340" height="4" fill="#DDD8CE" />
      <rect x="0"   y="200" width="340" height="4" fill="#DDD8CE" />

      {/* ── River-bank parks ── */}
      <rect x="112" y="0" width="24" height="220" fill="#D0E5C4" opacity="0.7" />
      <rect x="186" y="0" width="22" height="220" fill="#D0E5C4" opacity="0.7" />

      {/* ── Tancheon river ── */}
      <path
        d="M 136 0
           C 133 55 148 105 140 156
           C 135 176 142 192 139 220
           L 188 220
           C 186 192 191 176 187 156
           C 180 105 196 55 193 0 Z"
        fill="#BDD4EB"
      />
      {/* River highlight */}
      <path
        d="M 149 0 C 146 55 160 105 153 156 C 149 176 155 192 152 220"
        fill="none" stroke="#A6C2DC" strokeWidth="2.5" opacity="0.4"
      />
      {/* River label */}
      <text x="163" y="32" fontSize="10" fill="#5B8DB0"
        fontFamily="system-ui" fontWeight="500" textAnchor="middle" opacity="0.9">
        탄천
      </text>

      {/* ── Ranking Zone — river-following corridor ── */}
      {/* Fill: wide semi-transparent band that follows the Tancheon */}
      <path
        d="M 96 0
           C 93 55 108 105 100 156
           C 95 176 102 192 99 220
           L 229 220
           C 226 192 233 176 229 156
           C 222 105 237 55 234 0 Z"
        fill="#4878F6"
        fillOpacity="0.07"
      />
      {/* Left zone border */}
      <path
        d="M 96 0 C 93 55 108 105 100 156 C 95 176 102 192 99 220"
        fill="none"
        stroke="#4878F6"
        strokeWidth="1.5"
        strokeOpacity="0.5"
        strokeDasharray="7 4"
      />
      {/* Right zone border */}
      <path
        d="M 234 0 C 237 55 222 105 229 156 C 233 176 226 192 229 220"
        fill="none"
        stroke="#4878F6"
        strokeWidth="1.5"
        strokeOpacity="0.5"
        strokeDasharray="7 4"
      />
      {/* Ranking Zone label */}
      <text x="163" y="14" fontSize="7.5" fill="#4878F6"
        fontFamily="system-ui" fontWeight="600" textAnchor="middle" opacity="0.75">
        Ranking Zone
      </text>

      {/* ── Running route ── */}
      {segments.map((seg, i) => (
        <polyline
          key={i}
          points={seg.points.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={seg.inZone ? '#4878F6' : '#9CA3AF'}
          strokeWidth={seg.inZone ? 3.5 : 2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={seg.inZone ? 1 : 0.65}
        />
      ))}

      {/* Route start dot */}
      {showRoute && visible.length > 0 && (
        <circle cx={route[0].x} cy={route[0].y} r="4"
          fill="white" stroke="#9CA3AF" strokeWidth="2" />
      )}

      {/* Current position marker */}
      {showRoute && currentPos && routeProgress < 1 && (
        <>
          {!gpsLost && (
            <circle cx={currentPos.x} cy={currentPos.y} r="12"
              fill="#4878F6" fillOpacity="0.13" />
          )}
          <circle cx={currentPos.x} cy={currentPos.y} r="5.5"
            fill={gpsLost ? '#B0B8C4' : '#4878F6'}
            stroke="white" strokeWidth="2.5" />
          {gpsLost && (
            <text x={currentPos.x} y={currentPos.y - 14}
              fontSize="7.5" fill="#9CA3AF" fontFamily="system-ui"
              textAnchor="middle">위치 확인 중…</text>
          )}
        </>
      )}
      {showRoute && currentPos && routeProgress >= 1 && (
        <circle cx={currentPos.x} cy={currentPos.y} r="5"
          fill={currentPos.z ? '#4878F6' : '#9CA3AF'} stroke="white" strokeWidth="2" />
      )}

      {/* Preview pin (home screen) */}
      {!showRoute && showUserPin && (
        <>
          <circle cx={previewPin.x} cy={previewPin.y} r="12"
            fill="#4878F6" fillOpacity="0.13" />
          <circle cx={previewPin.x} cy={previewPin.y} r="5.5"
            fill="#4878F6" stroke="white" strokeWidth="2.5" />
        </>
      )}
    </svg>
  )
}

// ─── Map Legend ───────────────────────────────────────────────────────────────
function MapLegend() {
  return (
    <div className="flex items-center gap-5 px-1 pt-2.5">
      <div className="flex items-center gap-1.5">
        <div className="w-5 rounded-full bg-primary" style={{ height: 3 }} />
        <span className="text-[11px] text-muted-foreground">탄천 인정 구간</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-5 rounded-full" style={{ height: 3, backgroundColor: '#9CA3AF' }} />
        <span className="text-[11px] text-muted-foreground">일반 러닝 구간</span>
      </div>
    </div>
  )
}

// ─── Location Icon ────────────────────────────────────────────────────────────
function IconLocation() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  )
}

// ─── Map With Controls ────────────────────────────────────────────────────────
// Wrapper that adds zoom +/- and location-reset buttons over the map.
function MapWithControls({
  showRoute = false,
  routeProgress = 1,
  gpsLost = false,
  showUserPin = true,
  route = MAP_ROUTE,
  className = '',
}: {
  showRoute?: boolean
  routeProgress?: number
  gpsLost?: boolean
  showUserPin?: boolean
  route?: Array<{ x: number; y: number; z: boolean }>
  className?: string
}) {
  const [zoom, setZoom] = useState(1)

  // Compute viewBox centered on Tancheon (x≈163, y≈110)
  const cx = 163, cy = 110
  const baseW = 340, baseH = 220
  const w = baseW / zoom
  const h = baseH / zoom
  const vx = Math.max(0, Math.min(baseW - w, cx - w / 2))
  const vy = Math.max(0, Math.min(baseH - h, cy - h / 2))
  const viewBoxStr = `${vx.toFixed(1)} ${vy.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`

  const canZoomIn  = zoom < 2.5
  const canZoomOut = zoom > 1

  const btnBase = 'w-8 h-8 bg-white/90 backdrop-blur border border-border/70 flex items-center justify-center text-foreground active:bg-muted transition-colors shadow-sm'

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <TancheonMapSvg
        showRoute={showRoute}
        routeProgress={routeProgress}
        gpsLost={gpsLost}
        showUserPin={showUserPin}
        route={route}
        viewBoxStr={viewBoxStr}
      />
      {/* Zoom controls */}
      <div className="absolute right-3 top-3 flex flex-col rounded-xl overflow-hidden shadow-sm">
        <button
          onClick={() => setZoom(z => Math.min(2.5, parseFloat((z + 0.5).toFixed(1))))}
          disabled={!canZoomIn}
          className={`${btnBase} rounded-none border-b-0 font-bold text-[18px] ${!canZoomIn ? 'opacity-35' : ''}`}
          style={{ borderRadius: '10px 10px 0 0' }}>
          +
        </button>
        <button
          onClick={() => setZoom(z => Math.max(1, parseFloat((z - 0.5).toFixed(1))))}
          disabled={!canZoomOut}
          className={`${btnBase} rounded-none font-bold text-[18px] ${!canZoomOut ? 'opacity-35' : ''}`}
          style={{ borderRadius: '0 0 10px 10px' }}>
          −
        </button>
      </div>
      {/* Location reset */}
      <button
        onClick={() => setZoom(1)}
        className={`${btnBase} absolute right-3 bottom-3 rounded-xl`}>
        <IconLocation />
      </button>
      {/* Legend overlay — bottom left */}
      <div className="absolute left-3 bottom-3 bg-white/85 backdrop-blur rounded-xl px-2.5 py-2 shadow-sm border border-border/50">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-3 h-3 rounded-full border-2 border-primary bg-primary/20 flex-shrink-0" />
          <span className="text-[10px] text-foreground/80 leading-none">내 위치</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-1.5 rounded-full" style={{ background: 'rgba(72,120,246,0.25)', border: '1px dashed rgba(72,120,246,0.6)' }} />
          <span className="text-[10px] text-foreground/80 leading-none">Ranking Zone</span>
        </div>
      </div>
    </div>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconRun({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13" cy="4.5" r="1.5" fill={active ? 'currentColor' : 'none'} />
      <path d="M7 21l3.5-7.5 3 2.5 2.5-5" />
      <path d="M13 6l-2.5 4 2.5 2.5-1 5" />
      <path d="M15.5 9.5l2.5 1" />
    </svg>
  )
}

function IconTrophy({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H3.5a1 1 0 01-1-1V5h3.5M18 9h2.5a1 1 0 001-1V5H18" />
      <path d="M6 5h12v5a6 6 0 01-12 0V5z" />
      <path d="M12 16v4" /><path d="M8.5 20h7" />
    </svg>
  )
}

function IconBook({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  )
}

function IconWarning() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function IconChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  )
}

function SettingsButton({ onPress }: { onPress: () => void }) {
  return (
    <button onClick={onPress}
      className="w-8 h-8 flex items-center justify-center rounded-xl bg-muted text-muted-foreground active:bg-border transition-colors">
      <IconSettings />
    </button>
  )
}

function IconChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

// ─── Status Bar ───────────────────────────────────────────────────────────────
function StatusBar({ light = false }: { light?: boolean }) {
  const now = new Date()
  const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
  const color = light ? '#ffffff' : '#1A1A2E'

  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 flex-shrink-0"
      style={{ color }}>
      <span className="text-xs font-semibold" style={{ color }}>{timeStr}</span>
      <div className="flex items-center gap-1.5">
        {/* Signal */}
        <svg width="16" height="11" viewBox="0 0 16 11" fill={color}>
          <rect x="0" y="5" width="2.5" height="6" rx="0.5" opacity="0.35" />
          <rect x="3.5" y="3" width="2.5" height="8" rx="0.5" opacity="0.55" />
          <rect x="7" y="1" width="2.5" height="10" rx="0.5" opacity="0.75" />
          <rect x="10.5" y="0" width="2.5" height="11" rx="0.5" />
        </svg>
        {/* WiFi */}
        <svg width="15" height="11" viewBox="0 0 22 16" fill="none" stroke={color} strokeWidth="2"
          strokeLinecap="round">
          <path d="M1 5a14 14 0 0120 0" opacity="0.4" />
          <path d="M4.5 8.5a9 9 0 0113 0" opacity="0.6" />
          <path d="M8 12a5 5 0 016 0" opacity="0.85" />
          <circle cx="11" cy="15" r="1.5" fill={color} stroke="none" />
        </svg>
        {/* Battery */}
        <svg width="24" height="11" viewBox="0 0 24 11" fill="none">
          <rect x="0.5" y="0.5" width="20" height="10" rx="3" stroke={color} strokeOpacity="0.4" />
          <rect x="2" y="2" width="16" height="7" rx="2" fill={color} />
          <path d="M22 3.5v4a2 2 0 000-4z" fill={color} fillOpacity="0.45" />
        </svg>
      </div>
    </div>
  )
}

// ─── LoginScreen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <StatusBar />
      <div className="flex-1 flex flex-col justify-center px-7 pt-4 pb-2">
        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-7">
          <span className="text-3xl">🏃</span>
        </div>
        <h1 className="font-display text-[34px] font-bold text-foreground leading-snug mb-3">
          탄천에서<br />함께 달려요
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          성남 탄천에서 달린 거리로<br />이웃 러너들과 가볍게 경쟁해보세요.
        </p>
      </div>

      <div className="px-6 pb-10 space-y-3">
        <p className="text-xs text-muted-foreground text-center mb-4">간편 로그인으로 시작하기</p>
        <button onClick={onLogin}
          className="w-full h-[52px] rounded-2xl bg-[#FEE500] text-[#3C1E1E] font-semibold flex items-center gap-3 px-5 active:brightness-95 transition-all">
          <span className="text-xl">💬</span>
          <span className="flex-1 text-center text-[15px]">카카오로 시작하기</span>
        </button>
        <button onClick={onLogin}
          className="w-full h-[52px] rounded-2xl bg-card border border-border text-foreground font-semibold flex items-center gap-3 px-5 active:bg-muted transition-all shadow-sm">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="flex-1 text-center text-[15px]">Google로 시작하기</span>
        </button>
      </div>
    </div>
  )
}

// ─── NicknameScreen ───────────────────────────────────────────────────────────
function NicknameScreen({ value, onChange, onConfirm }: {
  value: string; onChange: (v: string) => void; onConfirm: () => void
}) {
  const trimmed = value.trim()
  const isValid = trimmed.length >= 2 && trimmed.length <= 10 && !trimmed.includes(' ')

  return (
    <div className="flex flex-col flex-1 overflow-y-auto px-6">
      <StatusBar />
      <div className="flex-1 flex flex-col justify-center pt-2">
        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-7">
          <span className="text-2xl">✏️</span>
        </div>
        <h2 className="font-display text-[28px] font-bold text-foreground mb-2">닉네임 설정</h2>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          탄천 랭킹에 표시될 이름을 정해주세요.<br />다른 사용자와 중복될 수 없습니다.
        </p>
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <input type="text" value={value} onChange={e => onChange(e.target.value)}
            placeholder="닉네임 입력" maxLength={10} autoFocus
            className="w-full bg-transparent text-xl font-display font-semibold text-foreground placeholder:text-muted-foreground outline-none" />
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">2~10자, 공백 불가</span>
            <span className={`text-xs font-medium ${value.length > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
              {value.length}/10
            </span>
          </div>
        </div>
        {!isValid && value.length >= 2 && value.includes(' ') && (
          <p className="mt-3 text-sm text-accent">공백은 포함할 수 없습니다.</p>
        )}
      </div>
      <div className="pb-10">
        <button onClick={onConfirm} disabled={!isValid}
          className={`w-full h-[52px] rounded-2xl font-semibold text-[15px] transition-all ${
            isValid
              ? 'bg-primary text-primary-foreground active:brightness-95 shadow-sm'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}>
          시작하기
        </button>
      </div>
    </div>
  )
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────
function HomeScreen({ nickname, onStart, onSettings }: { nickname: string; onStart: () => void; onSettings: () => void }) {
  const [gpsReady, setGpsReady] = useState(false)
  const [gpsDots, setGpsDots] = useState(1)

  useEffect(() => {
    const dotsTimer = setInterval(() => setGpsDots(d => (d % 3) + 1), 500)
    const readyTimer = setTimeout(() => { setGpsReady(true); clearInterval(dotsTimer) }, 1800)
    return () => { clearInterval(dotsTimer); clearTimeout(readyTimer) }
  }, [])

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <StatusBar />
      {/* App bar */}
      <div className="px-5 pt-1 pb-2 flex items-center justify-between flex-shrink-0">
        <span className="font-display font-bold text-foreground text-[17px]">탄천 RUN</span>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
            gpsReady ? 'bg-green-50 text-green-700' : 'bg-muted text-muted-foreground'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${gpsReady ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
            {gpsReady ? 'GPS 준비완료' : `GPS 확인 중${'.'.repeat(gpsDots)}`}
          </div>
          <SettingsButton onPress={onSettings} />
        </div>
      </div>

      <div className="px-4 pb-4 flex flex-col gap-3">
        {/* Greeting */}
        <div className="px-1">
          <p className="text-[20px] font-display font-semibold text-foreground leading-snug">
            안녕하세요, {nickname}님 👋
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">오늘도 탄천에서 달려볼까요?</p>
        </div>

        {/* ── Tancheon Zone Map Card ── */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="px-4 pt-3 pb-2 flex items-start justify-between flex-shrink-0">
            <div>
              <p className="text-[15px] font-semibold text-foreground">탄천 Ranking Zone</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                표시된 구역에서 달린 거리만 랭킹에 반영돼요.
              </p>
            </div>
            <span className="flex-shrink-0 ml-2 mt-0.5 text-[10px] font-medium text-primary bg-secondary px-2 py-0.5 rounded-full">
              구역 확인
            </span>
          </div>
          <MapWithControls
            showRoute={false}
            showUserPin={true}
            className="h-[316px]"
          />
        </div>

        {/* My rank card — 세로 약 70% */}
        <div className="bg-card rounded-2xl px-5 py-2.5 shadow-sm border border-border">
          <p className="text-[10px] text-muted-foreground font-medium mb-1">내 탄천 순위</p>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-[44px] font-bold text-primary leading-none">5위</span>
              <span className="text-sm text-muted-foreground">/ 14명</span>
            </div>
            <div className="text-right">
              <p className="font-display text-[24px] font-semibold text-foreground leading-none">61.0</p>
              <p className="text-xs text-muted-foreground mt-0.5">km 탄천 누적</p>
            </div>
          </div>
        </div>

        {/* GPS error */}
        {!gpsReady && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2">
            <span className="text-amber-500 mt-0.5 flex-shrink-0"><IconWarning /></span>
            <p className="text-sm text-amber-800 leading-snug">
              GPS 신호를 확인할 수 없어 러닝을 시작할 수 없습니다
            </p>
          </div>
        )}

        {/* Primary CTA — 세로 약 2배 */}
        <button onClick={onStart} disabled={!gpsReady}
          className={`w-full h-[136px] rounded-2xl font-display font-bold text-[38px] flex items-center justify-center gap-5 transition-all ${
            gpsReady
              ? 'bg-primary text-primary-foreground active:brightness-95 shadow-md'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}>
          <span className="text-[52px] leading-none">🏃</span>
          {gpsReady ? '러닝 시작하기' : 'GPS 확인 중...'}
        </button>
      </div>
    </div>
  )
}

// ─── CountdownScreen ──────────────────────────────────────────────────────────
function CountdownScreen({ count }: { count: number }) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-4">
      <p className="text-sm text-muted-foreground">준비하세요!</p>
      <div className={`font-display font-bold text-primary transition-all duration-300 ${
        count > 0 ? 'text-[128px] leading-none' : 'text-6xl'
      }`}>
        {count > 0 ? count : 'GO!'}
      </div>
      <p className="text-sm text-muted-foreground">
        {count > 0 ? `${count}초 후 시작합니다` : '탄천을 달려요!'}
      </p>
    </div>
  )
}

// ─── RunningScreen ────────────────────────────────────────────────────────────
function RunningScreen({ runTime, totalDist, tancheonDist, inZone, gpsLost: gpsLostProp, onStop }: {
  runTime: number; totalDist: number; tancheonDist: number
  inZone: boolean; gpsLost: boolean; onStop: () => void
}) {
  // Manual GPS lost toggle for prototype testing
  const [manualGpsLost, setManualGpsLost] = useState(false)
  const gpsLost = gpsLostProp || manualGpsLost

  const pace = (!gpsLost && totalDist > 0.05) ? Math.round(runTime / totalDist) : 0
  const routeProgress = Math.min(1, runTime / 85)

  return (
    <div className="flex flex-col h-full">
      <StatusBar />

      {/* ── 1순위: 러닝 시간 + GPS 상태 칩 ── */}
      <div className="px-5 pt-1 pb-3 flex items-start justify-between flex-shrink-0">
        <div>
          <p className="text-xs text-muted-foreground font-medium mb-1">러닝 시간</p>
          <p className="font-display text-[64px] font-bold text-foreground leading-none tracking-tight">
            {fmtTime(runTime)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 mt-2">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
            gpsLost ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              gpsLost ? 'bg-amber-400' : 'bg-green-500 animate-pulse'
            }`} />
            {gpsLost ? 'GPS 신호 약함' : 'GPS 정상'}
          </div>
          {!gpsLost && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
              inZone ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${inZone ? 'bg-primary' : 'bg-muted-foreground'}`} />
              {inZone ? '구역 내' : '구역 밖'}
            </div>
          )}
        </div>
      </div>

      {/* ── GPS warning banner ── */}
      {gpsLost && (
        <div className="mx-4 mb-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex-shrink-0">
          <div className="flex items-start gap-2.5">
            <span className="text-amber-500 flex-shrink-0 mt-0.5"><IconWarning /></span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">GPS 신호가 약합니다</p>
              <p className="text-xs text-amber-700 mt-0.5 leading-snug">
                신호가 복구될 때까지 거리를 측정하지 않습니다.
              </p>
            </div>
          </div>
          <button
            onClick={() => setManualGpsLost(false)}
            className="mt-2.5 w-full h-8 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 text-xs font-semibold active:bg-amber-200 transition-colors">
            GPS 복구 시뮬레이션 →
          </button>
        </div>
      )}

      {/* ── 2순위: 실시간 지도 — flex-1로 남은 공간 모두 사용 ── */}
      <div className="mx-4 flex-1 min-h-0">
        <MapWithControls
          showRoute={true}
          routeProgress={routeProgress}
          gpsLost={gpsLost}
          showUserPin={false}
          route={MAP_ROUTE}
          className="h-full rounded-2xl border border-border shadow-sm overflow-hidden"
        />
      </div>

      {/* ── 3순위: 데이터 Summary Card ── */}
      <div className="mx-4 mt-3 bg-card rounded-2xl shadow-sm border border-border overflow-hidden flex-shrink-0">
        <div className="grid grid-cols-3 divide-x divide-border">
          <div className="px-3 py-4">
            <p className="text-[10px] text-muted-foreground mb-1.5">총 거리</p>
            <p className="font-display text-[26px] font-bold text-foreground leading-none">{totalDist.toFixed(2)}</p>
            <p className="text-[11px] text-muted-foreground mt-1">km</p>
          </div>
          <div className="px-3 py-4">
            <p className="text-[10px] font-medium text-green-600 mb-1.5">탄천 인정</p>
            <p className={`font-display text-[26px] font-bold leading-none transition-colors ${inZone && !gpsLost ? 'text-green-600' : 'text-foreground'}`}>
              {tancheonDist.toFixed(2)}
            </p>
            <p className={`text-[11px] mt-1 ${inZone && !gpsLost ? 'text-green-500' : 'text-muted-foreground'}`}>km</p>
          </div>
          <div className="px-3 py-4">
            <p className="text-[10px] text-muted-foreground mb-1.5">현재 페이스</p>
            <p className="font-display text-[26px] font-bold text-foreground leading-none">
              {pace > 0 ? fmtPace(pace) : "--'--\""}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">/km</p>
          </div>
        </div>
      </div>

      {/* ── 4순위: 종료 버튼 ── */}
      <div className="px-4 pt-2 pb-6 flex-shrink-0">
        {!gpsLost && (
          <button
            onClick={() => setManualGpsLost(true)}
            className="w-full h-7 rounded-xl bg-muted border border-border text-muted-foreground text-xs font-medium active:bg-border transition-colors mb-2">
            GPS 신호 끊기 시뮬레이션
          </button>
        )}
        <button onClick={onStop}
          className="w-full h-[160px] rounded-2xl bg-accent text-accent-foreground font-display font-bold text-[48px] active:brightness-95 transition-all shadow-md tracking-tight">
          러닝 종료
        </button>
      </div>
    </div>
  )
}

// ─── ResultScreen ─────────────────────────────────────────────────────────────
function ResultScreen({ result, onViewRanking, onViewRecords }: {
  result: RunResult; onViewRanking: () => void; onViewRecords: () => void
}) {
  const ranked = result.rank > 0 && result.tancheonDist > 0.05

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <StatusBar />
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">✓ 완료</span>
          {result.isPR && (
            <span className="text-xs font-medium text-primary bg-secondary px-2.5 py-1 rounded-full">개인 최고 기록 🎉</span>
          )}
        </div>
        <h1 className="font-display text-[26px] font-bold text-foreground">{result.date}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">러닝 결과</p>
      </div>

      {/* ── Completed route map ── */}
      <div className="mx-5 bg-card rounded-2xl shadow-sm border border-border overflow-hidden flex-shrink-0">
        <div style={{ height: 178 }}>
          <TancheonMapSvg showRoute={true} routeProgress={1} showUserPin={false} route={MAP_ROUTE} />
        </div>
        <div className="px-4 pb-3">
          <MapLegend />
        </div>
      </div>

      <div className="px-5 space-y-3 pb-8 mt-3">
        {/* Rank */}
        {ranked ? (
          <div className="bg-secondary rounded-2xl p-4 border border-blue-100">
            <p className="text-xs font-medium text-secondary-foreground mb-2">탄천 랭킹 순위</p>
            <div className="flex items-center justify-between">
              <span className="font-display text-[52px] font-bold text-primary leading-none">{result.rank}위</span>
              <div className="text-right">
                <p className="font-display text-[20px] font-semibold text-foreground">{result.tancheonDist.toFixed(2)} km</p>
                <p className="text-xs text-muted-foreground mt-0.5">탄천 인정 거리 반영</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-muted rounded-2xl p-4 border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-1">랭킹 미반영</p>
            <p className="text-sm text-muted-foreground">탄천 구역 밖에서 달린 기록은 랭킹에 반영되지 않습니다.</p>
          </div>
        )}

        {/* Stats grid */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-border">
            {[
              { label: '총 거리', value: `${result.totalDist.toFixed(2)}`, unit: 'km', green: false },
              { label: '탄천 인정', value: `${result.tancheonDist.toFixed(2)}`, unit: 'km', green: true },
              { label: '러닝 시간', value: fmtTime(result.runTime), unit: '', green: false },
              { label: '페이스', value: result.paceStr, unit: '/km', green: false },
            ].map((stat, i) => (
              <div key={stat.label} className={`p-4 ${i < 2 ? 'border-b border-border' : ''}`}>
                <p className="text-xs text-muted-foreground mb-1.5">{stat.label}</p>
                <p className={`font-display text-[22px] font-bold ${stat.green ? 'text-green-600' : 'text-foreground'}`}>
                  {stat.value}
                  {stat.unit && <span className="text-sm font-normal text-muted-foreground ml-1">{stat.unit}</span>}
                </p>
              </div>
            ))}
          </div>
        </div>

        {ranked && (
          <button onClick={onViewRanking}
            className="w-full h-[52px] rounded-2xl bg-primary text-primary-foreground font-semibold text-[15px] active:brightness-95 transition-all shadow-sm">
            탄천 랭킹 보기
          </button>
        )}
        <button onClick={onViewRecords}
          className={`w-full h-[52px] rounded-2xl font-semibold text-[15px] active:bg-muted transition-all ${
            ranked
              ? 'bg-card border border-border text-foreground shadow-sm'
              : 'bg-primary text-primary-foreground shadow-sm'
          }`}>
          내 기록 보기
        </button>
      </div>
    </div>
  )
}

// ─── RankingScreen ────────────────────────────────────────────────────────────
// Accent colors for 1-3 rank numbers only — warm, not gamified
const RANK_ACCENT: Record<number, string> = {
  1: '#B8912A',  // warm gold
  2: '#7E8C99',  // muted silver
  3: '#9E6B4A',  // warm bronze
}

function RankingScreen({ nickname, onSettings }: { nickname: string; onSettings: () => void }) {
  const myEntry = RANKINGS.find(r => r.isMe)
  const displayRankings = RANKINGS.map(r => r.isMe ? { ...r, name: nickname } : r)

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <StatusBar />

      {/* ── Page header ── */}
      <div className="px-5 pt-1 pb-3 flex items-start justify-between flex-shrink-0">
        <div>
          <h1 className="font-display text-[30px] font-bold text-foreground">탄천 랭킹</h1>
          <p className="text-sm text-muted-foreground mt-0.5">누적 거리 기준 · 총 {RANKINGS.length}명</p>
        </div>
        <div className="pt-2">
          <SettingsButton onPress={onSettings} />
        </div>
      </div>

      {/* ── My rank summary card ── */}
      {myEntry && (
        <div className="mx-5 mb-4 bg-secondary border border-blue-100 rounded-2xl px-5 py-4 flex items-center gap-4 flex-shrink-0 shadow-sm">
          <div className="flex flex-col items-center w-10 flex-shrink-0">
            <span className="font-display text-[32px] font-bold text-primary leading-none">{myEntry.rank}</span>
            <span className="text-[10px] font-semibold text-primary/70 mt-0.5">위</span>
          </div>
          <div className="w-px h-10 bg-blue-100 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold text-primary truncate">{nickname}</p>
            <p className="text-xs text-secondary-foreground/70 mt-0.5">내 순위</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-display text-[22px] font-bold text-foreground leading-none">{myEntry.distance}</p>
            <p className="text-xs text-muted-foreground mt-1">km</p>
          </div>
        </div>
      )}

      {/* ── Ranking list — individual rounded cards ── */}
      <div className="px-5 flex-1 pb-4">
        <div className="space-y-2">
          {displayRankings.map((r) => {
            const isTop3   = r.rank <= 3
            const rankColor = RANK_ACCENT[r.rank]
            const isMe     = !!r.isMe

            return (
              <div
                key={r.rank}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl border shadow-sm transition-colors ${
                  isMe
                    ? 'bg-secondary border-blue-100'
                    : 'bg-card border-border'
                }`}
              >
                {/* Rank number */}
                <div className="w-8 flex-shrink-0 text-center">
                  <span
                    className="font-display text-[20px] font-bold leading-none"
                    style={{ color: isTop3 ? rankColor : (isMe ? '#4878F6' : '#6B7280') }}
                  >
                    {r.rank}
                  </span>
                </div>

                {/* Nickname */}
                <div className="flex-1 min-w-0">
                  <p className={`text-[16px] font-bold leading-none truncate ${
                    isMe ? 'text-primary' : 'text-foreground'
                  }`}>
                    {r.name}
                    {isMe && (
                      <span className="ml-2 text-[12px] font-semibold text-primary/60">(나)</span>
                    )}
                  </p>
                </div>

                {/* Distance */}
                <div className="flex-shrink-0 text-right">
                  <span className={`font-display text-[18px] font-bold leading-none ${
                    isMe ? 'text-primary' : 'text-foreground'
                  }`}>
                    {r.distance}
                  </span>
                  <span className="text-[12px] text-muted-foreground font-normal ml-1">km</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── SettingsScreen ───────────────────────────────────────────────────────────
function SettingsScreen({ nickname, onBack, onEditNickname }: {
  nickname: string; onBack: () => void; onEditNickname: () => void
}) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <StatusBar />
      {/* Header */}
      <div className="px-4 pt-1 pb-3 flex items-center gap-3 border-b border-border flex-shrink-0">
        <button onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-muted text-foreground active:bg-border transition-colors">
          <IconChevronLeft />
        </button>
        <h1 className="text-base font-semibold text-foreground font-display">설정</h1>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Section: 내 정보 */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2 px-1">내 정보</p>
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <button onClick={onEditNickname}
              className="w-full flex items-center justify-between px-4 py-4 active:bg-muted transition-colors">
              <div className="text-left">
                <p className="text-xs text-muted-foreground mb-1">닉네임</p>
                <p className="text-[15px] font-medium text-foreground">{nickname}</p>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <span className="text-sm font-medium">수정</span>
                <IconChevronRight />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── NicknameEditScreen ───────────────────────────────────────────────────────
const TAKEN_NICKNAMES = ['달리는공룡', '탄천마라토너', '새벽러너김', '성남러닝크루', '탄천의별', '동네한바퀴', '매일조금씩', '바람같이', '오늘도달려', '꾸준함이최고', '느려도멀리', '탄천초보러너', '즐기는러너']

function NicknameEditScreen({ currentNickname, onBack, onSave }: {
  currentNickname: string; onBack: () => void; onSave: (name: string) => void
}) {
  const [value, setValue] = useState(currentNickname)
  const trimmed = value.trim()

  const isEmpty = trimmed.length === 0
  const hasSpace = trimmed.includes(' ')
  const tooShort = trimmed.length < 2
  const tooLong = trimmed.length > 10
  const isTaken = TAKEN_NICKNAMES.map(n => n.toLowerCase()).includes(trimmed.toLowerCase())
  const unchanged = trimmed === currentNickname

  const isValid = !isEmpty && !hasSpace && !tooShort && !tooLong && !isTaken && !unchanged

  let errorMsg = ''
  if (isEmpty && value.length > 0) errorMsg = '닉네임을 입력해주세요.'
  else if (hasSpace) errorMsg = '공백은 포함할 수 없습니다.'
  else if (tooShort && value.length > 0) errorMsg = '2자 이상 입력해주세요.'
  else if (tooLong) errorMsg = '10자 이하로 입력해주세요.'
  else if (isTaken) errorMsg = '이미 사용 중인 닉네임입니다.'

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <StatusBar />
      {/* Header */}
      <div className="px-4 pt-1 pb-3 flex items-center gap-3 border-b border-border flex-shrink-0">
        <button onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-muted text-foreground active:bg-border transition-colors">
          <IconChevronLeft />
        </button>
        <div>
          <p className="text-[11px] text-muted-foreground leading-none mb-0.5">설정</p>
          <h1 className="text-base font-semibold text-foreground font-display leading-none">닉네임 수정</h1>
        </div>
      </div>

      <div className="flex-1 px-5 py-5">
        {/* Input */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-4">
          <p className="text-xs text-muted-foreground mb-2">닉네임</p>
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            maxLength={10}
            autoFocus
            className="w-full bg-transparent text-[18px] font-display font-semibold text-foreground placeholder:text-muted-foreground outline-none"
            placeholder="닉네임 입력"
          />
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground leading-snug">
              다른 러너들에게 표시되는 이름이에요.
            </p>
            <span className={`text-xs font-medium flex-shrink-0 ml-2 ${value.length > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
              {value.length}/10
            </span>
          </div>
        </div>

        {/* Validation message */}
        {errorMsg ? (
          <p className="mt-2.5 text-sm text-accent px-1">{errorMsg}</p>
        ) : unchanged && trimmed.length >= 2 ? (
          <p className="mt-2.5 text-sm text-muted-foreground px-1">현재 닉네임과 동일합니다.</p>
        ) : null}
      </div>

      {/* Save button pinned to bottom */}
      <div className="px-5 pb-8 flex-shrink-0">
        <button
          onClick={() => { if (isValid) onSave(trimmed) }}
          disabled={!isValid}
          className={`w-full h-[52px] rounded-2xl font-semibold text-[15px] transition-all ${
            isValid
              ? 'bg-primary text-primary-foreground active:brightness-95 shadow-sm'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}>
          저장
        </button>
      </div>
    </div>
  )
}

// ─── RecordDetailScreen ───────────────────────────────────────────────────────
function RecordDetailScreen({ record, onBack }: { record: HistRecord; onBack: () => void }) {
  const route = getRouteForVariant(record.routeVariant ?? 0)
  const hasZone = record.tancheonDist > 0

  return (
    <div className="flex flex-col h-full">
      <StatusBar />
      {/* Nav header */}
      <div className="px-4 pt-1 pb-3 flex items-center gap-3 border-b border-border flex-shrink-0">
        <button onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted text-foreground active:bg-border transition-colors flex-shrink-0">
          <IconChevronLeft />
        </button>
        <div>
          <p className="text-[19px] font-bold text-foreground font-display leading-tight">{record.date}</p>
          <p className="text-xs text-muted-foreground mt-0.5">러닝 기록 상세</p>
        </div>
      </div>

      {/* Route map — flex-1 fills remaining space */}
      <div className="mx-4 mt-3 flex-1 min-h-0 bg-card rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col">
        <div className="flex-1 min-h-0">
          <TancheonMapSvg showRoute={true} routeProgress={1} showUserPin={false} route={route} />
        </div>
        {/* Legend */}
        <div className="px-4 py-3 border-t border-border flex-shrink-0">
          {hasZone ? (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-6 rounded-full bg-primary" style={{ height: 4 }} />
                <span className="text-[12px] font-medium text-foreground/70">탄천 인정 구간</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 rounded-full" style={{ height: 4, backgroundColor: '#9CA3AF' }} />
                <span className="text-[12px] font-medium text-foreground/70">일반 러닝 구간</span>
              </div>
            </div>
          ) : (
            <span className="text-[12px] text-muted-foreground">탄천 구역 외 러닝 — 랭킹 미반영</span>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="mx-4 mt-3 mb-6 bg-card rounded-2xl shadow-sm border border-border overflow-hidden flex-shrink-0">
        <div className="grid grid-cols-2 divide-x divide-border">
          {[
            { label: '총 거리', value: `${record.totalDist}`, unit: 'km', green: false },
            { label: '탄천 인정', value: `${record.tancheonDist}`, unit: 'km', green: hasZone },
            { label: '러닝 시간', value: fmtTime(record.time), unit: '', green: false },
            { label: '평균 페이스', value: fmtPace(record.pace), unit: '/km', green: false },
          ].map((stat, i) => (
            <div key={stat.label} className={`px-5 py-6 ${i < 2 ? 'border-b border-border' : ''}`}>
              <p className={`text-[11px] font-medium mb-2 ${stat.green ? 'text-green-600' : 'text-muted-foreground'}`}>{stat.label}</p>
              <p className={`font-display text-[32px] font-bold leading-none ${stat.green ? 'text-green-600' : 'text-foreground'}`}>
                {stat.value}
                {stat.unit && <span className="text-[14px] font-normal text-muted-foreground ml-1.5">{stat.unit}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── RecordsScreen ────────────────────────────────────────────────────────────
function RecordsScreen({ onSelectRecord, onSettings }: { onSelectRecord: (r: HistRecord) => void; onSettings: () => void }) {
  const hasRecords = HISTORY.length > 0
  const bestDist = hasRecords ? Math.max(...HISTORY.map(h => h.totalDist)) : 0
  const bestPace = hasRecords ? Math.min(...HISTORY.filter(h => h.pace > 0).map(h => h.pace)) : 0
  const bestTime = hasRecords ? Math.max(...HISTORY.map(h => h.time)) : 0

  // Cumulative totals (sum of all history)
  const totalAccDist = HISTORY.reduce((s, h) => s + h.totalDist, 0)
  const totalAccTancheon = HISTORY.reduce((s, h) => s + h.tancheonDist, 0)

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <StatusBar />
      {/* Page header */}
      <div className="px-5 pt-1 pb-4 flex-shrink-0 flex items-start justify-between">
        <div>
          <h1 className="font-display text-[30px] font-bold text-foreground">내 기록</h1>
          <p className="text-sm text-muted-foreground mt-0.5">개인 최고 기록 및 러닝 히스토리</p>
        </div>
        <div className="pt-2">
          <SettingsButton onPress={onSettings} />
        </div>
      </div>

      {!hasRecords ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 pb-16">
          <span className="text-4xl">🏃</span>
          <p className="text-lg font-semibold text-foreground">아직 기록이 없습니다</p>
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            첫 러닝을 완료하면<br />기록이 여기에 쌓입니다.
          </p>
        </div>
      ) : (
        <div className="px-5 space-y-5 pb-6">

          {/* ── 누적 러닝 요약 ── */}
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2.5">누적 러닝</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card rounded-2xl px-4 py-5 shadow-sm border border-border">
                <p className="text-xs text-muted-foreground mb-2">총 누적 거리</p>
                <p className="font-display text-[36px] font-bold text-foreground leading-none">
                  {totalAccDist.toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground mt-1.5">km</p>
              </div>
              <div className="bg-card rounded-2xl px-4 py-5 shadow-sm border border-border">
                <p className="text-xs text-green-600 font-medium mb-2">탄천 인정 누적</p>
                <p className="font-display text-[36px] font-bold text-green-600 leading-none">
                  {totalAccTancheon.toFixed(1)}
                </p>
                <p className="text-sm text-green-500 mt-1.5">km</p>
              </div>
            </div>
          </div>

          {/* ── 개인 최고 기록 (PR) ── */}
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2.5">개인 최고 기록</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '최장 거리', value: `${bestDist}`, unit: 'km' },
                { label: '최고 페이스', value: fmtPace(bestPace), unit: '/km' },
                { label: '최대 시간', value: fmtTime(bestTime), unit: '' },
              ].map(pr => (
                <div key={pr.label} className="bg-card rounded-2xl px-3 py-5 shadow-sm border border-border text-center">
                  <p className="text-[11px] text-muted-foreground mb-2.5 leading-tight">{pr.label}</p>
                  <p className="font-display text-[20px] font-bold text-primary leading-none">{pr.value}</p>
                  {pr.unit && <p className="text-[11px] text-muted-foreground mt-1.5">{pr.unit}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* ── 러닝 기록 목록 ── */}
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2.5">러닝 기록</p>
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              {HISTORY.map((rec, i) => (
                <button key={i} onClick={() => onSelectRecord(rec)}
                  className={`w-full text-left px-5 py-5 active:bg-muted transition-colors ${
                    i < HISTORY.length - 1 ? 'border-b border-border' : ''
                  }`}>
                  {/* Date row */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[16px] font-semibold text-foreground">{rec.date}</span>
                      {rec.tancheonDist === 0 && (
                        <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          탄천 외
                        </span>
                      )}
                    </div>
                    <span className="text-muted-foreground"><IconChevronRight /></span>
                  </div>
                  {/* Stats 4-col */}
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <p className="text-[11px] text-muted-foreground mb-1">총 거리</p>
                      <p className="font-display text-[16px] font-bold text-foreground leading-none">
                        {rec.totalDist}
                        <span className="text-[11px] font-normal text-muted-foreground ml-0.5">km</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-green-600 mb-1">탄천 인정</p>
                      <p className="font-display text-[16px] font-bold text-green-600 leading-none">
                        {rec.tancheonDist}
                        <span className="text-[11px] font-normal text-green-500 ml-0.5">km</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground mb-1">시간</p>
                      <p className="font-display text-[16px] font-bold text-foreground leading-none">{fmtTime(rec.time)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground mb-1">페이스</p>
                      <p className="font-display text-[16px] font-bold text-foreground leading-none">{fmtPace(rec.pace)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

// ─── BottomNav ────────────────────────────────────────────────────────────────
function BottomNav({ tab, onTabChange }: { tab: Tab; onTabChange: (t: Tab) => void }) {
  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'run', label: '달리기' },
    { id: 'ranking', label: '랭킹' },
    { id: 'records', label: '기록' },
  ]
  return (
    <nav className="border-t border-border bg-card grid grid-cols-3 flex-shrink-0">
      {tabs.map(t => {
        const active = tab === t.id
        return (
          <button key={t.id} onClick={() => onTabChange(t.id)}
            className={`flex flex-col items-center justify-center py-2.5 gap-1 transition-colors ${
              active ? 'text-primary' : 'text-muted-foreground'
            }`}>
            {t.id === 'run'     && <IconRun     active={active} />}
            {t.id === 'ranking' && <IconTrophy  active={active} />}
            {t.id === 'records' && <IconBook    active={active} />}
            <span className="text-[10px] font-medium">{t.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

// ─── Phone Frame ──────────────────────────────────────────────────────────────
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#C8C4BC] flex items-center justify-center p-0 sm:p-6">
      <div className="
        relative flex flex-col bg-background overflow-hidden
        w-full h-[100dvh]
        sm:w-[390px] sm:h-[844px] sm:rounded-[44px] sm:shadow-2xl sm:shadow-black/40
      ">
        {children}
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>('login')
  const [tab, setTab] = useState<Tab>('run')
  const [nicknameInput, setNicknameInput] = useState('')
  const [countdown, setCountdown] = useState(3)
  const [runTime, setRunTime] = useState(0)
  const [totalDist, setTotalDist] = useState(0)
  const [tancheonDist, setTancheonDist] = useState(0)
  const [inZone, setInZone] = useState(false)
  const [result, setResult] = useState<RunResult | null>(null)
  // Record detail: which record is being viewed
  const [selectedRecord, setSelectedRecord] = useState<HistRecord | null>(null)
  // Settings overlay: null = not open, 'settings' = settings screen, 'nickname-edit' = nickname edit
  const [settingsScreen, setSettingsScreen] = useState<SettingsScreen>(null)
  // Which tab was active when settings was opened (to return to correct tab)
  const [settingsReturnTab, setSettingsReturnTab] = useState<Tab>('run')

  // Simulated GPS dropout at t=20–24
  const gpsLost = screen === 'running' && runTime >= 20 && runTime < 24

  // Countdown
  useEffect(() => {
    if (screen !== 'countdown') return
    let count = 3; setCountdown(3)
    const interval = setInterval(() => {
      count -= 1; setCountdown(count)
      if (count === 0) {
        clearInterval(interval)
        setTimeout(() => {
          setRunTime(0); setTotalDist(0); setTancheonDist(0); setInZone(false)
          setScreen('running')
        }, 900)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [screen])

  // Running timer tick
  useEffect(() => {
    if (screen !== 'running') return
    const interval = setInterval(() => setRunTime(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [screen])

  // Distance + zone update per tick
  useEffect(() => {
    if (screen !== 'running' || runTime === 0) return
    const lost = runTime >= 20 && runTime < 24
    if (!lost) {
      const speed = 0.0031
      setTotalDist(d => parseFloat((d + speed).toFixed(4)))
      const zone = runTime >= 8 && runTime < 100
      setInZone(zone)
      if (zone) setTancheonDist(td => parseFloat((td + speed * 0.88).toFixed(4)))
      else setInZone(false)
    }
  }, [runTime, screen])

  const handleStop = useCallback(() => {
    const pace = totalDist > 0.05 ? Math.round(runTime / totalDist) : 0
    const bestDist = HISTORY.length > 0 ? Math.max(...HISTORY.map(h => h.totalDist)) : 0
    setResult({
      totalDist, tancheonDist, runTime,
      paceStr: fmtPace(pace),
      date: '2026. 09. 10',
      rank: tancheonDist > 0.05 ? 5 : -1,
      isPR: totalDist > bestDist,
    })
    setScreen('result')
  }, [totalDist, tancheonDist, runTime])

  const nickname = nicknameInput || '뚝심주자'

  const openSettings = () => {
    setSettingsReturnTab(tab)
    setSettingsScreen('settings')
    setSelectedRecord(null)
  }

  // Render the appropriate content inside the phone frame
  const renderContent = () => {
    if (screen === 'login')
      return <LoginScreen onLogin={() => setScreen('nickname')} />

    if (screen === 'nickname')
      return <NicknameScreen value={nicknameInput} onChange={setNicknameInput} onConfirm={() => setScreen('home')} />

    if (screen === 'countdown')
      return <CountdownScreen count={countdown} />

    if (screen === 'running')
      return <RunningScreen runTime={runTime} totalDist={totalDist} tancheonDist={tancheonDist}
        inZone={inZone} gpsLost={gpsLost} onStop={handleStop} />

    if (screen === 'result' && result)
      return <ResultScreen result={result}
        onViewRanking={() => { setTab('ranking'); setScreen('home') }}
        onViewRecords={() => { setTab('records'); setScreen('home') }} />

    // Settings screens
    if (settingsScreen === 'nickname-edit')
      return <NicknameEditScreen
        currentNickname={nickname}
        onBack={() => setSettingsScreen('settings')}
        onSave={name => { setNicknameInput(name); setSettingsScreen('settings') }}
      />

    if (settingsScreen === 'settings')
      return <SettingsScreen
        nickname={nickname}
        onBack={() => { setSettingsScreen(null); setTab(settingsReturnTab) }}
        onEditNickname={() => setSettingsScreen('nickname-edit')}
      />

    // Record detail overrides tab content
    if (selectedRecord)
      return <RecordDetailScreen record={selectedRecord} onBack={() => setSelectedRecord(null)} />

    // Tabbed shell (home state)
    return (
      <>
        <div className="flex-1 overflow-y-auto min-h-0">
          {tab === 'run'     && <HomeScreen nickname={nickname} onStart={() => setScreen('countdown')} onSettings={openSettings} />}
          {tab === 'ranking' && <RankingScreen nickname={nickname} onSettings={openSettings} />}
          {tab === 'records' && <RecordsScreen onSelectRecord={r => { setSelectedRecord(r); setTab('records') }} onSettings={openSettings} />}
        </div>
        <BottomNav tab={tab} onTabChange={t => { setTab(t); setSelectedRecord(null); setSettingsScreen(null) }} />
      </>
    )
  }

  return <PhoneFrame>{renderContent()}</PhoneFrame>
}
