/**
 * 사업 분류 정본 — **축은 "무슨 기술이냐"가 아니라 "어느 팀이 하느냐"다.**
 *
 * 사용자 확인 2026-08-07:
 *   디지털금융사업팀 — iM라이프 · iM캐피탈 · DGB · KB · 에이스생명 등 금융권
 *   IT서비스사업팀   — 현대오토에버 · 현대자동차 · 르노코리아 · **테스트웍스(aiworks)**
 *   솔루션사업팀     — KT · 재난안전통신망 · SKT · ETRI · 국책과제 · 자사 솔루션
 *
 * ⚠ 이 표가 정본이다. `works.ts` 의 `field` 값은 이 표를 따라야 하고, 새 사업을 넣을 때도
 *   "무슨 기술인가"가 아니라 **"어느 팀 고객인가"** 로 고른다. 2026-08-07 이전에는 기술 기준으로
 *   나눠 두어서 테스트웍스가 '기타'에, 한국증권전산이 '기타'에 들어가 있었다.
 *
 * ⚠ 키(`mobility`·`lbs`)는 옛 이름 그대로 둔다. 101건의 `field` 값과 사례 상세의 도해 선택이
 *   이 키를 보고 있어서, 이름만 바꾸면 건드릴 곳이 늘어나는 데 비해 얻는 게 없다.
 *   **사람이 보는 글자는 아래 `ko`·`team` 뿐이다.**
 *
 * ⚠ 라벨을 화면마다 따로 적지 않는다. 예전에는 `WorksExplorer`·`WorkBand`·사례 상세 세 곳에
 *   같은 표가 복사돼 있어서, 한 곳만 고치면 화면마다 다른 이름이 나왔다.
 */
import type { WorkField } from './works'

export interface FieldMeta {
  key: WorkField
  /** 화면에 보이는 이름 */
  ko: string
  /** 영문 이름표(작은 대문자) */
  en: string
  /** 이 분류를 맡는 팀 — 없으면 빈 문자열 */
  team: string
  /** 한 줄 설명 */
  blurb: string
  /** 구분용 색 — 의미가 다른 게 아니라 눈으로 가르기 위한 것이다 */
  tone: string
}

export const FIELD_META: Record<WorkField, FieldMeta> = {
  finance: {
    key: 'finance',
    ko: '디지털금융',
    en: 'DIGITAL FINANCE',
    team: '디지털금융사업팀',
    blurb: '은행·보험·캐피탈의 고객채널과 내부 시스템',
    tone: 'var(--color-tone-finance)',
  },
  mobility: {
    key: 'mobility',
    ko: 'IT서비스',
    en: 'IT SERVICE',
    team: 'IT서비스사업팀',
    blurb: '차량 콘텐츠·플랫폼과 서비스 운영',
    tone: 'var(--color-tone-mobility)',
  },
  lbs: {
    key: 'lbs',
    ko: 'LBS · 측위',
    en: 'SOLUTION & LOCATION',
    team: '솔루션사업팀',
    blurb: '통신사 플랫폼, 측위 엔진, 재난안전통신망',
    tone: 'var(--color-tone-lbs)',
  },
  etc: {
    key: 'etc',
    ko: '그 밖',
    en: 'OTHERS',
    team: '',
    blurb: '세 팀의 축 밖에서 고객사의 필요에 맞춰 진행한 사업',
    tone: 'var(--color-tone-etc)',
  },
}

/** 화면에 늘어놓는 순서 — 건수가 아니라 회사가 설명하고 싶은 순서다 */
export const FIELD_ORDER: WorkField[] = ['finance', 'mobility', 'lbs', 'etc']

export const FIELD_LABEL: Record<WorkField, string> = {
  finance: FIELD_META.finance.ko,
  mobility: FIELD_META.mobility.ko,
  lbs: FIELD_META.lbs.ko,
  etc: FIELD_META.etc.ko,
}

export const FIELD_TONE: Record<WorkField, string> = {
  finance: FIELD_META.finance.tone,
  mobility: FIELD_META.mobility.tone,
  lbs: FIELD_META.lbs.tone,
  etc: FIELD_META.etc.tone,
}
