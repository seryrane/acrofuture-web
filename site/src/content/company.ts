/**
 * 회사 정본 — 모든 화면이 이 파일 하나를 본다.
 *
 * ⚠ 출처는 `research/원문조사.md`(회사 소개서 38쪽 전수 조사)다. **여기 없는 숫자는 화면에 쓰지 않는다.**
 *   지금 홈페이지의 `RESOURCES +110` 처럼 근거 없는 수치가 하나 섞이면 나머지까지 의심받는다.
 * ⚠ 사업명·고객사명은 **원문 표기 그대로** 둔다(예: "iM라이프(구 DGB생명)").
 *   사명이 바뀐 곳을 임의로 통일하면 그 시절 계약을 아는 사람이 못 찾는다.
 */

export const COMPANY = {
  nameKo: '주식회사 아크로퓨처',
  nameEn: 'acroFuture Corp.',
  slogan: 'Mobile Future in Reality',
  founded: '2009. 7. 20',
  foundedYear: 2009,
  ceo: '김철우',
  bizNo: '211-88-29376',
  field: '(응용)소프트웨어 개발 및 공급 — LBS 및 IT 서비스 플랫폼 구축·유지보수',
  address: '서울 강남구 도곡로2길 14(도곡동, 규원빌딩) 3F',
  zip: '06258',
  tel: '02-6925-1234',
  fax: '02-6280-2134',
  email: 'help@acrofuture.com',
  /**
   * 업무 포탈 — 임직원용. **아크로퓨처 PoC 포털**(사내 업무 플랫폼).
   *
   * 2026-08-14 **도메인·HTTPS 로 옮겼다**(사용자 지시). 그 전에는
   * `http://211.236.39.250:3400/` 였는데 두 가지가 걸려 있었다:
   *
   * ```
   * TLS 없음   임직원이 실제로 로그인하는 곳인데 사번·비밀번호가 암호화 없이 지나갔다
   * IP+포트    서버를 옮기면 **홈페이지 값도 같이** 고쳐야 했다 — 둘 중 하나를 잊으면
   *            회사 소개 사이트에 죽은 링크가 남는다
   * ```
   *
   * 둘 다 도메인이 없앤다. 확인 시 200(문서 제목 "Acrofuture Portal").
   *
   * ⚠ 이 값 하나를 화면 **네 곳**이 본다(헤더 PC·모바일 · 푸터 · 하단 연락 구간).
   *   주소를 화면에 직접 적지 않는다 — 적는 순간 옮길 때 반드시 한 곳을 빠뜨린다.
   */
  portalUrl: 'https://portal.acrofuture.com/',
  recruitUrl: 'https://www.saramin.co.kr/',
} as const

/** 인력 — 회사 소개서 p3 */
export const PEOPLE = {
  total: 30,
  engineers: 29,
  seniorRatio: 62,
  grades: [
    { label: '특급', n: 5 },
    { label: '고급', n: 6 },
    { label: '중급', n: 7 },
    { label: '초급', n: 11 },
    { label: '기타', n: 1 },
  ],
} as const

/** 조직 — 회사 소개서 p4. ⚠ 기업부설연구소를 포함해 **6개**다(사용자 확인 2026-08-06) */
export const TEAMS = [
  { key: 'T', ko: '전략기술팀', en: 'Technology & Strategy Management' },
  { key: 'F', ko: '디지털금융사업팀', en: 'Digital Financial UI/UX & Software Provide' },
  { key: 'S', ko: '솔루션사업팀', en: 'Solution & Platform Business' },
  { key: 'D', ko: 'IT서비스사업팀', en: 'Development & Service Business' },
  { key: 'R', ko: '기업부설연구소', en: 'Research & Development Center' },
  { key: 'M', ko: '경영지원팀', en: 'Finance & HR Management' },
] as const

/**
 * 첫 주장 — **세 사업을 하나로 묶어** 먼저 말한다.
 *
 * ⚠ 영역부터 늘어놓으면 "이것저것 하는 회사"로 읽힌다. 이 회사의 줄거리는
 *   *위치를 재는 기술에서 시작해 금융·모빌리티로 넓혔다* 는 한 줄이고,
 *   그 뒤에 세 영역이 각각 붙어야 순서가 맞다.
 * ⚠ 숫자는 여기 적지 않는다. `{years}`·`{works}`·`{clients}` 는 화면이 데이터에서 세어 채운다 —
 *   해가 바뀌거나 이력이 한 건 늘 때 문장이 저절로 따라오게 하려는 것이다.
 */
export const OPENING = {
  no: '00',
  en: 'acroFuture',
  headline: '위치를 재는 기술에서\n금융과 모빌리티까지',
  lede: '{years}년 전 위치 기반 서비스로 출발해 금융 IT와 모빌리티 플랫폼으로 넓혔습니다. 지금까지 {clients}곳의 고객과 {works}건의 사업을 만들었고, 만든 것을 오래 지킵니다.',
  points: ['금융 IT', '모빌리티', 'LBS · 측위'],
}

export type FieldKey = 'finance' | 'mobility' | 'lbs'

