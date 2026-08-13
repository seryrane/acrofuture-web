/**
 * 자체 솔루션 정본 — 3종의 **이름은 유지**하되(사용자 결정 2026-08-07), 설명은 **실물 기반**으로만 쓴다.
 *
 * ⚠ AcTrack · Cacago 는 회사 소개서 38쪽 어디에도 없는 이름이다(지금 acrofuture.com 에만 있다).
 *   그래서 기능을 지어내지 않고, **소개서에서 확인되는 사업 이력·특허만** `basis` 에 붙였다.
 *   화면은 이 `basis` 를 함께 보여 준다 — 솔루션 이름은 우리가 붙인 것이지만 그 아래 실적은
 *   계약서가 있는 것들이라, 같이 놓여야 "만들 줄 안다"는 말이 증거가 된다.
 * ⚠ `works` 는 `works.ts` 의 slug 다. `patents` 는 `company.ts` 의 CREDENTIALS.patents 등록번호다.
 * ⚠ 성능 수치(정확도 몇 m, 배터리 몇 % 절감)는 **적지 않는다** — 잰 자료가 없다.
 */

export interface Solution {
  key: string
  name: string
  tagline: string
  /** 무엇을 하는 솔루션인지 — **방문자에게 하는 말**로 쓴다. 소개서에서 확인되는 범위 안에서만 */
  desc: string
  /** 기능 목록. 전부 아래 `works`/`patents` 로 뒷받침되는 것만 적는다 */
  features: string[]
  /** 근거 — 실제 사업 이력 (works.ts slug) */
  works: string[]
  /** 근거 — 특허 등록번호 (company.ts CREDENTIALS.patents 의 no 와 같은 값) */
  patents?: string[]
  /** 강조색 계열 — 화면이 카드마다 다른 색을 쓸 때 본다 */
  tone: 'blue' | 'violet' | 'cyan'
  /**
   * 아이콘 — **지금 홈페이지가 쓰는 파일 그대로**다(acrofuture.com/images/solution_*.svg).
   * ⚠ 새로 그리지 않는다. 이미 쓰던 상징을 바꾸면 아는 사람이 못 알아본다.
   *   단색 도형이라 CSS 마스크로 색만 입힌다.
   */
  icon: string
}

export const SOLUTIONS: Solution[] = [
  {
    key: 'actrack',
    name: 'AcTrack',
    // 지금 홈페이지에 쓰는 문구 그대로
    tagline: 'GPS · WiFi 로 정확하게, 실시간 위치 추적',
    icon: '/media/brand/solution_lbs.svg',
    desc: 'GPS 와 WiFi 를 함께 써서 실내외를 끊김 없이 추적합니다. 통신사 측위 플랫폼과 국책과제로 쌓은 엔진을 그대로 적용해, 신호가 약한 실내에서도 위치를 놓치지 않고 필요하면 센티미터 단위 정밀측위까지 지원합니다.',
    features: [
      'AI/ML 기반 복합측위 — KT 복합측위엔진(EAGLE-EYE) 고도화',
      'RTK 정밀측위 보정 신호 배포',
      '긴급구조용 3차원 정밀측위 (국책과제)',
      '측정한 위치가 맞는지 되재는 품질 관리',
    ],
    works: [
      'kt-hybrid-positioning-engine-ai-ml',
      'kt-rtk-precision-positioning-platform',
      'kt-emergency-3d-positioning-commercial-platform',
      'kt-location-info-quality-management-system',
    ],
    patents: ['제10-2226683호'],
    tone: 'blue',
  },
  {
    key: 'smart-zone-cast',
    name: 'Smart Zone Cast',
    tagline: '정확한 타이밍에 딱, 실시간 지역 발송 메시지',
    icon: '/media/brand/solution_cbs.svg',
    desc: '지도 위에 구역을 지정하면 그 안에 들어온 단말에만 메시지가 발송됩니다. KT 와 SKT 양쪽에 같은 계열의 플랫폼을 구축했고, 위치 기반 재난안전문자에도 적용되어 공공 영역에서 먼저 검증된 기술입니다.',
    features: [
      '지도 기반 구역(지오펜스) 설정',
      '구역 진입 시점 Push · 문자 발송',
      '위치 기반 재난안전문자',
      '캠페인 · 발송 결과 리포트',
      '바깥 시스템에서 부를 수 있는 OPEN API',
    ],
    works: [
      'kt-smart-zone-cast-disaster-safety-sms',
      'skt-cbs-location-geofencing-platform',
      'kt-cbs-location-geofencing-platform',
      'cbs-geofencing-platform-upgrade',
    ],
    patents: ['제10-1674367호'],
    tone: 'violet',
  },
  {
    key: 'cacago',
    name: 'Cacago',
    tagline: '복잡한 화물관리 그만, 최적 경로로 비용 절감',
    icon: '/media/brand/solution_cacago.svg',
    desc: '차량·장비처럼 이동하는 자산의 대여와 회수, 이력을 한 화면에서 관리합니다. 자사 상품인 SMART RENTAL 을 2015년부터 직접 운영해 왔고, 항만 물류 자동화와 차량 이력관리에서 같은 문제를 다뤄 왔습니다.',
    features: [
      '대여 · 반납 · 회수 이력 관리',
      '관리자 웹 대시보드',
      '차량 단위 이력 조회',
      'AcTrack 위치 데이터 연계',
    ],
    works: [
      'smart-rental-solution',
      'cyberlogitec-port-logistics-automation-system',
      'vehicle-total-history-management-system',
    ],
    tone: 'cyan',
  },
]
