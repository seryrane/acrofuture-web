/** 사업 이력 정본 — 출처 research/원문조사.md (회사 소개서 전수 조사) "## 6. 연혁 전체 (2009~2025)" 절.
 *  ⚠ 사업명·고객사명은 원문 표기 그대로 둔다(예: "iM라이프(구 DGB생명)") — 임의로 통일하면
 *    그 시절 계약을 아는 사람이 못 찾는다.
 *  ⚠ 원문이 특정 고객사를 "추정"으로만 적었거나 "미기재"로 밝힌 항목은 client: '' 로 비워 둔다.
 *    파일 맨 아래 "판단이 필요했던 것" 절에 근거를 남겼다.
 */
export type WorkField = 'finance' | 'mobility' | 'lbs' | 'etc'

export interface Work {
  /** URL 에 쓰는 값 — 영문 소문자·숫자·하이픈만. 사업명에서 만들되 중복되면 뒤에 -2 */
  slug: string
  title: string        // 원문 사업명 그대로
  client: string       // 원문 고객사 표기 그대로. 원문에 없으면 '' (지어내지 마라)
  field: WorkField
  from: string         // 'YYYY-MM' (원문 "22.01" → '2022-01')
  to: string           // 'YYYY-MM'. 원문이 "~현재"면 to: '' 로 두고 ongoing: true
  ongoing?: boolean
  year: number         // 시작 연도 (목록 그룹핑용)
}

