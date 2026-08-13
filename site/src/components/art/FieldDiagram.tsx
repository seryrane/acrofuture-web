import type { FieldKey } from '@/content/company'

/**
 * 사업 영역 도해 — **장식이 아니라 설명이다.** 각 그림은 그 영역이 실제로 하는 일을 그린다.
 *
 * ⚠ 사진을 쓰지 않는 이유: 이 회사가 만드는 것은 소프트웨어라 찍을 실물이 없다.
 *   흔한 스톡 사진은 아무것도 설명하지 못하면서 "아무 IT 회사"로 보이게 만든다.
 * ⚠ 소개서의 원본 구성도를 그대로 싣지 않는 이유: 회색조에 글자가 빽빽해 웹에서 안 읽히고,
 *   고객사 시스템 내부가 그대로 드러난다. **무엇을 그릴지의 근거로만** 쓰고 다시 그렸다.
 *
 * ⚠ 연출이 곧 설명이다. 선은 **일이 흐르는 방향대로** 그려지고(`af-draw`), 이름표가 뒤따라 뜨고
 *   (`af-fade`), 마지막에 결론이 내려앉는다(`af-land`). 순서는 `--i` 로 준다.
 *   시작 상태와 곡선은 globals.css 가 정한다 — 여기서 값을 새로 만들지 않는다.
 * ⚠ 색은 토큰만. 선은 currentColor 로 그려 밝은 바탕·어두운 바탕 양쪽에서 읽히게 하고,
 *   **파랑은 결론 한 곳에만** 쓴다.
 *
 * 근거(회사 소개서):
 *   finance  — iM라이프 IT시스템, iM캐피탈 에이전트 영업관리 포털, 카버스(오토금융) 플랫폼
 *   mobility — 현대오토에버 글로벌 POI Search Service, MAPGPT·내비 3D 시각화
 *   lbs      — KT 복합측위엔진(정밀기지국 E-CID/RF Map · WiFi · AGNSS 위성), 3차원 정밀측위
 */

/** 그려지는 선 — pathLength 로 길이를 정규화해야 길이가 달라도 같은 속도로 그려진다 */
function Draw({ d, i, accent, width = 1.4, dash }: { d: string; i: number; accent?: boolean; width?: number; dash?: boolean }) {
  return (
    <path
      d={d}
      pathLength={1}
      style={{ '--i': i } as React.CSSProperties}
      className={`af-draw fill-none ${accent ? 'stroke-[var(--color-blue)]' : 'stroke-current'} ${
        accent ? '' : dash ? 'opacity-30' : 'opacity-70'
      }`}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
}

/** 면을 가진 상자 — 윤곽선만 있으면 도면처럼 차가워진다. 아주 옅은 면으로 깊이를 준다 */
function Card({
  x,
  y,
  w,
  h,
  i,
  label,
  sub,
}: {
  x: number
  y: number
  w: number
  h: number
  i: number
  label: string
  sub?: string
}) {
  return (
    <g className="af-fade" style={{ '--i': i } as React.CSSProperties}>
      <rect x={x} y={y} width={w} height={h} rx="10" className="fill-current opacity-[0.045]" />
      <rect x={x} y={y} width={w} height={h} rx="10" className="fill-none stroke-current opacity-25" strokeWidth="1.2" />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 2 : h / 2 + 5)} textAnchor="middle" className="fill-current text-[13px] font-semibold">
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 16} textAnchor="middle" className="fill-current text-[11.5px] opacity-50">
          {sub}
        </text>
      )}
    </g>
  )
}

function Caption({ x, y, i, children }: { x: number; y: number; i: number; children: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      style={{ '--i': i } as React.CSSProperties}
      className="af-fade fill-current text-[11.5px] font-semibold uppercase tracking-[0.1em] opacity-40"
    >
      {children}
    </text>
  )
}