/** 사업 영역 — 홈의 끌어 넘기는 구간과 /business 가 같은 정본을 본다 */
export const FIELDS: Array<{
  key: FieldKey
  no: string
  ko: string
  en: string
  headline: string
  lede: string
  points: string[]
}> = [
  {
    key: 'finance',
    no: '01',
    ko: '금융 IT',
    en: 'Financial Software',
    // ⚠ 연차를 문장에 적지 않는다 — 해가 바뀌면 틀린 말이 된다(첫 주장에서 계산해 쓴다)
    headline: '금융의 고객채널을\n짓고, 오래 지킵니다',
    lede: '보험과 캐피탈의 고객채널·내부 시스템을 짓고, 끝나면 떠나는 대신 오래 운영합니다. 만든 사람이 지키면 문제가 생겼을 때 원인까지 가는 길이 짧습니다.',
    points: ['iM라이프 IT시스템 개발·운영', 'iM캐피탈 에이전트 영업관리 포털', '카버스(오토금융) 플랫폼'],
  },
  {
    key: 'mobility',
    no: '02',
    ko: '모빌리티',
    en: 'Mobility Platform',
    headline: '차량이 길을 찾는\n방식을 만듭니다',
    lede: '내비게이션의 검색과 지도, 콘텐츠를 만듭니다. 국내에서 검증한 것을 글로벌로 넓히는 일까지 함께합니다.',
    points: ['글로벌 POI Search Service', 'MAPGPT · 내비 3D 시각화', '정보제공 서비스 표준 전개'],
  },
  {
    key: 'lbs',
    no: '03',
    ko: 'LBS · 측위',
    en: 'Location Platform',
    headline: '위치를 정확히 재는 일,\n그 위에서 되는 일',
    lede: '통신사 측위 플랫폼과 국책과제로 15년을 쌓았습니다. 재는 기술에서 그 위치로 무엇을 할지까지 만듭니다.',
    points: ['복합측위엔진 AI/ML 고도화', '긴급구조용 3차원 정밀측위', 'Smart Zone Cast'],
  },
]

/**
 * 인증·특허·수상 — 회사 소개서 p11·p12
 *
 * `img` 는 소개서에 실린 **실물 증서**를 웹용으로 뽑아 둔 것이다(`site/public/media/credentials/`).
 * ⚠ 여기서만 실물 사진을 쓴다. 인증은 "있다고 적는 것"보다 **보여 주는 것**이 힘이 세고,
 *   이건 지어낼 수 없는 종류의 이미지다. 나머지 화면은 사진 대신 도해로 간다.
 * ⚠ 증서에는 사업자등록번호·주소가 함께 찍혀 있다. 이미 대외 배포용 소개서에 실린 내용이지만,
 *   목록에서는 작게 두고 눌렀을 때만 크게 본다.
 */
export const CREDENTIALS = {
  certs: [
    {
      name: '벤처기업확인서',
      detail: '혁신성장유형 · 2022.07.24 ~ 2025.07.23',
      by: '벤처기업확인기관협의회',
      img: '/media/credentials/venture.webp',
    },
    {
      name: '기업부설연구소 인정서',
      detail: '제2019115082호 · 2019.10',
      by: '한국산업기술진흥협회(KOITA)',
      img: '/media/credentials/rnd-center.webp',
    },
    {
      name: '소프트웨어사업자 신고확인서',
      detail: '신고번호 B19-182205 · 2019.09',
      by: '한국소프트웨어산업협회',
      img: '/media/credentials/sw-provider.webp',
    },
  ],
  awards: [
    { name: 'KT 우수협력상', detail: 'AI/IT 분야', when: '2025.02', img: '/media/credentials/award-partner-2025.webp' },
    {
      name: '방송통신위원회 표창장',
      detail: '위치정보 표준화 및 산업발전 기여',
      when: '2012.12',
      img: '/media/credentials/award-kcc.webp',
    },
  ],
  patents: [
    {
      name: '위치기반 푸쉬형 마케팅 서비스 시스템 및 방법',
      no: '제10-1674367호',
      when: '2016.11 등록',
      img: '/media/credentials/patent-1674367.webp',
    },
    {
      name: '다중 주파수에서의 다중 하향링크 정보를 이용한 단말 위치의 측위 방법 및 측위 장치',
      no: '제10-2226683호',
      when: '2021.03 등록',
      img: '/media/credentials/patent-2226683.webp',
    },
  ],
} as const

/**
 * 지도 바로가기 — **주소를 눈으로 읽는 대신 눌러서 확인**하게 한다(사용자 요청 2026-08-07).
 *
 * ⚠ 지도 스크립트를 심지 않는다. 외부 스크립트는 방문자 정보를 흘리고, 정적 배포에서 키 관리도
 *   같이 따라온다(docs/개편_기획.md 8절). **검색 링크만** 열어 준다 — 키도, 추적도 없다.
 * ⚠ 주소를 손으로 두 번 적지 않는다. `COMPANY.address` 하나에서 만든다.
 */
const MAP_QUERY = encodeURIComponent(`${COMPANY.address.split('(')[0].trim()} ${COMPANY.nameKo}`)

export const MAP_LINKS = [
  { label: '네이버 지도', href: `https://map.naver.com/p/search/${MAP_QUERY}` },
  { label: '카카오맵', href: `https://map.kakao.com/?q=${MAP_QUERY}` },
] as const
