/**
 * 화면에 나오는 숫자를 **한 곳에서** 센다.
 *
 * ⚠ 연차·건수를 문장에 손으로 적지 않는다. 해가 바뀌거나 이력이 한 건 늘면 그 문장이 곧 거짓이 된다.
 *   ([[acrofuture-web]] 규율 — 사용자 결정 2026-08-06)
 * ⚠ `AGE_YEARS` 는 빌드 시점의 해로 계산된다. 정적 사이트라 **다시 빌드해야 갱신된다** —
 *   해가 바뀌면 한 번 빌드해서 올린다. 브라우저에서 계산하면 서버·클라이언트 값이 달라져
 *   하이드레이션이 깨진다(자매 프로젝트에서 실제로 겪은 문제라 여기서 막아 둔다).
 * ⚠ `works.ts` 가 이미 세는 것(WORK_COUNT · CLIENTS · FIELD_START · YEARS)은 **다시 만들지 않는다.**
 *   같은 값을 두 곳에서 세면 언젠가 두 값이 달라지고, 어느 쪽이 맞는지 아무도 모르게 된다.
 */
import { COMPANY, PEOPLE } from './company'
import { CLIENTS, WORKS, type WorkField } from './works'

export { WORK_COUNT, FIELD_START } from './works'

/** 업력 — 지금 해에서 설립 연도를 뺀다 */
export const AGE_YEARS = new Date().getFullYear() - COMPANY.foundedYear

/** 고객사 수 — 원문에 이름이 적힌 곳만(미기재는 세지 않는다) */
export const CLIENT_COUNT = CLIENTS.length

export const FIELD_COUNT: Record<WorkField, number> = WORKS.reduce(
  (acc, w) => {
    acc[w.field] += 1
    return acc
  },
  { finance: 0, mobility: 0, lbs: 0, etc: 0 } as Record<WorkField, number>,
)

/** 한 고객사와 몇 건을 했는지 — 많은 순. `works.ts` 의 CLIENTS 를 정렬만 바꿔 쓴다 */
export const CLIENT_RANK: Array<{ client: string; n: number }> = [...CLIENTS]
  .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  .map((c) => ({ client: c.name, n: c.count }))

/** 개발 인력 비율 — 30명 중 29명. ⚠ 반올림한 값이라 화면에서는 "약"을 붙여 쓴다 */
export const ENGINEER_RATIO = Math.round((PEOPLE.engineers / PEOPLE.total) * 100)

/** 지금도 이어지는 사업 — "만든 것을 오래 지킨다"는 주장의 증거다 */
export const ONGOING_COUNT = WORKS.filter((w) => w.ongoing).length

/**
 * 건수를 **두루뭉술하게** 적는다 — "104건"보다 "104+" 가 낫다(사용자 요청 2026-08-07).
 *
 * ⚠ 줄이지 않고 **`+` 만 붙인다.** 반올림해서 내리면 실제보다 적게 말하게 되고,
 *   올리면 없는 실적을 말하게 된다. `+` 는 "적어도 이만큼"이라 둘 다 아니다.
 * ⚠ 정확한 수가 필요한 곳(사업 사례 목록의 필터 칩)에서는 쓰지 않는다 — 거기서는 세는 게 목적이다.
 */
export function approx(n: number): string {
  return `${n}+`
}
