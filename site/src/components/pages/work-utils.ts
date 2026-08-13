import type { Work } from '@/content/works'

/**
 * 사업 이력을 최신순으로 정렬·표시하는 공용 로직.
 * `/business`(분야별 최근 사업)와 `/solutions`(Smart Zone Cast 이력)가 같이 쓴다 —
 * 정렬·기간 표기 규칙이 갈라지면 페이지마다 "최근"의 뜻이 달라진다.
 */

/** 정렬 키 — 진행 중(ongoing)이면 항상 맨 앞, 아니면 종료월(없으면 시작월) 기준 */
function sortKey(w: Work): string {
  if (w.ongoing) return '9999-99'
  return w.to || w.from
}

export function sortByRecent(works: Work[]): Work[] {
  return [...works].sort((a, b) => sortKey(b).localeCompare(sortKey(a)))
}

function dot(ym: string): string {
  return ym.replace('-', '.')
}

/** 'YYYY-MM' → 'YYYY.MM' 표기. 진행 중이면 '~ 현재', 시작·종료가 같은 달이면 한 번만 */
export function formatPeriod(w: Work): string {
  if (w.ongoing) return `${dot(w.from)} ~ 현재`
  if (!w.to || w.to === w.from) return dot(w.from)
  return `${dot(w.from)} ~ ${dot(w.to)}`
}

/**
 * **시작한 때가 최근인 순.** "최근 사업"이라는 말에는 이쪽이 맞다.
 *
 * ⚠ `sortByRecent` 를 쓰면 안 된다 — 그건 진행 중(ongoing)을 늘 맨 앞에 두므로,
 *   2013년에 시작해 아직 도는 유지보수가 "최근" 목록의 1등이 된다. 실제로 그렇게 나왔었다.
 */
export function sortByStart(works: Work[]): Work[] {
  return [...works].sort((a, b) => b.from.localeCompare(a.from))
}
