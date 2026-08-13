'use client'

import Link from 'next/link'
import { useMemo, useState, useSyncExternalStore, type ReactNode } from 'react'

import { FIELD_LABEL, FIELD_ORDER } from '@/content/fields'
import { CLIENTS, WORKS, type WorkField } from '@/content/works'

// ⚠ 라벨·순서는 `content/fields.ts` 정본을 쓴다. 예전에는 이 파일에 표를 복사해 두어서
//   화면마다 분류 이름이 달랐다(여기 "LBS·측위", 저기 "통신 · 측위").

type FieldFilter = WorkField | 'all'
type ClientFilter = string | 'all'

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-colors ${
        active
          ? 'border-blue bg-blue text-white'
          : 'border-white/12 text-on-deep-muted hover:border-white/35 hover:text-on-deep'
      }`}
    >
      {children}
    </button>
  )
}

/**
 * 주소창의 `?field=` — 홈의 사업 영역 카드가 `/works/?field=finance` 로 보낸다.
 *
 * 정적 내보내기라 서버는 이 쿼리를 모른다. 그래서 **브라우저에서만 있는 값**으로 읽는데,
 * 읽는 방법이 세 가지라 왜 이걸 골랐는지 남긴다.
 * ⚠ `useEffect` + `setState` — 마운트 직후 렌더가 한 번 더 돌고, 그 한 프레임 동안 '전체'가
 *   보였다가 바뀐다(그리고 react-hooks/set-state-in-effect 에 걸린다).
 * ⚠ `useSearchParams` — Suspense 경계를 요구해서 페이지가 한 번 빈다. 이 정도 일에 과하다.
 * ✔ `useSyncExternalStore` — 서버 스냅숏은 null, 브라우저 스냅숏은 실제 값. 하이드레이션이
 *   어긋나지 않으면서 첫 렌더부터 맞는 값이 나온다. 구독할 것은 없으므로(이 링크로 들어온 뒤
 *   주소가 저절로 바뀌지 않는다) 구독 함수는 빈 정리 함수만 돌려준다.
 */
function subscribeNothing() {
  return () => {}
}
function readFieldParam(): string | null {
  return new URLSearchParams(window.location.search).get('field')
}
function noFieldParam(): string | null {
  return null
}

/**
 * 사업 사례 탐색기 — 분야·주요 고객사 필터 + 목록.
 *
 * ⚠ 이 화면은 "찾으러 온 사람"을 위한 것이라 스크롤 연출을 넣지 않는다(기획서 결정).
 * ⚠ 필터 칩의 값은 항상 키(WorkField 또는 고객사명 원문)로 들고, 화면에 보이는 글자만 한글 라벨이다.
 */
export function WorksExplorer() {
  const urlField = useSyncExternalStore(subscribeNothing, readFieldParam, noFieldParam)
  // 사람이 칩을 누르면 그때부터는 주소가 아니라 고른 값을 따른다
  const [picked, setPicked] = useState<FieldFilter | null>(null)
  const field: FieldFilter =
    picked ?? (urlField && (FIELD_ORDER as string[]).includes(urlField) ? (urlField as WorkField) : 'all')
  const setField = setPicked
  const [client, setClient] = useState<ClientFilter>('all')
  const [q, setQ] = useState('')

  const fieldCounts = useMemo(() => {
    const counts = new Map<WorkField, number>()
    for (const w of WORKS) counts.set(w.field, (counts.get(w.field) ?? 0) + 1)
    return counts
  }, [])

  // 주요 고객사 — 2건 이상 등장한 곳만 칩으로 낸다. 1건짜리를 전부 늘어놓으면
  // 필터가 아니라 명단이 되어 오히려 찾기 어려워진다(그런 사업은 '전체'에서 그대로 보인다).
  const majorClients = useMemo(() => CLIENTS.filter((c) => c.count >= 2), [])

  /**
   * 글자로 찾기 — 사업명과 고객사를 함께 본다.
   *
   * ⚠ **띄어쓰기를 지우고 견준다.** 사람은 "현대오토에버"를 "현대 오토에버"로도 치고, 원문 표기가
   *   어느 쪽인지 외우고 있지 않다. 띄어쓰기 하나 때문에 "없습니다"가 뜨면 자료가 없는 줄 안다.
   * ⚠ 한글은 대소문자가 없지만 영문 고객사(KT·CJ·DGB)가 섞여 있어 소문자로 눕혀서 견준다.
   * ⚠ 초성 검색까지는 안 간다 — 103건짜리 목록에 그만한 장치는 과하고, 규칙이 늘면 왜 안 걸리는지
   *   설명하기 어려워진다.
   */
  const needle = q.trim().toLowerCase().replace(/\s+/g, '')
  const filtered = useMemo(
    () =>
      WORKS.filter(
        (w) =>
          (field === 'all' || w.field === field) &&
          (client === 'all' || w.client === client) &&
          (!needle || `${w.title}${w.client}`.toLowerCase().replace(/\s+/g, '').includes(needle)),
      ),
    [field, client, needle],
  )

  return (
    <div className="mt-16">
      <h2 className="font-display text-[12px] font-bold tracking-[0.14em] text-blue-hi">ALL WORKS</h2>

      {/* 찾기 — 칩만으로는 103건에서 특정 사업을 못 찾는다(눈으로 훑는 수밖에 없었다).
          ⚠ 글자 크기를 16px 이상으로 둔다. 그 아래면 **iOS 가 입력칸을 누를 때 화면을 확대**하고,
             확대된 화면은 저절로 안 돌아온다 — 검색 한 번에 레이아웃이 깨진 것처럼 보인다. */}
      <div className="relative mt-5 max-w-[420px]">
        <label htmlFor="work-q" className="sr-only">
          사업명 또는 고객사로 찾기
        </label>
        <svg
          aria-hidden
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-on-deep-subtle"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.2-3.2" />
        </svg>
        <input
          id="work-q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="사업명 · 고객사로 찾기"
          autoComplete="off"
          className="h-11 w-full rounded-full border border-white/12 bg-white/[0.03] pl-10 pr-10 text-[16px] text-on-deep outline-none transition-colors placeholder:text-on-deep-subtle focus:border-blue/60"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ('')}
            aria-label="찾는 말 지우기"
            className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-on-deep-subtle transition-colors hover:bg-white/10 hover:text-on-deep"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Chip active={field === 'all'} onClick={() => setField('all')}>
          전체 {WORKS.length}
        </Chip>
        {FIELD_ORDER.map((f) => (
          <Chip key={f} active={field === f} onClick={() => setField(f)}>
            {FIELD_LABEL[f]} {fieldCounts.get(f) ?? 0}
          </Chip>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Chip active={client === 'all'} onClick={() => setClient('all')}>
          주요 고객사 전체
        </Chip>
        {majorClients.map((c) => (
          <Chip key={c.name} active={client === c.name} onClick={() => setClient(c.name)}>
            {c.name} {c.count}
          </Chip>
        ))}
      </div>

      {/* ⚠ `aria-live` 로 건수를 읽어 준다 — 화면을 못 보는 사람에게는 "몇 건 남았는지"가
             필터가 먹혔다는 유일한 신호다. `polite` 라 타이핑을 끊지 않는다. */}
      <p className="mt-6 text-[13px] text-on-deep-subtle" aria-live="polite">
        {filtered.length}건{filtered.length !== WORKS.length && ` / 전체 ${WORKS.length}건`}
      </p>

      {/* 머리 행 — pc 이상에서만. 좁은 화면은 각 행이 1열로 쌓이므로 라벨을 따로 안 둔다 */}
      <div className="mt-3 hidden border-b border-white/10 pb-3 text-[12px] font-semibold text-on-deep-subtle pc:grid pc:grid-cols-[88px_1fr_240px_120px] pc:gap-4">
        <span>연도</span>
        <span>사업명</span>
        <span>고객사</span>
        <span>분야</span>
      </div>

      <ul className="divide-y divide-white/6">
        {filtered.map((w) => (
          // cv-row: 103행 중 화면에 든 것만 그린다. Ctrl+F 와 탭 이동은 그대로 산다(globals.css)
          <li key={w.slug} className="cv-row">
            <Link
              href={`/works/${w.slug}/`}
              className="grid grid-cols-1 gap-1 rounded-md py-4 pl-2 pr-2 transition-[background-color,padding-left] duration-200 hover:bg-white/5 hover:pl-4 pc:grid-cols-[88px_1fr_240px_120px] pc:items-center pc:gap-4 pc:py-3.5"
            >
              <span className="font-display text-[13px] tabular-nums text-on-deep-subtle">
                {w.year}
                {w.ongoing ? ' · 진행중' : ''}
              </span>
              <span className="text-[15px] font-medium text-on-deep">{w.title}</span>
              {/* 고객사가 원문에 없는 건은 비워 둔다 — "비공개"가 아니라 정말 빈 값이다 */}
              <span className="text-[13.5px] text-on-deep-muted">{w.client}</span>
              <span className="text-[12.5px] text-on-deep-subtle">{FIELD_LABEL[w.field]}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* ⚠ 빈 결과에서 **되돌아갈 길을 준다.** "없습니다"만 있으면 사람은 자료가 없다고 믿고 나간다 —
             실제로는 필터를 세 개 겹쳐 놓은 것일 때가 많다. 무엇을 걸었는지 되짚어 주고 한 번에 푼다. */}
      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-[14px] text-on-deep-muted">
            {needle ? `'${q.trim()}' 로 찾은 사업이 없습니다.` : '해당하는 사업이 없습니다.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setQ('')
              setField('all')
              setClient('all')
            }}
            className="mt-4 rounded-full border border-white/15 px-4 py-2 text-[13px] text-on-deep transition-colors hover:border-white/35"
          >
            조건 모두 지우고 {WORKS.length}건 전체 보기
          </button>
        </div>
      )}
    </div>
  )
}