export const WORKS: Work[] = [
  // ── 2026년 (1건) ──
  {
    slug: 'im-capital-digital-branch-integration',
    title: 'iM캐피탈 디지털브랜치 통합 전환 구축 사업',
    client: 'iM캐피탈(구 DGB캐피탈)',
    field: 'finance',
    from: '2026-04',
    to: '2027-01',
    year: 2026,
  },

  // ── 2025년 (3건) ──
  {
    slug: 'im-capital-homepage-renewal-2025',
    title: 'iM캐피탈 홈페이지 프로세스 개선 및 UI/UX 리뉴얼',
    client: 'iM캐피탈(구 DGB캐피탈)',
    field: 'finance',
    from: '2025-04',
    to: '2025-12',
    year: 2025,
  },
  {
    slug: 'im-capital-ai-contact-center',
    title: 'iM캐피탈 AI 고객센터 및 셀프서비스 구축',
    client: 'iM캐피탈(구 DGB캐피탈)',
    field: 'finance',
    from: '2025-06',
    to: '2026-01',
    year: 2025,
  },
  {
    slug: 'im-life-it-system-2025',
    title: 'iM라이프 IT시스템 개발 및 유지보수',
    client: 'iM라이프(구 DGB생명)',
    field: 'finance',
    from: '2025-01',
    to: '2025-12',
    year: 2025,
  },
  {
    slug: 'hyundai-autoever-global-poi-search-operation-2025',
    title: '현대오토에버 글로벌 POI Search Service 운영',
    client: '현대오토에버',
    field: 'mobility',
    from: '2025-01',
    to: '2025-12',
    year: 2025,
  },

  // ── 2024년 (8건) ──
  {
    slug: 'hyundai-autoever-global-poi-search-phase2',
    title: '현대오토에버 글로벌 POI Search Service 2단계 구축',
    client: '현대오토에버',
    field: 'mobility',
    from: '2024-10',
    to: '2025-02',
    year: 2024,
  },
  {
    slug: 'hyundai-autoever-info-service-standard-rollout',
    title: '현대오토에버 정보제공 서비스 표준 전개고도화 개발',
    client: '현대오토에버',
    field: 'mobility',
    from: '2024-09',
    to: '2025-02',
    year: 2024,
  },
  {
    slug: 'hyundai-autoever-mapgpt-navi3d-rd',
    title: '현대오토에버 MAPGPT 및 내비3D 시각화 선행개발',
    client: '현대오토에버',
    field: 'mobility',
    from: '2024-09',
    to: '2025-01',
    year: 2024,
  },
  {
    slug: 'im-capital-agent-sales-portal',
    title: 'iM캐피탈(구 DGB캐피탈) 에이전트 영업관리 포털 구축',
    client: 'iM캐피탈(구 DGB캐피탈)',
    field: 'finance',
    from: '2024-06',
    to: '2024-12',
    year: 2024,
  },
  {
    slug: 'hyundai-autoever-global-poi-search-phase1',
    title: '현대오토에버 글로벌 POI Search Service 1단계 구축',
    client: '현대오토에버',
    field: 'mobility',
    from: '2024-01',
    to: '2024-06',
    year: 2024,
  },
  {
    slug: 'hyundai-autoever-global-info-admin-web',
    title: '현대오토에버 글로벌 정보제공 서비스 관리자 웹 개발',
    client: '현대오토에버',
    field: 'mobility',
    from: '2024-01',
    to: '2024-12',
    year: 2024,
  },
  {
    slug: 'im-life-it-system-2024',
    title: 'iM라이프(구 DGB생명) IT시스템 개발 및 운영',
    client: 'iM라이프(구 DGB생명)',
    field: 'finance',
    from: '2024-01',
    to: '2024-12',
    year: 2024,
  },

  // ── 2023년 (7건) ──
  {
    slug: 'dgb-capital-carverse-platform',
    title: 'DGB캐피탈 카버스(오토금융) 플랫폼 구축 사업',
    client: 'DGB캐피탈',
    field: 'finance',
    from: '2023-08',
    to: '2024-02',
    year: 2023,
  },
  {
    slug: 'dgb-capital-homepage-improvement-2023-h2',
    title: 'DGB캐피탈 23년 하반기 홈페이지 프로세스 개선 사업',
    client: 'DGB캐피탈',
    field: 'finance',
    from: '2023-07',
    to: '2024-01',
    year: 2023,
  },
  {
    slug: 'hyundai-autoever-global-cp-admin-portal',
    title: '현대오토에버 글로벌 CP admin Portal 사이트 구축',
    client: '현대오토에버',
    field: 'mobility',
    from: '2023-03',
    to: '2023-12',
    year: 2023,
  },
  {
    slug: 'dgb-capital-homepage-improvement-2023-build',
    title: 'DGB캐피탈 23년 홈페이지 프로세스 개선 구축',
    client: 'DGB캐피탈',
    field: 'finance',
    from: '2023-03',
    to: '2024-01',
    year: 2023,
  },
  {
    slug: 'kt-hybrid-positioning-engine-ai-ml',
    title: 'KT 복합측위엔진 AI/ML 기반 고도화',
    client: 'KT',
    field: 'lbs',
    from: '2023-01',
    to: '2023-10',
    year: 2023,
  },
  {
    slug: 'kt-lbs-platform-operation-2023',
    title: 'KT LBS 플랫폼 운영',
    client: 'KT',
    field: 'lbs',
    from: '2023-01',
    to: '2023-12',
    year: 2023,
  },
  {
    slug: 'dgb-life-it-system-2023',
    title: 'DGB생명 IT시스템 개발 및 유지보수',
    client: 'DGB생명',
    field: 'finance',
    from: '2023-01',
    to: '2023-12',
    year: 2023,
  },

  // ── 2022년 (16건) ──
  {
    slug: 'kt-eagle-eye-engine-upgrade',
    title: 'KT 복합측위엔진(EAGLE-EYE) 고도화',
    client: 'KT',
    field: 'lbs',
    from: '2022-01',
    to: '2022-10',
    year: 2022,
  },
  {
    slug: 'hyundai-motor-driving-decision-operation-2022',
    title: '현대자동차 운전결심 서비스(웹/앱) 운영/유지보수',
    client: '현대자동차',
    field: 'mobility',
    from: '2022-01',
    to: '2022-12',
    year: 2022,
  },
  {
    slug: 'renault-korea-app-operation',
    title: '르노코리아자동차 앱 운영/유지보수',
    client: '르노코리아자동차',
    field: 'mobility',
    from: '2022-01',
    to: '2022-09',
    year: 2022,
  },
  {
    slug: 'kt-disaster-safety-network-positioning-maintenance-2022',
    title: 'KT 재난안전망 측위시스템 유지보수',
    client: 'KT',
    field: 'lbs',
    from: '2022-01',
    to: '2022-12',
    year: 2022,
  },
  {
    slug: 'testworks-aiworks-platform-planning',
    title: 'TestWorks [aiworks] 플랫폼 기획',
    client: 'TestWorks(테스트웍스)',
    field: 'mobility',
    from: '2022-02',
    to: '2022-04',
    year: 2022,
  },
  {
    slug: 'dgb-capital-homepage-publishing-loan-inventory-finance',
    title: 'DGB캐피탈 홈페이지(위임채권, 재고금융) 퍼블리싱 개발',
    client: 'DGB캐피탈',
    field: 'finance',
    from: '2022-03',
    to: '2022-04',
    year: 2022,
  },
  {
    slug: 'kt-smart-zone-cast-disaster-safety-sms',
    title: 'KT Smart Zone Cast (위치 기반 재난안전문자 서비스) 개발',
    client: 'KT',
    field: 'lbs',
    from: '2022-04',
    to: '2022-08',
    year: 2022,
  },
  {
    slug: 'renault-korea-app-upgrade',
    title: '르노코리아자동차 앱 고도화',
    client: '르노코리아자동차',
    field: 'mobility',
    from: '2022-04',
    to: '2022-09',
    year: 2022,
  },
  {
    slug: 'dgb-capital-personal-credit-loan-improvement',
    title: 'DGB캐피탈 홈페이지(WEB/APP) 개인신용대출 기능 개선',
    client: 'DGB캐피탈',
    field: 'finance',
    from: '2022-04',
    to: '2022-06',
    year: 2022,
  },
  {
    slug: 'kt-rtk-precision-positioning-platform',
    title: 'KT RTK 정밀측위 서비스 플랫폼 구축',
    client: 'KT',
    field: 'lbs',
    from: '2022-04',
    to: '2022-09',
    year: 2022,
  },
  {
    slug: 'hyundai-motor-driving-decision-upgrade',
    title: '현대자동차 운전결심 서비스(웹/앱) 고도화',
    client: '현대자동차',
    field: 'mobility',
    from: '2022-05',
    to: '2022-10',
    year: 2022,
  },
  {
    slug: 'dgb-capital-personal-credit-auto-loan-improvement',
    title: 'DGB캐피탈 홈페이지(WEB/APP) 개인신용대출/오토 기능 개선',
    client: 'DGB캐피탈',
    field: 'finance',
    from: '2022-05',
    to: '2022-07',
    year: 2022,
  },
  {
    slug: 'kt-emergency-3d-positioning-commercial-platform',
    title: 'KT 긴급구조용 3차원 정밀측위 상용 플랫폼 구축',
    client: 'KT',
    field: 'lbs',
    from: '2022-07',
    to: '2022-11',
    year: 2022,
  },
  {
    slug: 'etri-common-positioning-agent-device-trial',
    title: 'ETRI 단말용 공통 측위 에이전트 단말 탑재 및 실증시험',
    client: 'ETRI',
    field: 'lbs',
    from: '2022-08',
    to: '2022-11',
    year: 2022,
  },
  {
    slug: 'dgb-capital-homepage-process-improvement-2022',
    title: 'DGB캐피탈 홈페이지(WEB/APP) 프로세스 개선 구축',
    client: 'DGB캐피탈',
    field: 'finance',
    from: '2022-08',
    to: '2023-01',
    year: 2022,
  },
  {
    slug: 'testworks-tfs-management-site',
    title: 'TestWorks TFS Management 사이트 구축',
    client: 'TestWorks(테스트웍스)',
    field: 'mobility',
    from: '2022-10',
    to: '2022-12',
    year: 2022,
  },

  // ── 2021년 (14건) ──
  {
    slug: 'kb-card-mydata-planning',
    title: 'KB카드 마이데이터 구축(기획 부문)',
    client: 'KB카드',
    field: 'finance',
    from: '2021-10',
    to: '2021-12',
    year: 2021,
  },
  {
    slug: 'dgb-life-it-system-2021',
    title: 'DGB 생명 IT시스템 개발 및 유지보수',
    client: 'DGB생명',
    field: 'finance',
    from: '2021-01',
    to: '2021-12',
    year: 2021,
  },
  {
    slug: 'hyundai-motor-driving-lesson-matching-operation-2021',
    title: '현대자동차 운전연수 매칭 서비스 플랫폼 운영',
    client: '현대자동차',
    field: 'mobility',
    from: '2021-01',
    to: '2021-12',
    year: 2021,
  },
  {
    slug: 'myrsm-mobile-app-operation-2021',
    title: 'MyRSM Mobile Application 통합 운영',
    client: 'MyRSM',
    field: 'mobility',
    from: '2021-01',
    to: '2021-12',
    year: 2021,
  },
  {
    slug: 'kt-location-management-platform-maintenance',
    title: 'KT 위치관리플랫폼 유지보수',
    client: 'KT',
    field: 'lbs',
    from: '2021-01',
    to: '2021-12',
    year: 2021,
  },
  {
    slug: 'kt-hybrid-positioning-engine-maintenance-2021',
    title: 'KT 복합측위엔진 유지보수',
    client: 'KT',
    field: 'lbs',
    from: '2021-01',
    to: '2021-12',
    year: 2021,
  },
  {
    slug: 'kt-next-gen-satellite-positioning-maintenance',
    title: 'KT 차세대위성측위 시스템 유지보수',
    client: 'KT',
    field: 'lbs',
    from: '2021-01',
    to: '2021-12',
    year: 2021,
  },
  {
    slug: 'kt-satellite-correction-info-maintenance',
    title: 'KT 위성보정정보 시스템 유지보수',
    client: 'KT',
    field: 'lbs',
    from: '2021-01',
    to: '2021-12',
    year: 2021,
  },
  {
    slug: 'kt-smart-zone-cast-maintenance-2021',
    title: 'KT 스마트존캐스트 서비스 유지보수',
    client: 'KT',
    field: 'lbs',
    from: '2021-01',
    to: '2021-12',
    year: 2021,
  },
  {
    slug: 'kt-smart-zone-cast-upgrade-location-sms',
    title: 'KT 스마트존캐스트 고도화(위치문자 서비스)',
    client: 'KT',
    field: 'lbs',
    from: '2021-02',
    to: '2021-05',
    year: 2021,
  },
  {
    slug: 'kt-disaster-safety-network-positioning-maintenance-2021',
    title: 'KT 재난안전망 측위시스템 유지보수',
    client: 'KT',
    field: 'lbs',
    from: '2021-01',
    to: '2021-12',
    year: 2021,
  },
  {
    slug: 'kt-lbs-device-verification-maintenance-2021',
    title: 'KT LBS단말기검증 유지보수',
    client: 'KT',
    field: 'lbs',
    from: '2021-01',
    to: '2021-12',
    year: 2021,
  },
  {
    slug: 'national-rd-emergency-3d-positioning',
    title: '(국책과제) 긴급구조용 3차원 정밀측위',
    client: '',
    field: 'lbs',
    from: '2021-01',
    to: '2021-12',
    year: 2021,
  },
  {
    slug: 'national-rd-emergency-common-positioning-agent',
    title: '(국책과제) 긴급구조용 공통측위 단말에이전트',
    client: '',
    field: 'lbs',
    from: '2021-01',
    to: '2021-12',
    year: 2021,
  },

  // ── 2020년 (12건) ──
  {
    slug: 'kt-lbs-dr-center',
    title: 'KT LBS 시스템 DR(Disaster Recovery) 센터 구축',
    client: 'KT',
    field: 'lbs',
    from: '2020-09',
    to: '2020-12',
    year: 2020,
  },
  {
    slug: 'dgb-capital-mobile-channel-improvement-2020',
    title: 'DGB캐피탈 모바일(웹) 채널 기능 개선 사업',
    client: 'DGB캐피탈',
    field: 'finance',
    from: '2020-09',
    to: '2020-12',
    year: 2020,
  },
  {
    slug: 'hyundai-motor-driving-lesson-matching-platform-build',
    title: '현대자동차 운전연수 매칭 서비스 플랫폼 개발 구축 사업',
    client: '현대자동차',
    field: 'mobility',
    from: '2020-06',
    to: '2020-12',
    year: 2020,
  },
  {
    slug: 'kt-hybrid-positioning-engine-upgrade-2020',
    title: 'KT 복합측위엔진 고도화',
    client: 'KT',
    field: 'lbs',
    from: '2020-06',
    to: '2020-09',
    year: 2020,
  },
  {
    slug: 'national-rd-emergency-intelligent-precision-positioning',
    title: '국책과제(긴급구조용지능형정밀측위기술개발)',
    client: '',
    field: 'lbs',
    from: '2020-07',
    to: '2020-11',
    year: 2020,
  },
  {
    slug: 'myrsm-mobile-app-operation-2020',
    title: 'MyRSM Mobile Application 통합 운영',
    client: 'MyRSM',
    field: 'mobility',
    from: '2020-06',
    to: '2021-05',
    year: 2020,
  },
  {
    slug: 'dgb-life-it-system-2020',
    title: 'DGB 생명 IT시스템 개발 및 유지보수',
    client: 'DGB생명',
    field: 'finance',
    from: '2020-01',
    to: '2020-12',
    year: 2020,
  },
  {
    slug: 'kt-lbs-ito-2020',
    title: 'KT LBS - ITO',
    client: 'KT',
    field: 'lbs',
    from: '2020-01',
    to: '2020-12',
    year: 2020,
  },
  {
    slug: 'kt-eagle-eye-maintenance-2020',
    title: 'KT 복합측위엔진 유지보수(EAGLE-EYE)',
    client: 'KT',
    field: 'lbs',
    from: '2020-01',
    to: '2020-12',
    year: 2020,
  },
  {
    slug: 'kt-dgnss-maintenance-2020',
    title: 'KT 차세대위성측위 유지보수(DGNSS)',
    client: 'KT',
    field: 'lbs',
    from: '2020-01',
    to: '2020-12',
    year: 2020,
  },
  {
    slug: 'kt-cits-maintenance-2020',
    title: 'KT 위성보정정보 유지보수(C-ITS)',
    client: 'KT',
    field: 'lbs',
    from: '2020-01',
    to: '2020-12',
    year: 2020,
  },
  {
    slug: 'kt-lbs-device-verification-maintenance-2020',
    title: 'LBS단말기검증 유지보수',
    client: '',
    field: 'lbs',
    from: '2020-01',
    to: '2020-12',
    year: 2020,
  },

  // ── 2019년 (6건) ──
  {
    slug: 'dgb-capital-mobile-channel-improvement-2019',
    title: 'DGB캐피탈 모바일 채널 기능개선 사업',
    client: 'DGB캐피탈',
    field: 'finance',
    from: '2019-09',
    to: '2019-12',
    year: 2019,
  },
  {
    slug: 'dgnss-positioning-system-development',
    title: 'D-GNSS 측위 시스템 용역 개발',
    client: '',
    field: 'lbs',
    from: '2019-04',
    to: '2020-01',
    year: 2019,
  },
  {
    slug: 'kt-location-info-quality-management-system',
    title: 'KT 위치정보 품질 관리 시스템 구축',
    client: 'KT',
    field: 'lbs',
    from: '2019-03',
    to: '2019-06',
    year: 2019,
  },
  {
    slug: 'kt-lbs-ito-platform-service-2019',
    title: 'KT LBS ITO-Platform-서비스 플랫폼(LBS)',
    client: 'KT',
    field: 'lbs',
    from: '2019-01',
    to: '2019-12',
    year: 2019,
  },
  {
    slug: 'disaster-safety-network-lbs-solution',
    title: '재난안전통신망 LBS솔루션 납품 및 유지보수',
    client: '',
    field: 'lbs',
    from: '2019-01',
    to: '2025-12',
    year: 2019,
  },
  {
    slug: 'kt-precision-satellite-correction-platform-development',
    title: 'KT 정밀 위성 보정 플랫폼 용역 개발',
    client: 'KT',
    field: 'lbs',
    from: '2019-01',
    to: '2019-06',
    year: 2019,
  },

  // ── 2017~2018년 (12건, 원문 상 하나의 슬라이드에 병합) ──
  {
    slug: 'disaster-safety-network-zone-a-lbs-solution',
    title: '재난안전통신망 A사업구역 LBS 솔루션 납품 및 유지보수 계약',
    client: '',
    field: 'lbs',
    from: '2018-12',
    to: '2018-12',
    year: 2018,
  },
  {
    slug: 'kb-kookmin-bank-household-loan-digitalization',
    title: 'KB국민은행 가계여신 Digitalization 구축 개발',
    client: 'KB국민은행',
    field: 'finance',
    from: '2018-08',
    to: '2019-02',
    year: 2018,
  },
  {
    slug: 'intelligent-location-info-system-development',
    title: '지능형 위치정보 시스템 구축 용역 개발',
    client: '',
    field: 'lbs',
    from: '2018-07',
    to: '2019-04',
    year: 2018,
  },
  {
    slug: 'cbs-geofencing-platform-upgrade',
    title: 'CBS 지오펜싱 플랫폼 고도화',
    client: '',
    field: 'lbs',
    from: '2018-04',
    to: '2018-08',
    year: 2018,
  },
  {
    slug: 'dgb-capital-homepage-upgrade-2018',
    title: 'DGB 캐피탈 홈페이지 고도화',
    client: 'DGB캐피탈',
    field: 'finance',
    from: '2018-02',
    to: '2018-07',
    year: 2018,
  },
  {
    slug: 'next-gen-wps-platform-2018',
    title: '차세대 WPS 플랫폼 구축',
    client: '',
    field: 'lbs',
    from: '2018-01',
    to: '2018-06',
    year: 2018,
  },
  {
    slug: 'daegu-university-basic-competency-assessment-system',
    title: '대구대학교 기초학력평가 시스템 구축',
    client: '대구대학교',
    field: 'etc',
    from: '2017-12',
    to: '2018-02',
    year: 2017,
  },
  {
    slug: 'kisa-portal-intranet-operation',
    title: '한국인터넷진흥원 종합포털 인트라 운영 및 기능개선 사업',
    client: '한국인터넷진흥원',
    field: 'etc',
    from: '2017-10',
    to: '2017-12',
    year: 2017,
  },
  {
    slug: 'kt-lbs-integrated-maintenance',
    title: 'KT LBS 통합 유지보수',
    client: 'KT',
    field: 'lbs',
    from: '2017-07',
    to: '',
    ongoing: true,
    year: 2017,
  },
  {
    slug: 'kt-open-auth-platform',
    title: 'KT 오픈인증플랫폼 구축',
    client: 'KT',
    field: 'lbs',
    from: '2017-04',
    to: '2017-10',
    year: 2017,
  },
  {
    slug: 'dgb-capital-pc-mobile-homepage',
    title: 'DGB 캐피탈 PC/모바일 홈페이지 구축',
    client: 'DGB캐피탈',
    field: 'finance',
    from: '2017-09',
    to: '2017-09',
    year: 2017,
  },
  {
    slug: 'dcg-shopping-mall-planning',
    title: 'DCG 쇼핑몰 구축(기획)',
    client: 'DCG',
    field: 'etc',
    from: '2017-02',
    to: '2017-02',
    year: 2017,
  },

  // ── 2013~2016년 (12건, 하나의 슬라이드에 병합) ──
  {
    slug: 'u-ansim-alimi-service-development',
    title: 'U 안심알림이 서비스 개발/유지보수',
    client: '',
    field: 'lbs',
    from: '2016-12',
    to: '2016-12',
    year: 2016,
  },
  {
    slug: 'skt-cbs-location-geofencing-platform',
    title: 'SKT CBS 위치기반지오펜싱 플랫폼 구축',
    client: 'SKT',
    field: 'lbs',
    from: '2016-07',
    to: '2016-07',
    year: 2016,
  },
  {
    slug: 'ace-life-mobile-sales-support-system',
    title: '에이스 생명 모바일 영업지원시스템 구축',
    client: '에이스생명',
    field: 'finance',
    from: '2016-01',
    to: '2016-05',
    year: 2016,
  },
  {
    slug: 'kt-cbs-location-geofencing-platform',
    title: 'KT CBS 위치기반지오펜싱 플랫폼 구축 및 유지보수',
    client: 'KT',
    field: 'lbs',
    from: '2015-01',
    to: '',
    ongoing: true,
    year: 2015,
  },
  {
    slug: 'kt-location-self-control-maintenance',
    title: 'KT 위치정보 자기제어 유지보수',
    client: 'KT',
    field: 'lbs',
    from: '2013-01',
    to: '',
    ongoing: true,
    year: 2013,
  },
  {
    slug: 'vehicle-total-history-management-system',
    title: '자동차 토털 이력관리 시스템 유지보수 및 기능개선',
    client: '',
    field: 'mobility',
    from: '2015-07',
    to: '2016-01',
    year: 2015,
  },
  {
    slug: 'cj-one-mobile-channel-revamp',
    title: 'CJ ONE 모바일 채널 개편',
    client: 'CJ',
    field: 'etc',
    from: '2015-03',
    to: '2015-03',
    year: 2015,
  },
  {
    slug: 'u-ansim-alimi-service-revamp',
    title: 'U안심알림이 서비스 개편',
    client: '',
    field: 'lbs',
    from: '2015-01',
    to: '2015-01',
    year: 2015,
  },
  {
    slug: 'smart-rental-solution',
    title: '스마트 렌탈 솔루션 구축 및 운영',
    client: '',
    field: 'lbs',
    from: '2015-01',
    to: '',
    ongoing: true,
    year: 2015,
  },
  {
    slug: 'cj-cheiljedang-the-kitchen-app',
    title: 'CJ제일제당 "THE KITCHEN" 스마트폰 어플리케이션 개발',
    client: 'CJ제일제당',
    field: 'etc',
    from: '2014-10',
    to: '2014-10',
    year: 2014,
  },
  {
    slug: 'kt-wps-development-maintenance',
    title: 'KT WPS 개발 유지보수',
    client: 'KT',
    field: 'lbs',
    from: '2013-12',
    to: '2013-12',
    year: 2013,
  },
  {
    slug: 'kt-small-business-portal-system',
    title: 'KT 소상공인 포털 시스템 구축',
    client: 'KT',
    field: 'lbs',
    from: '2013-04',
    to: '2013-04',
    year: 2013,
  },

  // ── 2009~2012년 (12건, 하나의 슬라이드에 병합. 창립 이벤트는 FOUNDED 로 별도 표기) ──
  {
    slug: 'kt-wired-wireless-integrated-lbs-platform',
    title: 'KT 유무선 통합 LBS 플랫폼 구축',
    client: 'KT',
    field: 'lbs',
    from: '2012-12',
    to: '2012-12',
    year: 2012,
  },
  {
    slug: 'korea-securities-computer-mobile-office',
    title: '한국증권전산 모바일오피스 개발',
    client: '한국증권전산',
    field: 'finance',
    from: '2012-08',
    to: '2012-08',
    year: 2012,
  },
  {
    slug: 'hyundai-mnsoft-smartlink-navigation-center-system',
    title: '현대 MnSOFT 스마트링크 센터 -내비게이션센터- 시스템 개발',
    client: '현대MnSOFT',
    field: 'mobility',
    from: '2012-01',
    to: '2012-01',
    year: 2012,
  },
  {
    slug: 'kt-location-self-control-system-build',
    title: 'KT 위치정보자기제어시스템 구축',
    client: 'KT',
    field: 'lbs',
    from: '2011-12',
    to: '2011-12',
    year: 2011,
  },
  {
    slug: 'cj-one-mobile-service-development',
    title: 'CJ One 모바일 서비스 개발',
    client: 'CJ',
    field: 'etc',
    from: '2011-07',
    to: '2011-07',
    year: 2011,
  },
  {
    slug: 'lguplus-mobile-field-work-support-service',
    title: 'LGU+ 모바일 현장업무지원서비스 개발',
    client: 'LGU+',
    field: 'etc',
    from: '2011-03',
    to: '2011-03',
    year: 2011,
  },
  {
    slug: 'cyberlogitec-port-logistics-automation-system',
    title: '사이버 로지텍 항만 물류 자동화 시스템 개발',
    client: '사이버로지텍',
    field: 'etc',
    from: '2011-01',
    to: '2011-01',
    year: 2011,
  },
  {
    slug: 'kt-giftishow-mobile-service',
    title: 'KT 기프티쇼 모바일 서비스 개발',
    client: 'KT',
    field: 'lbs',
    from: '2010-09',
    to: '2010-09',
    year: 2010,
  },
  {
    slug: 'kt-wifi-positioning-system',
    title: 'KT WiFi 측위 시스템 구축',
    client: 'KT',
    field: 'lbs',
    from: '2010-06',
    to: '2010-06',
    year: 2010,
  },
  {
    slug: 'kt-group-gis-platform',
    title: 'KT 그룹GIS 플랫폼 구축',
    client: 'KT',
    field: 'lbs',
    from: '2010-03',
    to: '2010-03',
    year: 2010,
  },
  {
    slug: 'kt-subway-positioning-system',
    title: 'KT 지하철 측위 시스템 구축',
    client: 'KT',
    field: 'lbs',
    from: '2009-12',
    to: '2009-12',
    year: 2009,
  },
  {
    slug: 'etri-u-service-iphone-client-prototype',
    title: 'ETRI U서비스를 위한 아이폰 클라이언트 시제품 제작',
    client: 'ETRI',
    field: 'lbs',
    from: '2009-09',
    to: '2009-09',
    year: 2009,
  },
]