/** 01 금융 — 채널을 짓고 코어에 잇는다. 그리고 떠나지 않고 운영한다 */
function FinanceDiagram() {
  return (
    <>
      {/* 쓰는 사람 */}
      <g className="af-fade" style={{ '--i': 0 } as React.CSSProperties}>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(46 ${104 + i * 66})`} className="opacity-55">
            <circle cx="0" cy="0" r="8.5" className="fill-none stroke-current" strokeWidth="1.4" />
            <path d="M-14 24a14 14 0 0 1 28 0" className="fill-none stroke-current" strokeWidth="1.4" />
          </g>
        ))}
      </g>
      <Caption x={46} y={296} i={0}>
        고객 · 설계사
      </Caption>

      {/* 사람 → 채널 */}
      {[0, 1, 2].map((i) => (
        <Draw key={i} d={`M68 ${104 + i * 66}H172`} i={i} dash width={1.1} />
      ))}

      {/* 채널 — 우리가 짓는 자리 */}
      {['모바일 앱', '웹 채널', '영업 포털'].map((t, i) => (
        <Card key={t} x={176} y={80 + i * 66} w={148} h={48} i={i + 1} label={t} />
      ))}
      <Caption x={250} y={296} i={1}>
        우리가 짓는 자리
      </Caption>

      {/* 채널 → 코어 */}
      {[0, 1, 2].map((i) => (
        <Draw key={i} d={`M324 ${104 + i * 66}H424`} i={i + 3} width={1.3} />
      ))}

      {/* 코어 시스템 */}
      <g className="af-fade" style={{ '--i': 4 } as React.CSSProperties}>
        <rect x="428" y="72" width="150" height="176" rx="14" className="fill-current opacity-[0.03]" />
        <rect x="428" y="72" width="150" height="176" rx="14" className="fill-none stroke-current opacity-25" strokeWidth="1.2" />
      </g>
      {['계약', '심사', '정산'].map((t, i) => (
        <Card key={t} x={446} y={92 + i * 52} w={114} h={40} i={i + 5} label={t} />
      ))}
      <Caption x={503} y={296} i={5}>
        코어 시스템
      </Caption>

      {/* 결론 — 끝나고도 남는 고리 */}
      <Draw d="M250 322h248a24 24 0 0 0 0-48h-30" i={8} accent width={1.8} />
      <g className="af-land" style={{ '--i': 1 } as React.CSSProperties}>
        <path d="M474 268l-8 6 8 6z" className="fill-[var(--color-blue)]" />
        <text x="46" y="327" className="fill-[var(--color-blue)] text-[13px] font-semibold">
          만든 사람이 그대로 운영합니다
        </text>
      </g>
    </>
  )
}

/** 02 모빌리티 — 한 글자 입력에서 지도 위 경로까지. 검색이 이 일의 심장이다 */
function MobilityDiagram() {
  return (
    <>
      {/* 질의 */}
      <g className="af-fade" style={{ '--i': 0 } as React.CSSProperties}>
        <rect x="34" y="92" width="196" height="48" rx="24" className="fill-current opacity-[0.045]" />
        <rect x="34" y="92" width="196" height="48" rx="24" className="fill-none stroke-current opacity-25" strokeWidth="1.2" />
        <circle cx="62" cy="116" r="6.5" className="fill-none stroke-current opacity-60" strokeWidth="1.5" />
        <path d="M67 121l6 6" className="stroke-current opacity-60" strokeWidth="1.5" strokeLinecap="round" />
        <text x="84" y="121" className="fill-current text-[13.5px] font-medium">
          강남 주차
        </text>
        <rect x="158" y="106" width="1.6" height="20" className="fill-[var(--color-blue)]" />
      </g>
      <Caption x={132} y={296} i={0}>
        질의
      </Caption>

      <Draw d="M234 116H262" i={1} width={1.3} />

      {/* 후보 — 순위가 곧 품질이다 */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} className="af-fade" style={{ '--i': i + 1 } as React.CSSProperties}>
          <rect
            x="268"
            y={62 + i * 46}
            width="150"
            height="36"
            rx="9"
            className="fill-current"
            opacity={i === 0 ? 0.06 : 0.03}
          />
          <rect
            x="268"
            y={62 + i * 46}
            width="150"
            height="36"
            rx="9"
            className={`fill-none ${i === 0 ? 'stroke-[var(--color-blue)]' : 'stroke-current opacity-20'}`}
            strokeWidth={i === 0 ? 1.6 : 1.1}
          />
          <rect x="282" y={75 + i * 46} width={90 - i * 15} height="4" rx="2" className="fill-current" opacity={i === 0 ? 0.65 : 0.28} />
          <rect x="282" y={85 + i * 46} width={52 - i * 7} height="3" rx="1.5" className="fill-current" opacity={i === 0 ? 0.35 : 0.16} />
        </g>
      ))}
      <Caption x={343} y={296} i={2}>
        후보와 순위
      </Caption>

      <Draw d="M422 134H448" i={5} width={1.3} />

      {/* 지도 */}
      <g className="af-fade" style={{ '--i': 5 } as React.CSSProperties}>
        <rect x="452" y="56" width="154" height="196" rx="14" className="fill-current opacity-[0.035]" />
        <rect x="452" y="56" width="154" height="196" rx="14" className="fill-none stroke-current opacity-25" strokeWidth="1.2" />
        <g className="opacity-[0.14]">
          {[1, 2, 3].map((i) => (
            <path key={`v${i}`} d={`M${452 + i * 38} 56V252`} className="stroke-current" strokeWidth="1" />
          ))}
          {[1, 2, 3, 4].map((i) => (
            <path key={`h${i}`} d={`M452 ${56 + i * 39}H606`} className="stroke-current" strokeWidth="1" />
          ))}
        </g>
      </g>

      {/* 결론 — 경로가 그려지고 도착지가 내려앉는다 */}
      <Draw d="M480 224V182h46v-52h50V96" i={7} accent width={2.4} />
      <g className="af-land" style={{ '--i': 0 } as React.CSSProperties}>
        <circle cx="480" cy="224" r="5" className="fill-[var(--color-blue)]" />
      </g>
      <g className="af-land" style={{ '--i': 1 } as React.CSSProperties}>
        <path d="M576 74a11 11 0 0 1 11 11c0 8-11 19-11 19s-11-11-11-19a11 11 0 0 1 11-11z" className="fill-[var(--color-blue)]" />
        <circle cx="576" cy="85" r="4" className="fill-[var(--color-paper)]" />
      </g>
      <Caption x={529} y={296} i={4}>
        지도와 경로
      </Caption>

      <text
        x="34"
        y="330"
        style={{ '--i': 2 } as React.CSSProperties}
        className="af-land fill-[var(--color-blue)] text-[13px] font-semibold"
      >
        국내에서 검증한 검색을 글로벌로 넓힙니다
      </text>
    </>
  )
}

/** 측위점 — 세 신호가 만나는 자리 */
const FIX = { x: 326, y: 172 }

/**
 * 03 LBS — 하나로는 못 잡는다. 여러 신호를 겹쳐야 점이 좁혀진다.
 *
 * ⚠ 반경을 **온전한 원으로 그리지 않는다.** 실제 삼변측량대로 그리면 원 셋이 화면을 가득 덮어
 *   글자를 삼킨다(처음에 그렇게 그렸다가 걷어냈다). 교차 부근의 **호만** 남기면 뜻은 같고
 *   화면은 조용하다.
 */
function LbsDiagram() {
  /**
   * 이름표는 **가운데 반대쪽**에 둔다 — 신호 물결이 단말 쪽으로 퍼지므로 그 방향에 글자를 두면
   * 겹친다(처음에 WiFi 이름이 물결 위에 얹혔다).
   */
  const sources = [
    { x: 150, y: 70, t: '위성', sub: 'AGNSS', side: 'left' as const },
    { x: 500, y: 86, t: '기지국', sub: 'E-CID · RF Map', side: 'right' as const },
    { x: 300, y: 278, t: 'WiFi', sub: 'POP / Pathloss', side: 'below' as const },
  ]

  /** 신호원에서 단말 쪽으로 퍼지는 물결 — 반지름만 키우며 같은 방향으로 겹쳐 그린다 */
  const wave = (s: { x: number; y: number }, r: number, spread = 0.52) => {
    const a = Math.atan2(FIX.y - s.y, FIX.x - s.x)
    const p = (t: number) => `${(s.x + r * Math.cos(t)).toFixed(1)} ${(s.y + r * Math.sin(t)).toFixed(1)}`
    return `M${p(a - spread)}A${r} ${r} 0 0 1 ${p(a + spread)}`
  }

  return (
    <>
      {/* 신호가 닿는 길 — 옅게 */}
      {sources.map((s, i) => (
        <Draw key={`ray-${s.t}`} d={`M${s.x} ${s.y}L${FIX.x} ${FIX.y}`} i={i} width={1} dash />
      ))}

      {/* 신호 — 세 곳에서 각각 온다. 겹치는 만큼 위치가 좁혀진다 */}
      {sources.map((s, si) =>
        [32, 46, 60].map((r, k) => (
          <Draw key={`w-${s.t}-${r}`} d={wave(s, r)} i={si + k} width={1.6 - k * 0.35} />
        )),
      )}

      {sources.map((s, i) => (
        <g key={s.t} className="af-fade" style={{ '--i': i } as React.CSSProperties}>
          <circle cx={s.x} cy={s.y} r="19" className="fill-current opacity-[0.05]" />
          <circle cx={s.x} cy={s.y} r="19" className="fill-none stroke-current opacity-40" strokeWidth="1.5" />
          <circle cx={s.x} cy={s.y} r="4.5" className="fill-current opacity-70" />
          {(() => {
            const anchor = s.side === 'left' ? 'end' : s.side === 'right' ? 'start' : 'middle'
            const tx = s.side === 'left' ? s.x - 30 : s.side === 'right' ? s.x + 30 : s.x
            const ty = s.side === 'below' ? s.y + 40 : s.y + 1
            return (
              <>
                <text x={tx} y={ty} textAnchor={anchor} className="fill-current text-[13px] font-semibold">
                  {s.t}
                </text>
                <text x={tx} y={ty + 17} textAnchor={anchor} className="fill-current text-[11px] opacity-45">
                  {s.sub}
                </text>
              </>
            )
          })()}
        </g>
      ))}

      {/* 결론 — 좁혀진 위치가 내려앉는다 */}
      <g className="af-land" style={{ '--i': 0 } as React.CSSProperties}>
        <circle cx={FIX.x} cy={FIX.y} r="30" className="fill-[var(--color-blue)] opacity-10" />
        <circle cx={FIX.x} cy={FIX.y} r="30" className="fill-none stroke-[var(--color-blue)] opacity-45" strokeWidth="1.3" />
      </g>
      <g className="af-land" style={{ '--i': 1 } as React.CSSProperties}>
        <circle cx={FIX.x} cy={FIX.y} r="6.5" className="fill-[var(--color-blue)]" />
        <path
          d={`M${FIX.x} ${FIX.y - 38}v-12M${FIX.x} ${FIX.y + 38}v12M${FIX.x + 38} ${FIX.y}h12M${FIX.x - 38} ${FIX.y}h-12`}
          className="stroke-[var(--color-blue)] opacity-70"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>

      <text
        x="326"
        y="358"
        textAnchor="middle"
        style={{ '--i': 2 } as React.CSSProperties}
        className="af-land fill-[var(--color-blue)] text-[13px] font-semibold"
      >
        신호를 겹칠수록 위치가 좁혀집니다
      </text>
    </>
  )
}

const DIAGRAMS: Record<FieldKey, () => React.JSX.Element> = {
  finance: FinanceDiagram,
  mobility: MobilityDiagram,
  lbs: LbsDiagram,
}

const ALT: Record<FieldKey, string> = {
  finance:
    '고객과 설계사가 쓰는 모바일 앱·웹·영업 포털을 짓고 계약·심사·정산 코어에 이은 뒤, 만든 사람이 그대로 운영하는 구조도',
  mobility: '검색어에서 후보 목록과 순위를 거쳐 지도 위 경로와 도착지까지 이어지는 흐름도',
  lbs: '위성·기지국·WiFi 세 신호의 반경이 겹치는 자리로 위치를 좁히는 복합측위 그림',
}

export function FieldDiagram({
  field,
  active,
  className = '',
}: {
  field: FieldKey
  /** 캐러셀처럼 **보이는 면이 바뀌는 자리**에서 쓴다 — 넘길 때마다 다시 그려진다 */
  active?: boolean
  className?: string
}) {
  // viewBox 는 위쪽 여백만 잘라 그림이 칸을 채우게 한다. 왼쪽은 자르지 않는다 — 이름표가 붙어 있다
  const Body = DIAGRAMS[field]
  return (
    <svg
      viewBox="0 28 640 342"
      role="img"
      aria-label={ALT[field]}
      data-active={active === undefined ? undefined : String(active)}
      className={`af-dia h-auto w-full ${className}`}
    >
      <Body />
    </svg>
  )
}