/** 회사 창립 — 사업이 아니므로 WORKS 에는 넣지 않는다 */
export const FOUNDED = { year: 2009, month: 7 }

export const WORK_COUNT = WORKS.length

/** 고객사 목록 — 등장 횟수 내림차순. client: '' (미기재/추정) 항목은 제외한다 */
export const CLIENTS: { name: string; count: number; latest: number }[] = (() => {
  const map = new Map<string, { name: string; count: number; latest: number }>()
  for (const w of WORKS) {
    if (!w.client) continue
    const cur = map.get(w.client)
    if (cur) {
      cur.count += 1
      cur.latest = Math.max(cur.latest, w.year)
    } else {
      map.set(w.client, { name: w.client, count: 1, latest: w.year })
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count)
})()

/** 등장 연도 — 내림차순 고유 연도 */
export const YEARS: number[] = Array.from(new Set(WORKS.map((w) => w.year))).sort((a, b) => b - a)

/**
 * 분야별 **첫 사업의 해** — 회사가 그 분야에 언제 들어섰는지.
 *
 * ⚠ 회사 소개서는 "2017년부터 금융 IT·모빌리티로 확장"이라고 쓰는데, 이력을 재면 그 말이
 *   양쪽 다 틀린다: 모빌리티는 2012년(현대 MnSOFT 스마트링크 센터), 금융은 2016년
 *   (에이스생명 모바일 영업지원시스템)이 처음이다. **화면은 소개서 문장이 아니라 이력을 따른다**
 *   (사용자 결정 2026-08-06). 2017년은 금융이 이어지기 시작한 해로는 맞다 — DGB캐피탈이
 *   2017.09 부터 붙는다. 그래서 "2017년부터"가 아니라 "2016년에 들어서 2017년부터 이어졌다"가
 *   사실에 맞는 말이다.
 */
export const FIELD_START: Record<Work['field'], number> = (() => {
  const out = {} as Record<Work['field'], number>
  for (const w of WORKS) {
    const y = Number(w.from.slice(0, 4))
    if (out[w.field] === undefined || y < out[w.field]) out[w.field] = y
  }
  return out
})()

/**
 * ⚠ 판단이 필요했던 것
 *
 * 1. 고객사 공란(client: '') 처리 — 원문 표에 "미기재" 또는 "추정/확인 필요"로만 적힌 항목은
 *    지어내지 않고 비웠다. 아래 15건이 해당한다.
 *    - (국책과제) 긴급구조용 3차원 정밀측위 (2021) — "국책과제(고객사명 미기재)"
 *    - (국책과제) 긴급구조용 공통측위 단말에이전트 (2021) — 위와 동일
 *    - 국책과제(긴급구조용지능형정밀측위기술개발) (2020) — 위와 동일
 *    - LBS단말기검증 유지보수 (2020) — 원문 "KT(⚠고객사명 미기재, 전후 문맥상 KT로 추정 — 확인 필요)".
 *      전후가 KT 항목이라는 정황만 있고 사업명 자체엔 KT 표기가 없어 추정을 채택하지 않았다.
 *    - D-GNSS 측위 시스템 용역 개발 (2019) — "고객사명 미기재(확인 필요)"
 *    - 재난안전통신망 LBS솔루션 납품 및 유지보수 (2019) — "재난안전통신망 사업(⚠고객사/발주처명 명확히 미기재)"
 *    - 재난안전통신망 A사업구역 LBS 솔루션 납품 및 유지보수 계약 (2018) — "재난안전통신망 사업(확인 필요)"
 *    - 지능형 위치정보 시스템 구축 용역 개발 (2018) — "고객사명 미기재(확인 필요)"
 *    - CBS 지오펜싱 플랫폼 고도화 (2018) — 원문 "KT(추정, 확인 필요)". 포트폴리오 절(7절)엔 KT로 명시되어
 *      있으나, 이 작업의 유일한 근거는 6절 연혁 표이므로 추정을 채택하지 않았다.
 *    - 차세대 WPS 플랫폼 구축 (2018) — 위와 동일 사유("KT(추정, 확인 필요)")
 *    - U 안심알림이 서비스 개발/유지보수 (2016) — 원문 "KT(추정 — 포트폴리오상 'KT U안심알리미'로 명시)".
 *      역시 6절 표 자체엔 KT 표기가 없어 비웠다.
 *    - U안심알림이 서비스 개편 (2015) — "KT(추정)"
 *    - 자동차 토털 이력관리 시스템 유지보수 및 기능개선 (2015~2016) — "고객사명 미기재(포트폴리오 p29
 *      '마이카정보'와 동일 사업으로 추정 — 확인 필요)"
 *    - 스마트 렌탈 솔루션 구축 및 운영 (2015~) — 원문 "자사 솔루션(고객사 아님 — acroFuture 자체 상품)".
 *      고객사가 없는 자사 상품이라 client 를 비웠다.
 *
 * 2. MyRSM (2020, 2021) — client 를 'MyRSM' 그대로 두었다. 원문은 "MyRSM(⚠고객사명 확인 필요 —
 *    문맥상 르노삼성자동차 관련 추정)"이라고 적었지만, "MyRSM"이라는 이름 자체는 사업명에도 나오는
 *    원문 그대로의 토큰이라 지어낸 것이 아니다. 다만 르노삼성/르노코리아와의 관계는 확정하지 않았다.
 *
 * 3. 기간을 구간 시작연도로 대체한 것 —
 *    - KT 위치정보 자기제어 유지보수: 원문 기간이 "~현재" 뿐, 시작 시점이 없다. 소속 구간
 *      "2013~2016년"의 시작연도를 써서 from: '2013-01' 로 두었다(월은 임의 지정).
 *    - KT CBS 위치기반지오펜싱 플랫폼 구축 및 유지보수: 원문 기간이 "15~현재"로 연도만 있고 월이
 *      없어 from: '2015-01' 로 월을 임의 지정했다.
 *
 * 4. field 분류가 애매해 etc 로 둔 것과 그 판단 —
 *    - TestWorks [aiworks] 플랫폼 기획 / TFS Management 사이트 구축 — 테스트 장비 관리 플랫폼으로
 *      금융·모빌리티·측위 어디에도 안 맞음.
 *    - 대구대학교 기초학력평가 시스템, 한국인터넷진흥원 종합포털, DCG 쇼핑몰(기획) — 교육평가·정부포털·
 *      쇼핑몰로 3분류 밖.
 *    - CJ ONE / CJ One 모바일 서비스, CJ제일제당 "THE KITCHEN" — 멤버십·레시피 앱으로 금융·모빌리티·
 *      측위 어디에도 안 맞음.
 *    - KT 소상공인 포털 시스템, KT 기프티쇼 모바일 서비스 — KT 발주 건이지만 측위/LBS 가 아니라
 *      소상공인 포털·기프티콘 서비스라 lbs 로 넣지 않았다.
 *    - LGU+ 모바일 현장업무지원서비스, 사이버로지텍 항만 물류 자동화 시스템 — 통신사/물류사 발주이나
 *      내용이 측위·모빌리티·금융이 아님.
 *    - ETRI U서비스를 위한 아이폰 클라이언트 시제품 제작 — 같은 ETRI 의 다른 항목(단말용 공통 측위
 *      에이전트)은 lbs 지만, 이 건은 사업명에 측위·위치 언급이 없어 etc 로 두었다(판단 필요).
 *    - 한국증권전산 모바일오피스 개발 — 증권업 전산회사이지만 finance 분류 기준(은행·보험·캐피탈·카드)에
 *      명시적으로 들어맞지 않고, 사업 자체도 내부 모바일오피스(직원용 업무 시스템)라 etc 로 두었다(판단 필요).
 *
 * 5. mobility 로 넣었지만 판단이 필요한 것 —
 *    - 자동차 토털 이력관리 시스템 유지보수 및 기능개선 (2015~2016) — 차량 정보 조회 서비스라
 *      "차량" 축에 넣었으나, 현대오토에버/현대자동차류의 내비게이션 사업과는 성격이 다르다.
 *
 * 6. lbs 로 넣었지만 판단이 필요한 것 —
 *    - KT 그룹GIS 플랫폼 구축 (2010) — GIS(지리정보시스템)는 지도 기술이라 mobility 로도 볼 수 있으나,
 *      KT(통신사) 내부의 위치기반 플랫폼 계열 사업이라 lbs 로 분류했다.
 */
